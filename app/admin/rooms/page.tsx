import Link from 'next/link';
import { BedDouble, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

type AdminRoom = {
  id: number;
  roomNumber: string;
  floor: number;
  status: string;
  isActive: boolean;
  roomType: {
    name: string;
    basePrice: number;
  };
};

export default async function AdminRoomsPage() {
  const rooms: AdminRoom[] = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
  });

  const available = rooms.filter((room) => room.status === 'available' && room.isActive).length;
  const occupied = rooms.filter((room) => room.status === 'occupied' && room.isActive).length;
  const inactive = rooms.filter((room) => !room.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">All Rooms</h1>
          <p className="text-forest-600 dark:text-mist-400">Room inventory and current operating status</p>
        </div>
        <Link href="/admin/rooms/types">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Manage Room Types
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Total Rooms</p><p className="text-2xl font-bold text-forest-800 dark:text-white">{rooms.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Available</p><p className="text-2xl font-bold text-green-600">{available}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Occupied</p><p className="text-2xl font-bold text-walnut-600">{occupied}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-forest-600 dark:text-mist-400">Inactive</p><p className="text-2xl font-bold text-red-600">{inactive}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-forest-800 dark:text-white">
            <BedDouble className="w-5 h-5" />
            Room List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room No.</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-mono font-medium">{room.roomNumber}</TableCell>
                    <TableCell>{room.roomType.name}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>Rs. {room.roomType.basePrice.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{room.status}</Badge></TableCell>
                    <TableCell>{room.isActive ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
