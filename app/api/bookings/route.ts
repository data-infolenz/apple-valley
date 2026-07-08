import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Guest from '@/models/Guest';
import RoomType from '@/models/RoomType';
import Package from '@/models/Package';
import { getAuthUser } from '@/lib/auth';
import { generateBookingId } from '@/lib/auth';
import { queryLocalBookings, saveLocalBooking, updateLocalBooking } from '@/lib/local-booking-store';
import mongoose from 'mongoose';

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

const fallbackRoomTypes = {
  'budget-standard': {
    _id: new mongoose.Types.ObjectId('660000000000000000000001'),
    name: 'Budget Standard Room',
    basePrice: 2000,
    isActive: true,
  },
  'deluxe-hill-view': {
    _id: new mongoose.Types.ObjectId('660000000000000000000002'),
    name: 'Deluxe Hill View Room',
    basePrice: 3500,
    isActive: true,
  },
  'premium-balcony': {
    _id: new mongoose.Types.ObjectId('660000000000000000000003'),
    name: 'Premium Balcony Room',
    basePrice: 4500,
    isActive: true,
  },
  'family-cottage': {
    _id: new mongoose.Types.ObjectId('660000000000000000000004'),
    name: 'Family Cottage',
    basePrice: 6000,
    isActive: true,
  },
  'honeymoon-suite': {
    _id: new mongoose.Types.ObjectId('660000000000000000000005'),
    name: 'Honeymoon Suite',
    basePrice: 7500,
    isActive: true,
  },
} as const;

type FallbackRoomSlug = keyof typeof fallbackRoomTypes;

function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) return false;
  return [
    'ECONNREFUSED',
    'ServerSelection',
    'MongoNetwork',
    'MONGODB_URI',
    'bufferCommands',
    'querySrv',
  ].some((message) => error.message.includes(message));
}

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

