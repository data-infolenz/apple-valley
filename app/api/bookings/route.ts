import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, generateBookingId, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildWhatsAppConfirmationUrl, getRoomAvailability } from '@/lib/booking-utils';
import { decodeJsonField, encodeJsonField } from '@/lib/json-fields';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

type BookingAddOnInput = {
  name?: string;
  price?: number;
  quantity?: number;
  unit?: 'per_booking' | 'per_night' | 'per_room';
};

type NormalizedBookingAddOn = {
  name: string;
  price: number;
  quantity: number;
  unit: 'per_booking' | 'per_night' | 'per_room';
};

function parseBookingQuery(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get('status'),
    date: searchParams.get('date'),
    search: searchParams.get('search'),
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
  };
}

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
  confirmedAt: Date | null;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  documentUrl?: string | null;
  documentName?: string | null;
  documentType?: string | null;
  orders?: Array<{
    id: number;
    item: string;
    quantity: number;
    price: number;
    total: number;
    status: string;
    orderedAt: Date;
  }>;
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
    confirmedAt: booking.confirmedAt?.toISOString(),
    checkedInAt: booking.checkedInAt?.toISOString(),
    checkedOutAt: booking.checkedOutAt?.toISOString(),
    cancelledAt: booking.cancelledAt?.toISOString(),
    cancellationReason: booking.cancellationReason,
    documentUrl: booking.documentUrl,
    documentName: booking.documentName,
    documentType: booking.documentType,
    orders: booking.orders?.map((order) => ({
      id: order.id,
      item: order.item,
      quantity: order.quantity,
      price: order.price,
      total: order.total,
      status: order.status,
      orderedAt: order.orderedAt.toISOString(),
    })) || [],
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}

type SerializedBookingInput = Parameters<typeof serializeBooking>[0];

async function saveBookingDocument(file: File | null) {
  if (!file || file.size === 0) return {};

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, WEBP, or PDF documents are allowed');
  }

  if (file.size > maxSize) {
    throw new Error('Document must be 5MB or smaller');
  }

  const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'bookings');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), new Uint8Array(await file.arrayBuffer()));

  return {
    documentUrl: `/uploads/bookings/${fileName}`,
    documentName: file.name,
    documentType: file.type,
  };
}

