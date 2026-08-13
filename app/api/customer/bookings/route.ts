import { NextResponse } from 'next/server';
import { getCustomerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decodeJsonField } from '@/lib/json-fields';

type CustomerBooking = {
  id: number;
  bookingId: string;
  guestSnapshot: unknown;
  rooms: unknown;
  checkIn: Date;
  checkOut: Date;
  bookingStatus: string;
  paymentStatus: string;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  totalAmount: number;
  orders: Array<{
    item: string;
    quantity: number;
    total: number;
    status: string;
    orderedAt: Date;
  }>;
};

export async function GET() {
  try {
    const customer = await getCustomerUser();
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const bookings: CustomerBooking[] = await prisma.booking.findMany({
      include: { orders: true },
      orderBy: { createdAt: 'desc' },
    });
    const ownBookings = bookings.filter((booking) => {
      const guest = decodeJsonField<{ email?: string }>(booking.guestSnapshot, {});
      return guest.email?.toLowerCase() === customer.email.toLowerCase();
    });

    return NextResponse.json({
      success: true,
      data: ownBookings.map((booking) => ({
        _id: booking.id.toString(),
        bookingId: booking.bookingId,
        guestSnapshot: decodeJsonField(booking.guestSnapshot, {}),
        rooms: decodeJsonField(booking.rooms, []),
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        checkedInAt: booking.checkedInAt?.toISOString(),
        checkedOutAt: booking.checkedOutAt?.toISOString(),
        totalAmount: booking.totalAmount,
        orders: booking.orders.map((order) => ({
          item: order.item,
          quantity: order.quantity,
          total: order.total,
          status: order.status,
          orderedAt: order.orderedAt.toISOString(),
        })),
      })),
    });
  } catch (error) {
    console.error('Get customer bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
