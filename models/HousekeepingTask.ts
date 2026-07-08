import mongoose, { Schema, Document, Types } from 'mongoose';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskType = 'cleaning' | 'maintenance' | 'laundry' | 'amenity_restock' | 'other';

export interface IHousekeepingTask extends Document {
  roomId: Types.ObjectId;
  bookingId?: Types.ObjectId;
  taskType: TaskType;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: Types.ObjectId;
  notes?: string;
  photos?: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HousekeepingTaskSchema = new Schema<IHousekeepingTask>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    taskType: {
      type: String,
      enum: ['cleaning', 'maintenance', 'laundry', 'amenity_restock', 'other'],
      default: 'cleaning',
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    photos: [{ type: String }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

HousekeepingTaskSchema.index({ status: 1 });
HousekeepingTaskSchema.index({ assignedTo: 1 });

export default mongoose.models.HousekeepingTask || mongoose.model<IHousekeepingTask>('HousekeepingTask', HousekeepingTaskSchema);
