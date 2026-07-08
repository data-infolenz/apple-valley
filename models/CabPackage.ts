import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICabPackage extends Document {
  name: string;
  slug: string;
  description: string;
  duration: 'half_day' | 'full_day';
  attractions: Types.ObjectId[];
  vehicleType: string;
  maxPassengers: number;
  price: number;
  includes: string[];
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CabPackageSchema = new Schema<ICabPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    duration: {
      type: String,
      enum: ['half_day', 'full_day'],
      required: true,
    },
    attractions: [{ type: Schema.Types.ObjectId, ref: 'Attraction' }],
    vehicleType: { type: String, default: 'Sedan' },
    maxPassengers: { type: Number, default: 4 },
    price: { type: Number, required: true },
    includes: [{ type: String }],
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.CabPackage || mongoose.model<ICabPackage>('CabPackage', CabPackageSchema);
