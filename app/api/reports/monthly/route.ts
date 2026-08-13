import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decodeJsonField, encodeJsonField } from '@/lib/json-fields';

function monthBounds(year: number, month: number) {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1),
  };
}

type MonthlyReportBooking = {
  bookingId: string;
  guestSnapshot: unknown;
  rooms: unknown;
  checkIn: Date;
  checkOut: Date;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: number;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  createdAt: Date;
  orders: Array<{
    item: string;
    quantity: number;
    total: number;
    status: string;
  }>;
};

async function generateMonthlyReport(year: number, month: number) {
  const { start, end } = monthBounds(year, month);
  const bookings: MonthlyReportBooking[] = await prisma.booking.findMany({
    where: { createdAt: { gte: start, lt: end } },
    include: { orders: true },
    orderBy: { createdAt: 'asc' },
  });
  const roomStats = bookings.reduce<Record<string, number>>((items, booking) => {
    const rooms = decodeJsonField<Array<{ roomTypeName?: string }>>(booking.rooms, []);
    rooms.forEach((room) => {
      const name = room.roomTypeName || 'Room';
      items[name] = (items[name] || 0) + 1;
    });
    return items;
  }, {});
  const data = {
    month,
    year,
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((booking) => booking.bookingStatus === 'confirmed').length,
    pendingBookings: bookings.filter((booking) => booking.bookingStatus === 'pending').length,
    cancelledBookings: bookings.filter((booking) => booking.bookingStatus === 'cancelled').length,
    checkIns: bookings.filter((booking) => booking.checkedInAt).length,
    checkOuts: bookings.filter((booking) => booking.checkedOutAt).length,
    revenue: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    roomStats,
    bookings: bookings.map((booking) => ({
      bookingId: booking.bookingId,
      guestSnapshot: decodeJsonField(booking.guestSnapshot, {}),
      rooms: decodeJsonField(booking.rooms, []),
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt.toISOString(),
      orders: booking.orders.map((order) => ({
        item: order.item,
        quantity: order.quantity,
        total: order.total,
        status: order.status,
      })),
    })),
  };

  return prisma.monthlyReport.upsert({
    where: { month_year: { month, year } },
    update: {
      title: `Apple Valley Monthly Report - ${month}/${year}`,
      data: encodeJsonField(data),
    },
    create: {
      month,
      year,
      title: `Apple Valley Monthly Report - ${month}/${year}`,
      data: encodeJsonField(data),
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const now = new Date();
    const month = Number(searchParams.get('month') || now.getMonth() + 1);
    const year = Number(searchParams.get('year') || now.getFullYear());
    const report = await generateMonthlyReport(year, month);

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Get monthly report error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
