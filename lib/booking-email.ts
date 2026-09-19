import nodemailer from 'nodemailer';
import { decodeJsonField } from './json-fields';

type BookingReceipt = {
  bookingId: string;
  guestSnapshot: unknown;
  rooms: unknown;
  checkIn: string | Date;
  checkOut: string | Date;
  nights: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
};

export function createMailTransport() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  const port = Number(process.env.SMTP_PORT || 465);
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP configuration is incomplete');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export function bookingReceiptText(booking: BookingReceipt) {
  const guest = decodeJsonField<{ name?: string }>(booking.guestSnapshot, {});
  const rooms = decodeJsonField<Array<{ roomTypeName: string }>>(booking.rooms, []);
  const date = (value: string | Date) => new Date(value).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric',
  });
  return [
    `Hello ${guest.name || 'Guest'},`,
    '',
    booking.bookingStatus === 'confirmed'
      ? 'Your booking has been approved by our team and is now confirmed. We look forward to welcoming you to Apple Valley Hotel!'
      : 'Thank you for booking with Apple Valley Hotel. We have received your reservation.',
    '',
    `Booking ID: ${booking.bookingId}`,
    `Rooms: ${rooms.map((room) => room.roomTypeName).join(', ')}`,
    `Check-in: ${date(booking.checkIn)} at 10:00 AM`,
    `Check-out: ${date(booking.checkOut)} at 9:00 AM`,
    `Nights: ${booking.nights}`,
    `Total: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(booking.totalAmount)}`,
    `Booking status: ${booking.bookingStatus}`,
    `Payment status: ${booking.paymentStatus}`,
    '',
    booking.bookingStatus === 'confirmed'
      ? 'Your reservation is confirmed. This email is not a payment receipt; your payment status is shown above.'
      : 'A pending reservation is subject to confirmation by the hotel. This email is not a payment receipt.',
    'Sign in or sign up on our website using your booking email to view your stay status.',
    '',
    'Apple Valley Hotel, Kodaikanal',
    'For assistance, call +91 9488401385.',
  ].join('\n');
}

export async function sendBookingReceipt(booking: BookingReceipt): Promise<'sent' | 'failed'> {
  try {
    const guest = decodeJsonField<{ email: string }>(booking.guestSnapshot, { email: '' });
    const result = await createMailTransport().sendMail({
      from: { name: 'Apple Valley Hotel', address: process.env.SMTP_FROM! },
      to: { name: '', address: guest.email },
      subject: `Apple Valley booking ${booking.bookingStatus === 'confirmed' ? 'confirmed' : 'received'} - ${booking.bookingId}`,
      text: bookingReceiptText(booking),
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    if (!result.accepted.length) throw new Error('Recipient was not accepted');
    return 'sent';
  } catch {
    // Do not log SMTP credentials or guest information. The reservation remains saved.
    console.error('Booking receipt email failed', { bookingId: booking.bookingId });
    return 'failed';
  }
}
