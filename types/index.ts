import { Types } from 'mongoose';

// All types for the KodaiMist Retreat application

export type UserRole = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'staff';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  _id: string;
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
}

export interface RoomType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  size: number;
  featured: boolean;
  isActive: boolean;
  order: number;
}

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  roomTypeId: string | RoomType;
  status: RoomStatus;
  notes?: string;
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type BookingSource = 'website' | 'phone' | 'walk_in' | 'agent' | 'ota';

export interface BookingAddOn {
  name: string;
  price: number;
  quantity: number;
  unit: 'per_booking' | 'per_night' | 'per_room';
}

export interface RoomSnapshot {
  roomTypeId: string;
  roomTypeName: string;
  roomId?: string;
  roomNumber?: string;
  pricePerNight: number;
}

export interface Booking {
  _id: string;
  bookingId: string;
  guestId: string | Guest;
  guestSnapshot: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  rooms: RoomSnapshot[];
  checkIn: Date | string;
  checkOut: Date | string;
  adults: number;
  children: number;
  nights: number;
  packageId?: string;
  addOns: BookingAddOn[];
  baseAmount: number;
  addOnAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  source: BookingSource;
  specialRequests?: string;
  idProofUrl?: string;
  couponCode?: string;
  confirmedAt?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'online';
export type PaymentType = 'advance' | 'partial' | 'full' | 'refund';

export interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  transactionId?: string;
  notes?: string;
  processedBy?: string;
  createdAt: Date;
}

export interface PackageInclusion {
  name: string;
  description?: string;
}

export interface Package {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  roomTypeId: string | RoomType;
  nights: number;
  inclusions: PackageInclusion[];
  mealPlan: string;
  hasTransport: boolean;
  transportDetails?: string;
  addOns?: string[];
  price: number;
  originalPrice?: number;
  maxOccupancy: number;
  featured: boolean;
  isActive: boolean;
  validFrom: Date | string;
  validTo: Date | string;
}

export type AttractionCategory = 'nature' | 'viewpoint' | 'religious' | 'adventure' | 'park' | 'cave' | 'other';

export interface Attraction {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  category: AttractionCategory;
  distance: number;
  visitDuration: string;
  timings?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  tips?: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

export type CabDuration = 'half_day' | 'full_day';

export interface CabPackage {
  _id: string;
  name: string;
  slug: string;
  description: string;
  duration: CabDuration;
  attractions: string[] | Attraction[];
  vehicleType: string;
  maxPassengers: number;
  price: number;
  includes: string[];
  image?: string;
  isActive: boolean;
}

export type AddOnCategory = 'dining' | 'comfort' | 'celebration' | 'transport' | 'service';
export type AddOnPricingUnit = 'per_booking' | 'per_night' | 'per_room' | 'per_person';

export interface AddOn {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: AddOnCategory;
  price: number;
  pricingUnit: AddOnPricingUnit;
  image?: string;
  available: boolean;
  order: number;
}

export type PricingType = 'multiplier' | 'fixed';
export type SeasonType = 'summer' | 'weekend' | 'holiday' | 'festival' | 'custom';

export interface SeasonalPricing {
  _id: string;
  name: string;
  roomTypeId?: string | RoomType;
  seasonType: SeasonType;
  startDate: Date | string;
  endDate: Date | string;
  pricingType: PricingType;
  multiplier?: number;
  fixedPrice?: number;
  isActive: boolean;
  priority: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  _id: string;
  bookingId?: string;
  guestName: string;
  guestEmail?: string;
  rating: number;
  title?: string;
  content: string;
  source: 'website' | 'google' | 'booking.com' | 'tripadvisor' | 'internal';
  status: ReviewStatus;
  featured: boolean;
  reply?: string;
  repliedAt?: Date;
}

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date | string;
  validTo: Date | string;
  applicableRoomTypes?: string[];
  applicablePackages?: string[];
  isActive: boolean;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskType = 'cleaning' | 'maintenance' | 'laundry' | 'amenity_restock' | 'other';

export interface HousekeepingTask {
  _id: string;
  roomId: string | Room;
  bookingId?: string;
  taskType: TaskType;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | User;
  notes?: string;
  photos?: string[];
  completedAt?: Date;
}

export interface HotelSettings {
  _id: string;
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
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Booking Search Types
export interface BookingSearchParams {
  checkIn: Date | string;
  checkOut: Date | string;
  adults: number;
  children?: number;
  roomTypeId?: string;
}

export interface RoomAvailability {
  roomType: RoomType;
  available: number;
  total: number;
  pricePerNight: number;
  seasonalPrice?: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingPayments: number;
  availableRooms: number;
  totalRooms: number;
}
