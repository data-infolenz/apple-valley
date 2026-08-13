import { NextResponse } from 'next/server';
import { getAuthUser, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decodeJsonField } from '@/lib/json-fields';

type DashboardRoomSnapshot = {
  roomTypeName?: string;
  roomNumber?: string;
};

type DashboardRoomType = {
  slug: string;
  name: string;
  rooms: Array<{ isActive: boolean }>;
};

type DashboardPackage = {
  slug: string;
  name: string;
  price: number;
};

function serializeBooking(booking: {
  id: number;
  bookingId: string;
  guestSnapshot: unknown;
  rooms: unknown;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  nights: number;
  packageId: string | null;
  addOns: unknown;
  baseAmount: number;
  addOnAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  source: string;
  specialRequests: string | null;
  couponCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const guestSnapshot = decodeJsonField(booking.guestSnapshot, {});
  const rooms = decodeJsonField(booking.rooms, []);
  const addOns = decodeJsonField(booking.addOns, []);

  return {
    _id: booking.id.toString(),
    bookingId: booking.bookingId,
    guestSnapshot,
    rooms,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    adults: booking.adults,
    children: booking.children,
    nights: booking.nights,
    packageId: booking.packageId,
    addOns,
    baseAmount: booking.baseAmount,
    addOnAmount: booking.addOnAmount,
    taxAmount: booking.taxAmount,
    discountAmount: booking.discountAmount,
    totalAmount: booking.totalAmount,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
    source: booking.source,
    specialRequests: booking.specialRequests,
    couponCode: booking.couponCode,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}

type DashboardBookingRecord = Parameters<typeof serializeBooking>[0];

async function buildDashboardResponse() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const bookingsFromDb: DashboardBookingRecord[] = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const allBookings = bookingsFromDb.map(serializeBooking);
  const recentBookings = allBookings.slice(0, 5);
  const monthlyRevenue = allBookings
    .filter((booking) => {
      const createdAt = new Date(booking.createdAt);
      return createdAt >= monthStart && createdAt < nextMonthStart;
    })
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const todayActivities = allBookings
    .flatMap((booking) => {
      const bookingRooms = Array.isArray(booking.rooms)
        ? booking.rooms as Array<DashboardRoomSnapshot>
        : [];
      const room = bookingRooms
        .map((item: DashboardRoomSnapshot) => item.roomNumber)
        .filter(Boolean)
        .join(', ') || bookingRooms[0]?.roomTypeName || '-';
      const activities: Array<{ time: string; activity: string; guest: string; room: string }> = [];
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      if (checkIn >= todayStart && checkIn <= todayEnd) {
        activities.push({
          time: '02:00 PM',
          activity: 'Check-in',
          guest: (booking.guestSnapshot as { name?: string }).name || 'Guest',
          room,
        });
      }

      if (checkOut >= todayStart && checkOut <= todayEnd) {
        activities.push({
          time: '11:00 AM',
          activity: 'Check-out',
          guest: (booking.guestSnapshot as { name?: string }).name || 'Guest',
          room,
        });
      }

      return activities;
    })
    .slice(0, 5);

  const addOnSales = allBookings
    .flatMap((booking) => Array.isArray(booking.addOns) ? booking.addOns as Array<{ name: string; price: number; quantity: number }> : [])
    .reduce<Record<string, { name: string; sold: number; revenue: number }>>((items, addOn) => {
      const current = items[addOn.name] || { name: addOn.name, sold: 0, revenue: 0 };
      current.sold += addOn.quantity;
      current.revenue += addOn.price * addOn.quantity;
      items[addOn.name] = current;
      return items;
    }, {});

  const pendingPayments = allBookings.filter((booking) => booking.paymentStatus === 'pending');
  const roomTypes: DashboardRoomType[] = await prisma.roomType.findMany({
    include: { rooms: true },
    orderBy: { order: 'asc' },
  });
  const activeBookings = allBookings.filter((booking) => !['cancelled', 'checked_out'].includes(booking.bookingStatus));
  const roomAvailability = roomTypes.map((roomType) => {
    const total = roomType.rooms.filter((room) => room.isActive).length;
    const occupied = activeBookings.filter((booking) => {
      const rooms = Array.isArray(booking.rooms) ? booking.rooms as Array<{ roomTypeId?: string; roomTypeName?: string }> : [];
      return rooms.some((room) => room.roomTypeId === roomType.slug || room.roomTypeName === roomType.name);
    }).length;

    return {
      type: roomType.name.replace(' Room', ''),
      total,
      available: Math.max(total - occupied, 0),
    };
  });
  const totalRooms = roomAvailability.reduce((sum, room) => sum + room.total, 0);
  const availableRooms = roomAvailability.reduce((sum, room) => sum + room.available, 0);
  const packages: DashboardPackage[] = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: [{ featured: 'desc' }, { price: 'desc' }],
    take: 3,
  });
  const topPackages = packages.map((pkg) => ({
    name: pkg.name,
    bookings: allBookings.filter((booking) => booking.packageId === pkg.slug).length,
    revenue: allBookings
      .filter((booking) => booking.packageId === pkg.slug)
      .reduce((sum, booking) => sum + booking.totalAmount, 0) || pkg.price,
  }));

  return NextResponse.json({
    success: true,
    data: {
      bookings: {
        all: allBookings,
        recent: recentBookings,
      },
      stats: {
        totalBookings: allBookings.length,
        todayCheckIns: todayActivities.filter((activity) => activity.activity === 'Check-in').length,
        monthlyRevenue,
        occupancyRate: totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0,
        availableRooms,
      },
      roomAvailability,
      todayActivities,
      topPackages,
      addOnSales: Object.values(addOnSales).sort((a, b) => b.revenue - a.revenue).slice(0, 4),
      pendingPayments: {
        count: pendingPayments.length,
        total: pendingPayments.reduce((sum, booking) => sum + booking.totalAmount, 0),
      },
    },
  });
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    return buildDashboardResponse();
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
