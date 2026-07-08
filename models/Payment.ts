import mongoose, { Schema, Document, Types } from 'mongoose';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'online';
export type PaymentType = 'advance' | 'partial' | 'full' | 'refund';

export interface IPayment extends Document {
  bookingId: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  transactionId?: string;
  notes?: string;
  processedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'online'],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['advance', 'partial', 'full', 'refund'],
      required: true,
    },
    transactionId: { type: String },
    notes: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ createdAt: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
