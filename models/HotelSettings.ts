import mongoose, { Schema, Document } from 'mongoose';

export interface IHotelSettings extends Document {
  hotelName: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  whatsappNumber: string;
  checkInTime: string;
  checkOutTime: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  mapEmbedUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSettingsSchema = new Schema<IHotelSettings>(
  {
    hotelName: { type: String, default: 'KodaiMist Retreat' },
    tagline: { type: String, default: 'Stay Above the Clouds' },
    description: { type: String },
    logo: { type: String },
    favicon: { type: String },
    address: { type: String, default: 'Lake Road, Kodaikanal' },
    city: { type: String, default: 'Kodaikanal' },
    state: { type: String, default: 'Tamil Nadu' },
    country: { type: String, default: 'India' },
    pincode: { type: String, default: '624101' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    whatsappNumber: { type: String },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      youtube: { type: String },
    },
    mapEmbedUrl: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.HotelSettings || mongoose.model<IHotelSettings>('HotelSettings', HotelSettingsSchema);
