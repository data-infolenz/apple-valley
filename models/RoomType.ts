import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomType extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  size: number; // in sq ft
  featured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomTypeSchema = new Schema<IRoomType>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    basePrice: { type: Number, required: true },
    maxOccupancy: { type: Number, required: true, default: 2 },
    bedType: { type: String, default: 'King' },
    size: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.RoomType || mongoose.model<IRoomType>('RoomType', RoomTypeSchema);
