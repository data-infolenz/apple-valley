import { ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

type VerificationBooking = {
  id: number;
  bookingId: string;
  guestSnapshot: unknown;
  documentName: string | null;
  documentUrl: string | null;
};

export default async function VerificationPage() {
  const bookings: VerificationBooking[] = await prisma.booking.findMany({
    where: { documentUrl: { not: null } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">ID Verification</h1>
        <p className="text-forest-600 dark:text-mist-400">Uploaded guest documents attached to bookings</p>
      </div>
      <div className="space-y-3">
        {bookings.map((booking) => {
          const guest = booking.guestSnapshot as { name?: string; phone?: string };
          return (
            <Card key={booking.id}>
              <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-forest-800 dark:text-white">{booking.bookingId} - {guest.name || 'Guest'}</p>
                  <p className="text-sm text-forest-600 dark:text-mist-400">{guest.phone || '-'} - {booking.documentName || 'Uploaded document'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline"><ShieldCheck className="w-3 h-3 mr-1" />Uploaded</Badge>
                  {booking.documentUrl && (
                    <a href={booking.documentUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">View Document</Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {bookings.length === 0 && <Card><CardContent className="p-8 text-center text-forest-500">No uploaded ID documents found</CardContent></Card>}
      </div>
    </div>
  );
}
