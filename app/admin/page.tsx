'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  BedDouble,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Package,
  MapPin,
  Coffee,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const stats = [
  {
    title: 'Total Bookings',
    value: '156',
    change: '+12%',
    changeType: 'increase',
    icon: Calendar,
    color: 'bg-forest-100 text-forest-600 dark:bg-forest-800 dark:text-forest-400',
  },
  {
    title: 'Today Check-ins',
    value: '8',
    change: '+3',
    changeType: 'increase',
    icon: Users,
    color: 'bg-lake-100 text-lake-600 dark:bg-lake-900 dark:text-lake-400',
  },
  {
    title: 'Occupancy Rate',
    value: '78%',
    change: '-5%',
    changeType: 'decrease',
    icon: BedDouble,
    color: 'bg-walnut-100 text-walnut-600 dark:bg-walnut-900 dark:text-walnut-400',
  },
  {
    title: 'Revenue (This Month)',
    value: '₹4.2L',
    change: '+18%',
    changeType: 'increase',
    icon: CreditCard,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  },
];

const recentBookings = [
  {
    id: 'AV-ABC123',
    guest: 'Priya Sharma',
    room: 'Premium Balcony',
    checkIn: '2024-01-15',
    status: 'confirmed',
    amount: 12400,
  },
  {
    id: 'AV-DEF456',
    guest: 'Rahul Menon',
    room: 'Family Cottage',
    checkIn: '2024-01-15',
    status: 'checked_in',
    amount: 22800,
  },
  {
    id: 'AV-GHI789',
    guest: 'Anjali Krishnan',
    room: 'Honeymoon Suite',
    checkIn: '2024-01-16',
    status: 'pending',
    amount: 28500,
  },
  {
    id: 'AV-JKL012',
    guest: 'Suresh Kumar',
    room: 'Deluxe Hill View',
    checkIn: '2024-01-16',
    status: 'confirmed',
    amount: 8400,
  },
];

const todayActivities = [
  { time: '09:00 AM', activity: 'Check-out', guest: 'Rohit Verma', room: '201' },
  { time: '10:30 AM', activity: 'Check-in', guest: 'Priya Sharma', room: '302' },
  { time: '12:00 PM', activity: 'Check-out', guest: 'Family Wilson', room: '105-106' },
  { time: '02:00 PM', activity: 'Check-in', guest: 'Rahul Menon', room: '401' },
  { time: '03:30 PM', activity: 'Check-in', guest: 'Anjali Krishnan', room: '501' },
];

const fallbackTopPackages = [
  { name: 'Honeymoon Package', bookings: 45, revenue: 1125000 },
  { name: 'Family Vacation', bookings: 38, revenue: 759620 },
  { name: 'Couple Misty Stay', bookings: 32, revenue: 287968 },
];

const fallbackAddOnSales = [
  { name: 'Candle Light Dinner', sold: 89, revenue: 133500 },
  { name: 'Sightseeing Cab', sold: 62, revenue: 124000 },
  { name: 'Room Heater', sold: 156, revenue: 46800 },
  { name: 'Campfire', sold: 98, revenue: 49000 },
];

const roomAvailability = [
  { type: 'Budget Standard', total: 8, available: 2 },
  { type: 'Deluxe Hill View', total: 12, available: 3 },
  { type: 'Premium Balcony', total: 10, available: 2 },
  { type: 'Family Cottage', total: 4, available: 1 },
  { type: 'Honeymoon Suite', total: 4, available: 0 },
];

const statusColors: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  checked_in: 'badge-checked-in',
  checked_out: 'badge-checked-out',
  cancelled: 'badge-cancelled',
};

