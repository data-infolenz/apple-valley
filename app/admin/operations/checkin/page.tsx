'use client';

import { useEffect, useState } from 'react';
import { Check, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Booking {
  _id: string;
  bookingId: string;
  guestSnapshot: { name: string; phone: string };
  rooms: Array<{ roomTypeName: string; roomNumber?: string }>;
  checkIn: string;
  checkOut: string;
  bookingStatus: string;
  paymentStatus: string;
}

export default function CheckInOutPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings?status=all&limit=100', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to load bookings');
      setBookings(result.data.filter((booking: Booking) => ['confirmed', 'checked_in'].includes(booking.bookingStatus)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (bookingId: string, bookingStatus: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, bookingStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to update booking');
      toast.success(`Booking moved to ${bookingStatus.replace('_', ' ')}`);
      loadBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update booking');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Check-in / Check-out</h1>
          <p className="text-forest-600 dark:text-mist-400">Move confirmed guests through arrival and checkout</p>
        </div>
        <Button variant="outline" onClick={loadBookings} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-forest-600" />
                  <span className="font-semibold text-forest-800 dark:text-white">{booking.guestSnapshot.name}</span>
                  <Badge className="capitalize">{booking.bookingStatus.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm text-forest-600 dark:text-mist-400">{booking.bookingId} - {booking.rooms[0]?.roomTypeName || 'Room'}</p>
                <p className="text-sm text-forest-600 dark:text-mist-400">
                  {new Date(booking.checkIn).toLocaleDateString('en-IN')} to {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                </p>
              </div>
              {booking.bookingStatus === 'confirmed' ? (
                <Button className="bg-forest-600 hover:bg-forest-700 text-white" onClick={() => updateStatus(booking.bookingId, 'checked_in')}>
                  <Check className="w-4 h-4 mr-2" />Check In
                </Button>
              ) : (
                <Button className="bg-walnut-600 hover:bg-walnut-700 text-white" onClick={() => updateStatus(booking.bookingId, 'checked_out')}>
                  <Check className="w-4 h-4 mr-2" />Check Out
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && bookings.length === 0 && <Card><CardContent className="p-8 text-center text-forest-500">No confirmed or checked-in bookings</CardContent></Card>}
      </div>
    </div>
  );
}
