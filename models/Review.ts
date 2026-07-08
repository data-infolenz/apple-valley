import mongoose, { Schema, Document, Types } from 'mongoose';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface IReview extends Document {
  bookingId?: Types.ObjectId;
  guestName: string;
  guestEmail?: string;
  rating: number;
  title?: string;
  content: string;
  source: 'website' | 'google' | 'booking.com' | 'tripadvisor' | 'internal';
  status: ReviewStatus;
  featured: boolean;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    content: { type: String, required: true },
    source: {
      type: String,
      enum: ['website', 'google', 'booking.com', 'tripadvisor', 'internal'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    featured: { type: Boolean, default: false },
    reply: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ status: 1, featured: 1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
