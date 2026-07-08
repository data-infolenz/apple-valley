import mongoose, { Schema, Document } from 'mongoose';

export type AddOnCategory = 'dining' | 'comfort' | 'celebration' | 'transport' | 'service';
export type AddOnPricingUnit = 'per_booking' | 'per_night' | 'per_room' | 'per_person';

export interface IAddOn extends Document {
  name: string;
  slug: string;
  description: string;
  category: AddOnCategory;
  price: number;
  pricingUnit: AddOnPricingUnit;
  image?: string;
  available: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AddOnSchema = new Schema<IAddOn>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['dining', 'comfort', 'celebration', 'transport', 'service'],
      required: true,
    },
    price: { type: Number, required: true },
    pricingUnit: {
      type: String,
      enum: ['per_booking', 'per_night', 'per_room', 'per_person'],
      default: 'per_booking',
    },
    image: { type: String },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.AddOn || mongoose.model<IAddOn>('AddOn', AddOnSchema);
