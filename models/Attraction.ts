import mongoose, { Schema, Document } from 'mongoose';

export type AttractionCategory = 'nature' | 'viewpoint' | 'religious' | 'adventure' | 'park' | 'cave' | 'other';

export interface IAttraction extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  category: AttractionCategory;
  distance: number; // in km from hotel
  visitDuration: string;
  timings?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  tips?: string;
  featured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AttractionSchema = new Schema<IAttraction>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    category: {
      type: String,
      enum: ['nature', 'viewpoint', 'religious', 'adventure', 'park', 'cave', 'other'],
      default: 'nature',
    },
    distance: { type: Number, required: true },
    visitDuration: { type: String, required: true },
    timings: { type: String },
    entryFee: { type: String },
    bestTimeToVisit: { type: String },
    tips: { type: String },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Attraction || mongoose.model<IAttraction>('Attraction', AttractionSchema);
