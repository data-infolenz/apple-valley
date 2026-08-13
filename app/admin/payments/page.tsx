'use client';

import { useEffect, useState } from 'react';
import { CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Booking {
  _id: string;
  bookingId: string;
  guestSnapshot: { name: string; phone: string };
  rooms: Array<{ roomTypeName: string }>;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

export default function AdminPaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings?status=all&limit=100', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to load payments');
      setBookings(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updatePayment = async (bookingId: string, paymentStatus: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paymentStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to update payment');
      toast.success('Payment status updated');
      loadBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update payment');
    }
  };

  const totalPending = bookings.filter((booking) => booking.paymentStatus === 'pending').reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Payments</h1>
          <p className="text-forest-600 dark:text-mist-400">Track and update booking payment status</p>
        </div>
        <Button variant="outline" onClick={loadBookings} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Bookings</p><p className="text-2xl font-bold">{bookings.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Pending Amount</p><p className="text-2xl font-bold text-red-600">Rs. {totalPending.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Paid</p><p className="text-2xl font-bold text-green-600">{bookings.filter((booking) => booking.paymentStatus === 'paid').length}</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardContent className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-forest-800 dark:text-white">{booking.bookingId} - {booking.guestSnapshot.name}</p>
                <p className="text-sm text-forest-600 dark:text-mist-400">{booking.rooms[0]?.roomTypeName || 'Room'} - Rs. {booking.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">{booking.paymentStatus}</Badge>
                <Button size="sm" variant="outline" onClick={() => updatePayment(booking.bookingId, 'partial')}>Partial</Button>
                <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white" onClick={() => updatePayment(booking.bookingId, 'paid')}>Mark Paid</Button>
                <Button size="sm" variant="outline" onClick={() => updatePayment(booking.bookingId, 'refunded')}>Refunded</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
