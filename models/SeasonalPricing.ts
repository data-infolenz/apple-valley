import mongoose, { Schema, Document, Types } from 'mongoose';

export type PricingType = 'multiplier' | 'fixed';
export type SeasonType = 'summer' | 'weekend' | 'holiday' | 'festival' | 'custom';

export interface ISeasonalPricing extends Document {
  name: string;
  roomTypeId?: Types.ObjectId;
  seasonType: SeasonType;
  startDate: Date;
  endDate: Date;
  pricingType: PricingType;
  multiplier?: number;
  fixedPrice?: number;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const SeasonalPricingSchema = new Schema<ISeasonalPricing>(
  {
    name: { type: String, required: true, trim: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: 'RoomType' },
    seasonType: {
      type: String,
      enum: ['summer', 'weekend', 'holiday', 'festival', 'custom'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pricingType: {
      type: String,
      enum: ['multiplier', 'fixed'],
      required: true,
    },
    multiplier: { type: Number },
    fixedPrice: { type: Number },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SeasonalPricingSchema.index({ startDate: 1, endDate: 1 });
SeasonalPricingSchema.index({ roomTypeId: 1 });

export default mongoose.models.SeasonalPricing || mongoose.model<ISeasonalPricing>('SeasonalPricing', SeasonalPricingSchema);
