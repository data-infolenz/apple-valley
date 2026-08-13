'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, LogOut } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type CustomerBooking = {
  bookingId: string;
  rooms: Array<{ roomTypeName?: string }>;
  checkIn: string;
  checkOut: string;
  bookingStatus: string;
  paymentStatus: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  totalAmount: number;
  orders: Array<{ item: string; quantity: number; total: number; status: string }>;
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch('/api/customer/bookings', { cache: 'no-store' });
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
    };

    loadBookings();
  }, []);

  const logout = async () => {
    await fetch('/api/customer/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-forest-800 dark:text-white">My Bookings</h1>
            <p className="text-forest-600 dark:text-mist-400">Track your stay status and orders</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {isLoading && <p className="text-forest-500">Loading bookings...</p>}
        {!isLoading && bookings.length === 0 && <p className="text-forest-500">No bookings found for this email.</p>}
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <Card key={booking.bookingId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-mono">{booking.bookingId}</span>
                  <Badge className="capitalize">{booking.bookingStatus.replace('_', ' ')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-forest-500">Room</p><p className="font-medium">{booking.rooms[0]?.roomTypeName || '-'}</p></div>
                  <div><p className="text-forest-500">Check-in</p><p className="font-medium">{new Date(booking.checkIn).toLocaleDateString('en-IN')}</p></div>
                  <div><p className="text-forest-500">Check-out</p><p className="font-medium">{new Date(booking.checkOut).toLocaleDateString('en-IN')}</p></div>
                  <div><p className="text-forest-500">Payment</p><p className="font-medium capitalize">{booking.paymentStatus}</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><p className="text-forest-500">Check-in Status</p><p className="font-medium">{booking.checkedInAt ? 'Checked in' : 'Not checked in'}</p></div>
                  <div><p className="text-forest-500">Check-out Status</p><p className="font-medium">{booking.checkedOutAt ? 'Checked out' : 'Not checked out'}</p></div>
                </div>
                <div>
                  <p className="font-semibold text-forest-800 dark:text-white mb-2">Orders</p>
                  {booking.orders.length === 0 ? (
                    <p className="text-sm text-forest-500">No orders yet</p>
                  ) : (
                    <div className="space-y-1">
                      {booking.orders.map((order, index) => (
                        <div key={`${order.item}-${index}`} className="flex justify-between text-sm">
                          <span>{order.item} x {order.quantity}</span>
                          <span>Rs. {order.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
