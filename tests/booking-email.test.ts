import assert from 'node:assert/strict';
import { test } from 'node:test';
import nodemailer from 'nodemailer';
import { bookingReceiptText, sendBookingReceipt } from '../lib/booking-email';

const booking = {
  bookingId: 'AV-TEST',
  guestSnapshot: JSON.stringify({ name: '<Guest>', email: 'guest@example.com' }),
  rooms: JSON.stringify([{ roomTypeName: 'Deluxe' }]),
  checkIn: '2026-10-01T00:00:00.000Z',
  checkOut: '2026-10-03T00:00:00.000Z',
  nights: 2,
  totalAmount: 5600,
  bookingStatus: 'pending',
  paymentStatus: 'pending',
};

test('receipt uses saved booking details and preserves pending status', () => {
  const text = bookingReceiptText(booking);
  for (const expected of ['AV-TEST', 'Deluxe', '1 October 2026', '3 October 2026', '5,600.00', 'Booking status: pending', 'Payment status: pending']) {
    assert.ok(text.includes(expected), expected);
  }
});

test('admin-approved receipt confirms the stay without claiming payment', () => {
  const text = bookingReceiptText({ ...booking, bookingStatus: 'confirmed' });
  assert.ok(text.includes('approved by our team and is now confirmed'));
  assert.ok(text.includes('Booking status: confirmed'));
  assert.ok(text.includes('Payment status: pending'));
  assert.ok(text.includes('not a payment receipt'));
  assert.ok(!text.includes('subject to confirmation'));
});

test('SMTP uses TLS and the guest recipient; failures do not throw after booking', async () => {
  const original = nodemailer.createTransport;
  const previous = { ...process.env };
  Object.assign(process.env, {
    SMTP_HOST: 'smtp.example.com', SMTP_PORT: '465', SMTP_USER: 'sender@example.com',
    SMTP_PASSWORD: 'test-only', SMTP_FROM: 'sender@example.com',
  });
  try {
    let options: any;
    let message: any;
    nodemailer.createTransport = ((input: any) => {
      options = input;
      return { sendMail: async (mail: any) => { message = mail; return { accepted: ['guest@example.com'] }; } };
    }) as typeof original;
    assert.equal(await sendBookingReceipt(booking), 'sent');
    assert.equal(options.secure, true);
    assert.equal(options.port, 465);
    assert.equal(message.to.address, 'guest@example.com');
    assert.equal(message.from.address, 'sender@example.com');
    assert.equal(message.html, undefined);
    assert.equal(await sendBookingReceipt({ ...booking, bookingStatus: 'confirmed' }), 'sent');
    assert.equal(message.subject, 'Apple Valley booking confirmed - AV-TEST');
    assert.equal(message.to.address, 'guest@example.com');
    assert.ok(message.text.includes('Booking status: confirmed'));

    process.env.SMTP_PORT = '587';
    assert.equal(await sendBookingReceipt(booking), 'sent');
    assert.equal(options.secure, false);
    assert.equal(options.requireTLS, true);

    nodemailer.createTransport = (() => ({ sendMail: async () => ({ accepted: [] }) })) as unknown as typeof original;
    assert.equal(await sendBookingReceipt(booking), 'failed');

    nodemailer.createTransport = (() => ({ sendMail: async () => { throw new Error('SMTP unavailable'); } })) as unknown as typeof original;
    assert.equal(await sendBookingReceipt(booking), 'failed');
    delete process.env.SMTP_PASSWORD;
    assert.equal(await sendBookingReceipt(booking), 'failed');
  } finally {
    nodemailer.createTransport = original;
    for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM']) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
