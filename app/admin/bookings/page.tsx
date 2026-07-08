'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  MoreHorizontal,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  checked_in: 'badge-checked-in',
  checked_out: 'badge-checked-out',
  cancelled: 'badge-cancelled',
};

const bookingStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];

interface Booking {
  _id: string;
  bookingId: string;
  guestSnapshot: {
    name: string;
    email: string;
    phone: string;
  };
  rooms: Array<{
    roomTypeName: string;
    roomNumber?: string;
    pricePerNight: number;
  }>;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  source: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '100',
        status: statusFilter,
      });

      if (searchQuery) params.set('search', searchQuery);
      if (dateFilter) params.set('date', dateFilter);

      const response = await fetch(`/api/bookings?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to load bookings');
      }

      setBookings(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, searchQuery, statusFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(loadBookings, 250);
    return () => window.clearTimeout(timeout);
  }, [loadBookings]);

  useEffect(() => {
    const loadStatusCounts = async () => {
      try {
        const results = await Promise.all(
          bookingStatuses.map(async (status) => {
            const response = await fetch(`/api/bookings?status=${status}&limit=1`);
            const result = await response.json();
            return [status, response.ok && result.success ? result.pagination.total : 0] as const;
          })
        );

        setStatusCounts(Object.fromEntries(results));
      } catch {
        setStatusCounts({});
      }
    };

    loadStatusCounts();
  }, [bookings]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, bookingStatus: newStatus }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to update booking');
      }

      setBookings(prev => prev.map(booking => (
        booking.bookingId === bookingId ? result.data : booking
      )));
      setSelectedBooking(prev => (
        prev?.bookingId === bookingId ? result.data : prev
      ));
      toast.success(`Booking ${bookingId} status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update booking');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">
            Bookings
          </h1>
          <p className="text-forest-600 dark:text-mist-400">
            Manage all reservations and bookings
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="text-forest-600 dark:text-forest-400"
            onClick={loadBookings}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" className="text-forest-600 dark:text-forest-400">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/booking">
            <Button className="bg-forest-600 hover:bg-forest-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-forest-600 dark:text-mist-400">Pending</p>
            <p className="text-2xl font-bold text-walnut-600">{statusCounts.pending || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-forest-600 dark:text-mist-400">Confirmed</p>
            <p className="text-2xl font-bold text-forest-600">{statusCounts.confirmed || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-forest-600 dark:text-mist-400">Checked In</p>
            <p className="text-2xl font-bold text-lake-600">{statusCounts.checked_in || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-forest-600 dark:text-mist-400">Checked Out</p>
            <p className="text-2xl font-bold text-stone-600">{statusCounts.checked_out || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-forest-600 dark:text-mist-400">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
              <Input
                placeholder="Search by booking ID, guest name or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-full sm:w-40"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-forest-50 dark:bg-forest-900/50">
                  <TableHead className="font-semibold">Booking ID</TableHead>
                  <TableHead className="font-semibold">Guest</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
                  <TableHead className="font-semibold">Check-in</TableHead>
                  <TableHead className="font-semibold">Check-out</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-forest-500">
                      Loading bookings...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-forest-500">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && bookings.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-forest-50 dark:hover:bg-forest-900/30">
                    <TableCell className="font-mono font-medium text-forest-800 dark:text-white">
                      {booking.bookingId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-forest-800 dark:text-white">
                          {booking.guestSnapshot.name}
                        </p>
                        <p className="text-sm text-forest-500 dark:text-mist-400">
                          {booking.guestSnapshot.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-forest-700 dark:text-mist-300">{booking.rooms[0]?.roomTypeName}</p>
                    </TableCell>
                    <TableCell className="text-forest-600 dark:text-mist-400">
                      {formatDate(booking.checkIn)}
                    </TableCell>
                    <TableCell className="text-forest-600 dark:text-mist-400">
                      {formatDate(booking.checkOut)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[booking.bookingStatus]} capitalize text-xs`}>
                        {booking.bookingStatus.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          booking.paymentStatus === 'paid'
                            ? 'border-green-500 text-green-600'
                            : booking.paymentStatus === 'partial'
                            ? 'border-walnut-500 text-walnut-600'
                            : 'border-red-500 text-red-600'
                        }`}
                      >
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-forest-800 dark:text-white">
                      ₹{booking.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {booking.bookingStatus === 'pending' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(booking.bookingId, 'confirmed')}>
                              <Check className="w-4 h-4 mr-2" />
                              Confirm
                            </DropdownMenuItem>
                          )}
                          {booking.bookingStatus === 'confirmed' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(booking.bookingId, 'checked_in')}>
                              <Users className="w-4 h-4 mr-2" />
                              Check In
                            </DropdownMenuItem>
                          )}
                          {booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'checked_out' && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleStatusUpdate(booking.bookingId, 'cancelled')}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              Booking Details - {selectedBooking?.bookingId}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Guest Info */}
              <div className="p-4 bg-forest-50 dark:bg-forest-900/50 rounded-lg">
                <h4 className="font-semibold text-forest-800 dark:text-white mb-3">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Name</p>
                    <p className="font-medium text-forest-800 dark:text-white">{selectedBooking.guestSnapshot.name}</p>
                  </div>
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Phone</p>
                    <p className="font-medium text-forest-800 dark:text-white">{selectedBooking.guestSnapshot.phone}</p>
                  </div>
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Email</p>
                    <p className="font-medium text-forest-800 dark:text-white">{selectedBooking.guestSnapshot.email}</p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="p-4 bg-forest-50 dark:bg-forest-900/50 rounded-lg">
                <h4 className="font-semibold text-forest-800 dark:text-white mb-3">Booking Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Room Type</p>
                    <p className="font-medium text-forest-800 dark:text-white">
                      {selectedBooking.rooms[0]?.roomTypeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Nights</p>
                    <p className="font-medium text-forest-800 dark:text-white">{selectedBooking.nights}</p>
                  </div>
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Check-in</p>
                    <p className="font-medium text-forest-800 dark:text-white">
                      {formatDate(selectedBooking.checkIn)} at 2:00 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Check-out</p>
                    <p className="font-medium text-forest-800 dark:text-white">
                      {formatDate(selectedBooking.checkOut)} at 11:00 AM
                    </p>
                  </div>
                  <div>
                    <p className="text-forest-500 dark:text-mist-400">Guests</p>
                    <p className="font-medium text-forest-800 dark:text-white">
                      {selectedBooking.adults} adults, {selectedBooking.children} children
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-forest-50 dark:bg-forest-900/50 rounded-lg">
                <h4 className="font-semibold text-forest-800 dark:text-white mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-forest-500 dark:text-mist-400">Room Charges</span>
                    <span className="text-forest-800 dark:text-white">
                      ₹{selectedBooking.rooms.reduce((sum, r) => sum + r.pricePerNight * selectedBooking.nights, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-500 dark:text-mist-400">Tax (12%)</span>
                    <span className="text-forest-800 dark:text-white">
                      ₹{Math.round(selectedBooking.totalAmount * 0.12).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-forest-200 dark:border-forest-700 pt-2">
                    <span className="text-forest-800 dark:text-white">Total Amount</span>
                    <span className="text-forest-800 dark:text-white">
                      ₹{selectedBooking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
