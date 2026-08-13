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
  FileText,
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
  baseAmount?: number;
  addOnAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  source: string;
  createdAt: string;
  addOns?: Array<{
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  documentUrl?: string;
  documentName?: string;
  orders?: Array<{
    id: number;
    item: string;
    quantity: number;
    price: number;
    total: number;
    status: string;
    orderedAt: string;
  }>;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [orderItem, setOrderItem] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0);

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
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
      toast.success(`Booking ${bookingId} status updated to ${newStatus.replace('_', ' ')}`);
      return result.data as Booking;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update booking');
      return null;
    }
  };

  const handleAddOrder = async () => {
    if (!selectedBooking || !orderItem || orderPrice <= 0) {
      toast.error('Enter order item and price');
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.bookingId}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: orderItem,
          quantity: orderQuantity,
          price: orderPrice,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to add order');
      }

      const updatedBooking = {
        ...selectedBooking,
        orders: [...(selectedBooking.orders || []), result.data],
      };
      setSelectedBooking(updatedBooking);
      setBookings(prev => prev.map(booking => (
        booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking
      )));
      setOrderItem('');
      setOrderQuantity(1);
      setOrderPrice(0);
      toast.success('Order added');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to add order');
    }
  };

  const handleExport = () => {
    if (bookings.length === 0) {
      toast.error('No bookings to export');
      return;
    }

    const headers = ['Booking ID', 'Guest', 'Phone', 'Email', 'Room', 'Check-in', 'Check-out', 'Status', 'Payment', 'Amount'];
    const rows = bookings.map((booking) => [
      booking.bookingId,
      booking.guestSnapshot.name,
      booking.guestSnapshot.phone,
      booking.guestSnapshot.email,
      booking.rooms.map((room) => room.roomTypeName).join(', '),
      formatDate(booking.checkIn),
      formatDate(booking.checkOut),
      booking.bookingStatus.replace('_', ' '),
      booking.paymentStatus,
      booking.totalAmount,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apple-valley-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success('Bookings exported');
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${Math.round(amount || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const escapeHtml = (value: unknown) => {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const generateInvoice = (booking: Booking) => {
    const roomTotal = booking.baseAmount ?? booking.rooms.reduce((sum, room) => (
      sum + Number(room.pricePerNight || 0) * booking.nights
    ), 0);
    const addOnTotal = booking.addOnAmount ?? (booking.addOns || []).reduce((sum, item) => {
      const multiplier = item.unit === 'per_night' ? booking.nights : item.unit === 'per_room' ? booking.rooms.length : 1;
      return sum + Number(item.price || 0) * Number(item.quantity || 1) * multiplier;
    }, 0);
    const orderTotal = (booking.orders || []).reduce((sum, order) => sum + Number(order.total || 0), 0);
    const taxAmount = booking.taxAmount ?? Math.round((roomTotal + addOnTotal) * 0.12);
    const discountAmount = booking.discountAmount ?? 0;
    const grandTotal = booking.totalAmount + orderTotal;
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const roomRows = booking.rooms.map((room, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(room.roomTypeName)}${room.roomNumber ? ` - Room ${escapeHtml(room.roomNumber)}` : ''}</td>
        <td>${booking.nights} night${booking.nights === 1 ? '' : 's'}</td>
        <td>${formatCurrency(room.pricePerNight)}</td>
        <td>${formatCurrency(Number(room.pricePerNight || 0) * booking.nights)}</td>
      </tr>
    `).join('');

    const addOnRows = (booking.addOns || []).map((item, index) => {
      const multiplier = item.unit === 'per_night' ? booking.nights : item.unit === 'per_room' ? booking.rooms.length : 1;
      const quantity = Number(item.quantity || 1);
      const total = Number(item.price || 0) * quantity * multiplier;
      return `
        <tr>
          <td>${booking.rooms.length + index + 1}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${quantity}${multiplier > 1 ? ` x ${multiplier}` : ''}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(total)}</td>
        </tr>
      `;
    }).join('');

    const orderRows = (booking.orders || []).map((order, index) => `
      <tr>
        <td>${booking.rooms.length + (booking.addOns || []).length + index + 1}</td>
        <td>${escapeHtml(order.item)}</td>
        <td>${order.quantity}</td>
        <td>${formatCurrency(order.price)}</td>
        <td>${formatCurrency(order.total)}</td>
      </tr>
    `).join('');

    const invoiceHtml = `
      <!doctype html>
      <html>
        <head>
          <title>Invoice ${escapeHtml(booking.bookingId)}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 32px; color: #17261d; font-family: Arial, sans-serif; background: #f6f8f4; }
            .invoice { max-width: 900px; margin: 0 auto; background: #fff; border: 1px solid #d9e4d7; border-radius: 8px; padding: 32px; }
            .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #1f4f35; padding-bottom: 20px; }
            .brand { font-size: 28px; font-weight: 700; color: #1f4f35; }
            .muted { color: #5f7368; font-size: 13px; line-height: 1.6; }
            .title { text-align: right; }
            .title h1 { margin: 0 0 8px; font-size: 30px; letter-spacing: 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
            .box { border: 1px solid #d9e4d7; border-radius: 8px; padding: 16px; }
            .box h3 { margin: 0 0 12px; font-size: 14px; color: #1f4f35; text-transform: uppercase; }
            .line { display: flex; justify-content: space-between; gap: 16px; margin: 8px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #eaf2e8; color: #1f4f35; text-align: left; font-size: 13px; }
            th, td { padding: 12px; border-bottom: 1px solid #e3ece1; font-size: 14px; vertical-align: top; }
            td:last-child, th:last-child { text-align: right; }
            .summary { width: 340px; margin-left: auto; margin-top: 24px; }
            .total { font-size: 18px; font-weight: 700; border-top: 2px solid #1f4f35; padding-top: 12px; }
            .status { display: inline-block; padding: 5px 10px; border-radius: 999px; background: #eaf2e8; color: #1f4f35; text-transform: capitalize; font-size: 12px; font-weight: 700; }
            .footer { margin-top: 32px; padding-top: 18px; border-top: 1px solid #d9e4d7; }
            .actions { margin: 0 auto 16px; max-width: 900px; text-align: right; }
            button { border: 0; background: #1f4f35; color: #fff; padding: 10px 14px; border-radius: 6px; cursor: pointer; }
            @media print {
              body { background: #fff; padding: 0; }
              .invoice { border: 0; border-radius: 0; }
              .actions { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="actions"><button onclick="window.print()">Print / Save PDF</button></div>
          <main class="invoice">
            <section class="header">
              <div>
                <div class="brand">Apple Valley</div>
                <div class="muted">
                  Kodaikanal, Tamil Nadu<br />
                  Phone: +91 93619 79918<br />
                  Invoice for booking services
                </div>
              </div>
              <div class="title">
                <h1>Invoice</h1>
                <div class="muted">Invoice No: INV-${escapeHtml(booking.bookingId)}</div>
                <div class="muted">Date: ${invoiceDate}</div>
                <div class="muted">Booking ID: ${escapeHtml(booking.bookingId)}</div>
              </div>
            </section>

            <section class="grid">
              <div class="box">
                <h3>Bill To</h3>
                <div><strong>${escapeHtml(booking.guestSnapshot.name)}</strong></div>
                <div class="muted">${escapeHtml(booking.guestSnapshot.phone)}</div>
                <div class="muted">${escapeHtml(booking.guestSnapshot.email)}</div>
              </div>
              <div class="box">
                <h3>Stay Details</h3>
                <div class="line"><span>Check-in</span><strong>${formatDate(booking.checkIn)} at 2:00 PM</strong></div>
                <div class="line"><span>Check-out</span><strong>${formatDate(booking.checkOut)} at 11:00 AM</strong></div>
                <div class="line"><span>Guests</span><strong>${booking.adults} adults, ${booking.children} children</strong></div>
                <div class="line"><span>Status</span><span class="status">${escapeHtml(booking.bookingStatus.replace('_', ' '))}</span></div>
              </div>
            </section>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${roomRows}
                ${addOnRows}
                ${orderRows}
              </tbody>
            </table>

            <section class="summary">
              <div class="line"><span>Room Charges</span><strong>${formatCurrency(roomTotal)}</strong></div>
              <div class="line"><span>Add-ons</span><strong>${formatCurrency(addOnTotal)}</strong></div>
              <div class="line"><span>Orders</span><strong>${formatCurrency(orderTotal)}</strong></div>
              <div class="line"><span>Tax</span><strong>${formatCurrency(taxAmount)}</strong></div>
              ${discountAmount > 0 ? `<div class="line"><span>Discount</span><strong>- ${formatCurrency(discountAmount)}</strong></div>` : ''}
              <div class="line total"><span>Total</span><span>${formatCurrency(grandTotal)}</span></div>
              <div class="line"><span>Payment Status</span><strong>${escapeHtml(booking.paymentStatus)}</strong></div>
            </section>

            <section class="footer muted">
              Thank you for choosing Apple Valley. Please present this invoice at checkout or payment settlement.
            </section>
          </main>
          <script>
            window.addEventListener('load', () => window.setTimeout(() => window.print(), 300));
          </script>
        </body>
      </html>
    `;

    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      toast.error('Allow popups to generate the invoice');
      return;
    }

    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
  };

  const handleCheckout = async (booking: Booking) => {
    const updatedBooking = await handleStatusUpdate(booking.bookingId, 'checked_out');
    if (updatedBooking) {
      generateInvoice(updatedBooking);
    }
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
          <Button variant="outline" className="text-forest-600 dark:text-forest-400" onClick={handleExport}>
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
                          <DropdownMenuItem onClick={() => generateInvoice(booking)}>
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Invoice
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
                          {booking.bookingStatus === 'checked_in' && (
                            <DropdownMenuItem onClick={() => handleCheckout(booking)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Check Out & Invoice
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <DialogTitle className="text-xl font-heading">
                Booking Details - {selectedBooking?.bookingId}
              </DialogTitle>
              {selectedBooking && (
                <Button
                  size="sm"
                  className="bg-forest-600 hover:bg-forest-700 text-white"
                  onClick={() => generateInvoice(selectedBooking)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Invoice
                </Button>
              )}
            </div>
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

              <div className="p-4 bg-forest-50 dark:bg-forest-900/50 rounded-lg">
                <h4 className="font-semibold text-forest-800 dark:text-white mb-3">Document</h4>
                {selectedBooking.documentUrl ? (
                  <a
                    href={selectedBooking.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-forest-700 dark:text-mist-300 underline"
                  >
                    {selectedBooking.documentName || 'View uploaded document'}
                  </a>
                ) : (
                  <p className="text-sm text-forest-500 dark:text-mist-400">No document uploaded</p>
                )}
              </div>

              <div className="p-4 bg-forest-50 dark:bg-forest-900/50 rounded-lg">
                <h4 className="font-semibold text-forest-800 dark:text-white mb-3">Orders</h4>
                <div className="space-y-2 mb-4">
                  {(selectedBooking.orders || []).length === 0 ? (
                    <p className="text-sm text-forest-500 dark:text-mist-400">No orders added</p>
                  ) : (
                    (selectedBooking.orders || []).map((order) => (
                      <div key={order.id} className="flex justify-between text-sm">
                        <span className="text-forest-700 dark:text-mist-300">
                          {order.item} x {order.quantity}
                        </span>
                        <span className="font-medium text-forest-800 dark:text-white">
                          Rs. {order.total.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input placeholder="Item/service" value={orderItem} onChange={(e) => setOrderItem(e.target.value)} />
                  <Input type="number" min={1} value={orderQuantity} onChange={(e) => setOrderQuantity(Number(e.target.value))} />
                  <Input type="number" min={0} value={orderPrice} onChange={(e) => setOrderPrice(Number(e.target.value))} />
                  <Button onClick={handleAddOrder} className="bg-forest-600 hover:bg-forest-700 text-white">
                    Add Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
