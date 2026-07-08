import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPackageInclusion {
  name: string;
  description?: string;
}

export interface IPackage extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  roomTypeId: Types.ObjectId;
  nights: number;
  inclusions: IPackageInclusion[];
  mealPlan: string;
  hasTransport: boolean;
  transportDetails?: string;
  addOns?: string[];
  price: number;
  originalPrice?: number;
  maxOccupancy: number;
  featured: boolean;
  isActive: boolean;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    roomTypeId: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
    nights: { type: Number, required: true },
    inclusions: [{
      name: { type: String, required: true },
      description: { type: String },
    }],
    mealPlan: { type: String, default: 'Breakfast' },
    hasTransport: { type: Boolean, default: false },
    transportDetails: { type: String },
    addOns: [{ type: String }],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    maxOccupancy: { type: Number, default: 2 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
