import { prisma } from '@/lib/prisma';
import { decodeJsonField } from '@/lib/json-fields';

export const ACTIVE_BOOKING_STATUSES = ['confirmed', 'checked_in'];

export function datesOverlap(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

type AvailabilityRoomType = {
  slug: string;
  name: string;
  rooms: Array<{ isActive: boolean }>;
};

type AvailabilityBooking = {
  rooms: unknown;
};

export async function getRoomAvailability(checkIn: Date, checkOut: Date) {
  const roomTypes: AvailabilityRoomType[] = await prisma.roomType.findMany({
    where: { isActive: true },
    include: { rooms: true },
    orderBy: { order: 'asc' },
  });
  const activeBookings: AvailabilityBooking[] = await prisma.booking.findMany({
    where: {
      bookingStatus: { in: ACTIVE_BOOKING_STATUSES },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });

  return roomTypes.map((roomType) => {
    const totalRooms = roomType.rooms.filter((room) => room.isActive).length;
    const bookedRooms = activeBookings.reduce((count, booking) => {
      const rooms = decodeJsonField<Array<{ roomTypeId?: string; roomTypeName?: string }>>(booking.rooms, []);
      return count + rooms.filter((room) => (
        room.roomTypeId === roomType.slug || room.roomTypeName === roomType.name
      )).length;
    }, 0);

    return {
      roomTypeId: roomType.slug,
      slug: roomType.slug,
      name: roomType.name,
      totalRooms,
      bookedRooms,
      availableRooms: Math.max(totalRooms - bookedRooms, 0),
    };
  });
}

export function buildWhatsAppConfirmationUrl(booking: {
  bookingId: string;
  guestSnapshot: unknown;
  rooms: unknown;
  checkIn: Date | string;
  checkOut: Date | string;
  bookingStatus: string;
}) {
  const guest = decodeJsonField<{ name?: string; phone?: string }>(booking.guestSnapshot, {});
  const rooms = decodeJsonField<Array<{ roomTypeName?: string }>>(booking.rooms, []);
  const phone = (guest.phone || '').replace(/\D/g, '');
  const message = [
    `Dear ${guest.name || 'Guest'}, your booking at Apple Valley is confirmed.`,
    `Booking ID: ${booking.bookingId}`,
    `Room: ${rooms[0]?.roomTypeName || 'Room booking'}`,
    `Check-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}`,
    `Check-out: ${new Date(booking.checkOut).toLocaleDateString('en-IN')}`,
    `Status: ${booking.bookingStatus}`,
  ].join('\n');

  return phone
    ? `https://wa.me/${phone.startsWith('91') ? phone : `91${phone}`}?text=${encodeURIComponent(message)}`
    : null;
}
