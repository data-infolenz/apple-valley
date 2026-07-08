import mongoose, { Schema, Document, Types } from 'mongoose';

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface IRoom extends Document {
  roomNumber: string;
  floor: number;
  roomTypeId: Types.ObjectId;
  status: RoomStatus;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    floor: { type: Number, required: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'reserved'],
      default: 'available',
    },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

RoomSchema.index({ status: 1 });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
