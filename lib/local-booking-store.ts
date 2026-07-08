import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export type LocalBooking = {
  _id: string;
  bookingId: string;
  guestSnapshot: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  rooms: Array<{
    roomTypeId: string;
    roomTypeName: string;
    roomId?: string;
    roomNumber?: string;
    pricePerNight: number;
  }>;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  packageId?: string;
  addOns: Array<{
    name: string;
    price: number;
    quantity: number;
    unit: 'per_booking' | 'per_night' | 'per_room';
  }>;
  baseAmount: number;
  addOnAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  source: string;
  specialRequests?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
};

export type LocalBookingQuery = {
  status?: string | null;
  date?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
};

const dataDirectory = path.join(process.cwd(), 'data');
const bookingFile = path.join(dataDirectory, 'local-bookings.json');

async function readBookings(): Promise<LocalBooking[]> {
  try {
    const content = await readFile(bookingFile, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: LocalBooking[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(bookingFile, JSON.stringify(bookings, null, 2), 'utf8');
}

export async function saveLocalBooking(booking: LocalBooking) {
  const bookings = await readBookings();
  bookings.unshift(booking);
  await writeBookings(bookings);
  return booking;
}

export async function queryLocalBookings(query: LocalBookingQuery = {}) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.max(1, Number(query.limit || 20));
  const search = query.search?.trim().toLowerCase();

  let bookings = await readBookings();

  if (query.status && query.status !== 'all') {
    bookings = bookings.filter((booking) => booking.bookingStatus === query.status);
  }

  if (query.date) {
    const targetDate = new Date(query.date);
    targetDate.setHours(0, 0, 0, 0);
    const targetTime = targetDate.getTime();

    bookings = bookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      return checkIn.getTime() === targetTime || checkOut.getTime() === targetTime;
    });
  }

  if (search) {
    bookings = bookings.filter((booking) => (
      booking.bookingId.toLowerCase().includes(search) ||
      booking.guestSnapshot.name.toLowerCase().includes(search) ||
      booking.guestSnapshot.phone.toLowerCase().includes(search)
    ));
  }

  const total = bookings.length;
  const start = (page - 1) * limit;

  return {
    bookings: bookings.slice(start, start + limit),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateLocalBooking(
  bookingId: string,
  update: Partial<LocalBooking>
) {
  const bookings = await readBookings();
  const index = bookings.findIndex((booking) => booking.bookingId === bookingId);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...bookings[index],
    ...update,
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = updated;
  await writeBookings(bookings);
  return updated;
}

export async function getLocalBookings() {
  return readBookings();
}