interface DashboardBooking {
  _id: string;
  bookingId: string;
  guestSnapshot: {
    name: string;
    phone: string;
  };
  rooms: Array<{
    roomTypeName: string;
    roomNumber?: string;
  }>;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

interface RoomAvailability {
  type: string;
  total: number;
  available: number;
}

interface DashboardSummary {
  bookings: {
    all: DashboardBooking[];
    recent: DashboardBooking[];
  };
  stats: {
    totalBookings: number;
    todayCheckIns: number;
    monthlyRevenue: number;
    occupancyRate: number;
    availableRooms: number;
  };
  roomAvailability: RoomAvailability[];
  todayActivities: Array<{ time: string; activity: string; guest: string; room: string }>;
  topPackages: Array<{ name: string; bookings: number; revenue: number }>;
  addOnSales: Array<{ name: string; sold: number; revenue: number }>;
  pendingPayments: {
    count: number;
    total: number;
  };
}

export default function AdminDashboard() {
  const [liveBookings, setLiveBookings] = useState<DashboardBooking[]>([]);
  const [allBookings, setAllBookings] = useState<DashboardBooking[]>([]);
  const [liveRoomAvailability, setLiveRoomAvailability] = useState<RoomAvailability[]>(roomAvailability);
  const [liveTodayActivities, setLiveTodayActivities] = useState(todayActivities);
  const [liveTopPackages, setLiveTopPackages] = useState(fallbackTopPackages);
  const [liveAddOnSales, setLiveAddOnSales] = useState(fallbackAddOnSales);
  const [pendingPaymentSummary, setPendingPaymentSummary] = useState({ count: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const result: { success: boolean; data?: DashboardSummary; error?: string } = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Unable to load dashboard');
        }

        setLiveBookings(result.data.bookings.recent);
        setAllBookings(result.data.bookings.all);
        setLiveRoomAvailability(result.data.roomAvailability.length ? result.data.roomAvailability : roomAvailability);
        setLiveTodayActivities(result.data.todayActivities.length ? result.data.todayActivities : todayActivities);
        setLiveTopPackages(result.data.topPackages.length ? result.data.topPackages : fallbackTopPackages);
        setLiveAddOnSales(result.data.addOnSales.length ? result.data.addOnSales : fallbackAddOnSales);
        setPendingPaymentSummary(result.data.pendingPayments);
      } catch (error) {
        console.error('Dashboard load failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthlyRevenue = allBookings
    .filter((booking) => {
      const createdAt = new Date(booking.createdAt);
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    })
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  const todayCheckIns = allBookings.filter((booking) => booking.checkIn.slice(0, 10) === today).length;
  const totalRooms = liveRoomAvailability.reduce((sum, room) => sum + room.total, 0);
  const availableRooms = liveRoomAvailability.reduce((sum, room) => sum + room.available, 0);
  const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
  const dashboardStats = [
    { ...stats[0], value: allBookings.length.toString(), change: isLoading ? '...' : 'Live' },
    { ...stats[1], value: todayCheckIns.toString(), change: isLoading ? '...' : 'Today' },
    {
      ...stats[2],
      value: `${occupancyRate}%`,
      change: `${availableRooms} available`,
      changeType: occupancyRate >= 70 ? 'increase' : 'decrease',
    },
    { ...stats[3], value: `Rs. ${(monthlyRevenue / 100000).toFixed(1)}L`, change: isLoading ? '...' : 'Live' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-forest-600 dark:text-mist-400">
            Welcome back! Here&apos;s what&apos;s happening at Apple Valley
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/booking">
            <Button className="bg-forest-600 hover:bg-forest-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-forest-600 dark:text-mist-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-forest-800 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-forest-400">
                        {stat.change === 'Live' ? 'from MongoDB' : ''}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-forest-800 dark:text-white">
                Recent Bookings
              </CardTitle>
              <Link href="/admin/bookings">
                <Button variant="ghost" size="sm" className="text-forest-600 dark:text-forest-400">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-forest-500 dark:text-mist-400 border-b border-forest-100 dark:border-forest-800">
                      <th className="pb-3 font-medium">Booking ID</th>
                      <th className="pb-3 font-medium">Guest</th>
                      <th className="pb-3 font-medium">Room</th>
                      <th className="pb-3 font-medium">Check-in</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveBookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-sm text-forest-500">
                          {isLoading ? 'Loading bookings...' : 'No bookings found'}
                        </td>
                      </tr>
                    )}
                    {liveBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-forest-50 dark:border-forest-800/50 last:border-0">
                        <td className="py-3 text-sm font-mono text-forest-800 dark:text-white">
                          {booking.bookingId}
                        </td>
                        <td className="py-3 text-sm text-forest-700 dark:text-mist-300">
                          {booking.guestSnapshot.name}
                        </td>
                        <td className="py-3 text-sm text-forest-600 dark:text-mist-400">
                          {booking.rooms[0]?.roomTypeName || '-'}
                        </td>
                        <td className="py-3 text-sm text-forest-600 dark:text-mist-400">
                          {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3">
                          <Badge className={`${statusColors[booking.bookingStatus]} capitalize text-xs`}>
                            {booking.bookingStatus.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm font-medium text-forest-800 dark:text-white text-right">
                          Rs. {booking.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-forest-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-walnut-600" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveTodayActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.activity === 'Check-in' ? 'bg-green-500' : 'bg-walnut-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-forest-800 dark:text-white">
                          {activity.activity}
                        </span>
                        <span className="text-xs text-forest-500 dark:text-mist-400">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-forest-600 dark:text-mist-400">
                        {activity.guest} - Room {activity.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Room Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-forest-800 dark:text-white flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-forest-600" />
              Room Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveRoomAvailability.map((room) => (
                <div key={room.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-forest-700 dark:text-mist-300">{room.type}</span>
                    <span className="text-sm font-medium text-forest-800 dark:text-white">
                      {room.available}/{room.total}
                    </span>
                  </div>
                  <Progress
                    value={(room.available / room.total) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-forest-800 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-walnut-600" />
              Top Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveTopPackages.map((pkg, index) => (
                <div key={pkg.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-sm font-bold text-forest-600 dark:text-forest-400">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-forest-800 dark:text-white">
                        {pkg.name}
                      </p>
                      <p className="text-xs text-forest-500 dark:text-mist-400">
                        {pkg.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-forest-800 dark:text-white">
                    ₹{(pkg.revenue / 100000).toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add-on Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-forest-800 dark:text-white flex items-center gap-2">
              <Coffee className="w-5 h-5 text-walnut-600" />
              Add-on Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveAddOnSales.map((addon) => (
                <div key={addon.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-forest-800 dark:text-white">
                      {addon.name}
                    </p>
                    <p className="text-xs text-forest-500 dark:text-mist-400">
                      {addon.sold} sold
                    </p>
                  </div>
                  <span className="text-sm font-medium text-forest-800 dark:text-white">
                    ₹{addon.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Alert */}
      <Card className="bg-walnut-50 dark:bg-walnut-900/20 border-walnut-200 dark:border-walnut-800">
        <CardContent className="p-4 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-walnut-600" />
          <div className="flex-1">
            <p className="font-medium text-walnut-800 dark:text-walnut-200">
              Pending Payments Alert
            </p>
            <p className="text-sm text-walnut-600 dark:text-walnut-400">
              {pendingPaymentSummary.count} bookings have pending payments worth Rs. {pendingPaymentSummary.total.toLocaleString()}. Review and follow up.
            </p>
          </div>
          <Link href="/admin/payments?status=pending">
            <Button variant="outline" className="border-walnut-300 text-walnut-700 dark:border-walnut-700 dark:text-walnut-300">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