async function createLocalBookingFromBody(body: Record<string, any>) {
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
  } = body;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  let baseAmount = 0;
  const roomSnapshots = rooms.map((roomItem: Record<string, any>) => {
    const roomTypeIdOrSlug = roomItem.roomTypeId || roomItem.roomType || roomItem.slug;
    const fallbackRoomType = typeof roomTypeIdOrSlug === 'string'
      ? fallbackRoomTypes[roomTypeIdOrSlug as FallbackRoomSlug]
      : undefined;

    if (!fallbackRoomType?.isActive) {
      throw new Error('Selected room type is not available');
    }

    baseAmount += fallbackRoomType.basePrice * nights;

    return {
      roomTypeId: fallbackRoomType._id.toString(),
      roomTypeName: fallbackRoomType.name,
      roomId: roomItem.roomId,
      roomNumber: roomItem.roomNumber,
      pricePerNight: fallbackRoomType.basePrice,
    };
  });

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

  return saveLocalBooking({
    _id: new mongoose.Types.ObjectId().toString(),
    bookingId: generateBookingId(),
    guestSnapshot: {
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      address: guest.address,
    },
    rooms: roomSnapshots,
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    adults: adults || 1,
    children: children || 0,
    nights,
    packageId,
    addOns: normalizedAddOns,
    baseAmount,
    addOnAmount,
    taxAmount,
    discountAmount: 0,
    totalAmount: baseAmount + addOnAmount + taxAmount,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    source,
    specialRequests,
    couponCode,
    createdAt: now,
    updatedAt: now,
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { status, date, search, page, limit } = parseBookingQuery(request);

    const query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const filters: Record<string, unknown>[] = [];

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      filters.push({ $or: [
        { checkIn: { $gte: dayStart, $lte: dayEnd } },
        { checkOut: { $gte: dayStart, $lte: dayEnd } },
      ] });
    }

    if (search) {
      filters.push({ $or: [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'guestSnapshot.name': { $regex: search, $options: 'i' } },
        { 'guestSnapshot.phone': { $regex: search, $options: 'i' } },
      ] });
    }

    if (filters.length) {
      query.$and = filters;
    }

    let total = 0;
    let bookings: unknown[] = [];

    try {
      await dbConnect();
      total = await Booking.countDocuments(query);
      bookings = await Booking.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    } catch (error) {
      if (!isDatabaseUnavailable(error)) {
        throw error;
      }

      const localResult = await queryLocalBookings({ status, date, search, page, limit });
      total = localResult.pagination.total;
      bookings = localResult.bookings;
    }

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
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
  let bodyForFallback: Record<string, any> | null = null;

  try {
    const body = await request.json();
    bodyForFallback = body;
    const {
      guest,
      rooms,
      checkIn,
      checkOut,
      adults,
      children,
      packageId,
      packageSlug,
      addOns,
      specialRequests,
      source = 'website',
      couponCode,
    } = body;

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

    try {
      await dbConnect();
    } catch (error) {
      if (!isDatabaseUnavailable(error)) {
        throw error;
      }

      const booking = await createLocalBookingFromBody(body);
      return NextResponse.json({
        success: true,
        data: booking,
        message: 'Booking created successfully',
      });
    }

    let guestDoc = await Guest.findOne({ phone: guest.phone });
    if (!guestDoc) {
      guestDoc = await Guest.create({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        address: guest.address,
        city: guest.city,
        state: guest.state,
        pincode: guest.pincode,
        idType: guest.idType,
        idNumber: guest.idNumber,
      });
    }

    let baseAmount = 0;
    const roomSnapshots = [];

    let resolvedPackageId = packageId;
    if (!resolvedPackageId && packageSlug) {
      const pkg = await Package.findOne({ slug: packageSlug, isActive: true })
        .select('_id')
        .lean<{ _id: mongoose.Types.ObjectId } | null>();
      resolvedPackageId = pkg?._id;
    }

    for (const roomItem of rooms) {
      const roomTypeIdOrSlug = roomItem.roomTypeId || roomItem.roomType || roomItem.slug;
      const roomType = mongoose.Types.ObjectId.isValid(roomTypeIdOrSlug)
        ? await RoomType.findById(roomTypeIdOrSlug)
        : await RoomType.findOne({ slug: roomTypeIdOrSlug });
      const fallbackRoomType = typeof roomTypeIdOrSlug === 'string'
        ? fallbackRoomTypes[roomTypeIdOrSlug as FallbackRoomSlug]
        : undefined;
      const roomTypeSnapshot = roomType || fallbackRoomType;

      if (!roomTypeSnapshot || !roomTypeSnapshot.isActive) {
        return NextResponse.json(
          { success: false, error: 'Selected room type is not available' },
          { status: 400 }
        );
      }

      baseAmount += roomTypeSnapshot.basePrice * nights;
      roomSnapshots.push({
        roomTypeId: roomTypeSnapshot._id,
        roomTypeName: roomTypeSnapshot.name,
        roomId: roomItem.roomId,
        roomNumber: roomItem.roomNumber,
        pricePerNight: roomTypeSnapshot.basePrice,
      });
    }

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

    const totalAmount = baseAmount + addOnAmount + taxAmount;

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      guestId: guestDoc._id,
      guestSnapshot: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        address: guest.address,
      },
      rooms: roomSnapshots,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adults || 1,
      children: children || 0,
      nights,
      packageId: resolvedPackageId,
      addOns: normalizedAddOns,
      baseAmount,
      addOnAmount,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      source,
      specialRequests,
      couponCode,
    });

    // Update guest stats
    await Guest.findByIdAndUpdate(guestDoc._id, {
      $inc: { totalStays: 1, totalSpent: totalAmount },
      lastVisit: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Create booking error:', error);
    if (isDatabaseUnavailable(error) && bodyForFallback) {
      try {
        const booking = await createLocalBookingFromBody(bodyForFallback);
        return NextResponse.json({
          success: true,
          data: booking,
          message: 'Booking created successfully',
        });
      } catch {
        return NextResponse.json(
          { success: false, error: 'Unable to save booking locally' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
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
      if (bookingStatus === 'confirmed') update.confirmedAt = new Date();
      if (bookingStatus === 'checked_in') update.checkedInAt = new Date();
      if (bookingStatus === 'checked_out') update.checkedOutAt = new Date();
      if (bookingStatus === 'cancelled') {
        update.cancelledAt = new Date();
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

    let booking;

    try {
      await dbConnect();
      booking = await Booking.findOneAndUpdate({ bookingId }, update, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      if (!isDatabaseUnavailable(error)) {
        throw error;
      }

      booking = await updateLocalBooking(bookingId, update);
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
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
