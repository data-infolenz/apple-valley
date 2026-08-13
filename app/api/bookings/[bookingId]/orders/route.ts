import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const user = await getAuthUser();
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const quantity = Math.max(1, Number(body.quantity || 1));
    const price = Math.max(0, Number(body.price || 0));

    if (!body.item) {
      return NextResponse.json(
        { success: false, error: 'Order item is required' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        bookingId: booking.id,
        item: body.item,
        quantity,
        price,
        total: quantity * price,
        status: body.status || 'pending',
        orderedAt: body.orderedAt ? new Date(body.orderedAt) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        orderedAt: order.orderedAt.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      },
      message: 'Order added successfully',
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