async function createLocalBookingFromBody(body: Record<string, any>, file: File | null = null) {
  const {
    guest,
    rooms,
    checkIn,
    checkOut,
    adults,
    children,
    addOns,
    specialRequests,
    source = 'website',
    couponCode,
    packageId,
    packageSlug,
  } = body;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  let baseAmount = 0;
  const availability = await getRoomAvailability(checkInDate, checkOutDate);
  const requestedByType: Record<string, number> = {};
  rooms.forEach((roomItem: Record<string, any>) => {
    const key = String(roomItem.roomType || roomItem.roomTypeId || roomItem.slug || '');
    requestedByType[key] = (requestedByType[key] || 0) + 1;
  });

  for (const [roomTypeKey, requestedCount] of Object.entries(requestedByType)) {
    const availabilityItem = availability.find((item) => item.slug === roomTypeKey || item.roomTypeId === roomTypeKey);
    if (availabilityItem && requestedCount > availabilityItem.availableRooms) {
      throw new Error(`${availabilityItem.name} has only ${availabilityItem.availableRooms} rooms available for the selected dates`);
    }
  }

  const roomSnapshots = await Promise.all(rooms.map(async (roomItem: Record<string, any>) => {
    const roomTypeIdOrSlug = roomItem.roomTypeId || roomItem.roomType || roomItem.slug;
    const roomType = await prisma.roomType.findFirst({
      where: {
        isActive: true,
        OR: [
          { slug: String(roomTypeIdOrSlug || '') },
          ...(Number.isInteger(Number(roomTypeIdOrSlug)) ? [{ id: Number(roomTypeIdOrSlug) }] : []),
        ],
      },
    });

    if (!roomType) {
      throw new Error('Selected room type is not available');
    }

    baseAmount += roomType.basePrice * nights;

    return {
      roomTypeId: roomType.slug,
      roomTypeName: roomType.name,
      roomId: roomItem.roomId,
      roomNumber: roomItem.roomNumber,
      pricePerNight: roomType.basePrice,
    };
  }));

  const normalizedAddOns: NormalizedBookingAddOn[] = (addOns || []).map((item: BookingAddOnInput) => ({
    name: item.name || 'Add-on',
    price: Number(item.price || 0),
    quantity: Math.max(1, Number(item.quantity || 1)),
    unit: item.unit || 'per_booking',
  }));

  const addOnAmount = normalizedAddOns.reduce((total: number, item: NormalizedBookingAddOn) => {
    const unitMultiplier = item.unit === 'per_night' ? nights : item.unit === 'per_room' ? rooms.length : 1;
    return total + item.price * item.quantity * unitMultiplier;
  }, 0);

  const taxAmount = Math.round((baseAmount + addOnAmount) * 0.12);
  const now = new Date().toISOString();
  const documentData = await saveBookingDocument(file);
  const booking = await prisma.booking.create({
    data: {
      bookingId: generateBookingId(),
      guestSnapshot: encodeJsonField({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        address: guest.address,
        city: guest.city,
        district: guest.district,
        state: guest.state,
        pincode: guest.pincode,
      }),
      rooms: encodeJsonField(roomSnapshots),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adults || 1,
      children: children || 0,
      nights,
      packageId: packageId || packageSlug,
      addOns: encodeJsonField(normalizedAddOns),
      baseAmount,
      addOnAmount,
      taxAmount,
      discountAmount: 0,
      totalAmount: baseAmount + addOnAmount + taxAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      source,
      ...documentData,
      specialRequests,
      couponCode,
      createdAt: new Date(now),
    },
  });

  return serializeBooking(booking);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { status, date, search, page, limit } = parseBookingQuery(request);
    const where: Record<string, any> = {};

    if (status && status !== 'all') {
      where.bookingStatus = status;
    }

    if (date) {
      const targetStart = new Date(date);
      targetStart.setHours(0, 0, 0, 0);
      const targetEnd = new Date(targetStart);
      targetEnd.setHours(23, 59, 59, 999);
      where.OR = [
        { checkIn: { gte: targetStart, lte: targetEnd } },
        { checkOut: { gte: targetStart, lte: targetEnd } },
      ];
    }

    let matchingBookings: SerializedBookingInput[] = await prisma.booking.findMany({
      where,
      include: { orders: true },
      orderBy: { createdAt: 'desc' },
    });

    if (search) {
      const normalizedSearch = search.toLowerCase();
      matchingBookings = matchingBookings.filter((booking) => {
        const guest = booking.guestSnapshot as { name?: string; phone?: string; email?: string };
        return (
          booking.bookingId.toLowerCase().includes(normalizedSearch) ||
          guest.name?.toLowerCase().includes(normalizedSearch) ||
          guest.phone?.toLowerCase().includes(normalizedSearch) ||
          guest.email?.toLowerCase().includes(normalizedSearch)
        );
      });
    }

    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.max(1, limit);
    const total = matchingBookings.length;
    const bookings = matchingBookings.slice((normalizedPage - 1) * normalizedLimit, normalizedPage * normalizedLimit);

    return NextResponse.json({
      success: true,
      data: bookings.map(serializeBooking),
      pagination: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        pages: Math.ceil(total / normalizedLimit),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let uploadedFile: File | null = null;
    let body: Record<string, any>;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = JSON.parse(String(formData.get('booking') || '{}'));
      const file = formData.get('document');
      uploadedFile = file instanceof File ? file : null;
    } else {
      body = await request.json();
    }

    const { guest, rooms, checkIn, checkOut } = body;

    if (!guest || !rooms || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!guest.name || !guest.email || !guest.phone) {
      return NextResponse.json(
        { success: false, error: 'Guest name, email, and phone are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(rooms) || rooms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one room is required' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid date range' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const booking = await createLocalBookingFromBody(body, uploadedFile);
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, bookingStatus, paymentStatus, cancellationReason } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = {};

    if (bookingStatus) {
      const allowedStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
      if (!allowedStatuses.includes(bookingStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid booking status' },
          { status: 400 }
        );
      }

      update.bookingStatus = bookingStatus;
      if (bookingStatus === 'confirmed') update.confirmedAt = new Date().toISOString();
      if (bookingStatus === 'checked_in') update.checkedInAt = new Date().toISOString();
      if (bookingStatus === 'checked_out') update.checkedOutAt = new Date().toISOString();
      if (bookingStatus === 'cancelled') {
        update.cancelledAt = new Date().toISOString();
        if (cancellationReason) update.cancellationReason = cancellationReason;
      }
    }

    if (paymentStatus) {
      const allowedPaymentStatuses = ['pending', 'partial', 'paid', 'refunded'];
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid payment status' },
          { status: 400 }
        );
      }

      update.paymentStatus = paymentStatus;
    }

    const previousBooking = await prisma.booking.findUnique({ where: { bookingId } });
    const booking = await prisma.booking.update({
      where: { bookingId },
      data: {
        ...update,
        confirmedAt: update.confirmedAt ? new Date(update.confirmedAt as string) : undefined,
        checkedInAt: update.checkedInAt ? new Date(update.checkedInAt as string) : undefined,
        checkedOutAt: update.checkedOutAt ? new Date(update.checkedOutAt as string) : undefined,
        cancelledAt: update.cancelledAt ? new Date(update.cancelledAt as string) : undefined,
      },
    }).catch(() => null);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBooking(booking),
      whatsappUrl: bookingStatus === 'confirmed' && previousBooking?.bookingStatus !== 'confirmed'
        ? buildWhatsAppConfirmationUrl(booking)
        : null,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
