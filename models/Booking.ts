import mongoose, { Schema, Document, Types } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type BookingSource = 'website' | 'phone' | 'walk_in' | 'agent' | 'ota';

export interface IBookingAddOn {
  name: string;
  price: number;
  quantity: number;
  unit: 'per_booking' | 'per_night' | 'per_room';
}

export interface IRoomSnapshot {
  roomTypeId: Types.ObjectId;
  roomTypeName: string;
  roomId?: Types.ObjectId;
  roomNumber?: string;
  pricePerNight: number;
}

export interface IBooking extends Document {
  bookingId: string;
  guestId: Types.ObjectId;
  guestSnapshot: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  rooms: IRoomSnapshot[];
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  nights: number;
  packageId?: Types.ObjectId;
  addOns: IBookingAddOn[];
  baseAmount: number;
  addOnAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  source: BookingSource;
  specialRequests?: string;
  idProofUrl?: string;
  couponCode?: string;
  confirmedAt?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    guestId: { type: Schema.Types.ObjectId, ref: 'Guest', required: true },
    guestSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
    },
    rooms: [{
      roomTypeId: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
      roomTypeName: { type: String, required: true },
      roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
      roomNumber: { type: String },
      pricePerNight: { type: Number, required: true },
    }],
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    nights: { type: Number, required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    addOns: [{
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      unit: { type: String, enum: ['per_booking', 'per_night', 'per_room'], default: 'per_booking' },
    }],
    baseAmount: { type: Number, required: true },
    addOnAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
      default: 'pending',
    },
    source: {
      type: String,
      enum: ['website', 'phone', 'walk_in', 'agent', 'ota'],
      default: 'website',
    },
    specialRequests: { type: String },
    idProofUrl: { type: String },
    couponCode: { type: String },
    confirmedAt: { type: Date },
    checkedInAt: { type: Date },
    checkedOutAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ guestId: 1 });
BookingSchema.index({ checkIn: 1, checkOut: 1 });
BookingSchema.index({ bookingStatus: 1 });
BookingSchema.index({ createdAt: -1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
