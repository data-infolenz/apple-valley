import mongoose, { Schema, Document } from 'mongoose';

export interface IGuest extends Document {
  name: string;
  email: string;
  phone: string;
  altPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  pincode?: string;
  idType?: 'aadhar' | 'passport' | 'driving_license' | 'voter_id' | 'other';
  idNumber?: string;
  idProofUrl?: string;
  gstNumber?: string;
  companyName?: string;
  notes?: string;
  totalStays: number;
  totalSpent: number;
  lastVisit?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    altPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    pincode: { type: String, trim: true },
    idType: {
      type: String,
      enum: ['aadhar', 'passport', 'driving_license', 'voter_id', 'other'],
    },
    idNumber: { type: String, trim: true },
    idProofUrl: { type: String },
    gstNumber: { type: String, trim: true },
    companyName: { type: String, trim: true },
    notes: { type: String, trim: true },
    totalStays: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastVisit: { type: Date },
  },
  { timestamps: true }
);

GuestSchema.index({ phone: 1 }, { unique: true });

export default mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema);
