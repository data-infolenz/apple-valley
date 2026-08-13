import { ClipboardCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

type HousekeepingRoom = {
  id: number;
  roomNumber: string;
  floor: number;
  status: string;
  isActive: boolean;
  roomType: {
    name: string;
  };
};

export default async function HousekeepingPage() {
  const rooms: HousekeepingRoom[] = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Housekeeping</h1>
        <p className="text-forest-600 dark:text-mist-400">Daily room readiness checklist</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-forest-800 dark:text-white">
                <span className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5" />Room {room.roomNumber}</span>
                <Badge variant="outline" className="capitalize">{room.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-forest-600 dark:text-mist-400">
              <p>{room.roomType.name}</p>
              <p>Floor {room.floor}</p>
              <p>{room.isActive ? 'Ready for operations' : 'Inactive room'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
