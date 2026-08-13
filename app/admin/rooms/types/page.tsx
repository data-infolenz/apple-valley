'use client';

import { useEffect, useState } from 'react';
import { BedDouble, Edit, Plus, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface RoomType {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  size: number;
  totalRooms: number;
  availableRooms: number;
  isActive: boolean;
}

export default function AdminRoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    maxOccupancy: '2',
    bedType: 'Queen',
    size: '200',
  });

  const loadRoomTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rooms/types', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to load room types');
      setRoomTypes(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load room types');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingSlug(null);
    setForm({ name: '', description: '', basePrice: '', maxOccupancy: '2', bedType: 'Queen', size: '200' });
  };

  const editRoomType = (roomType: RoomType) => {
    setEditingSlug(roomType.slug);
    setForm({
      name: roomType.name,
      description: roomType.description || roomType.shortDescription,
      basePrice: String(roomType.basePrice),
      maxOccupancy: String(roomType.maxOccupancy),
      bedType: roomType.bedType,
      size: String(roomType.size),
    });
  };

  useEffect(() => {
    loadRoomTypes();
  }, []);

  const saveRoomType = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/rooms/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: editingSlug || undefined,
          basePrice: Number(form.basePrice),
          maxOccupancy: Number(form.maxOccupancy),
          size: Number(form.size),
          isActive: true,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to save room type');
      toast.success(editingSlug ? 'Room type updated' : 'Room type saved');
      resetForm();
      loadRoomTypes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save room type');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Room Types</h1>
          <p className="text-forest-600 dark:text-mist-400">Create and review room categories</p>
        </div>
        <Button variant="outline" onClick={loadRoomTypes} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                {editingSlug ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingSlug ? 'Edit Room Type' : 'Add Room Type'}
              </span>
              {editingSlug && (
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveRoomType} className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
              <div><Label>Base Price</Label><Input type="number" min="1" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Occupancy</Label><Input type="number" min="1" value={form.maxOccupancy} onChange={(e) => setForm({ ...form, maxOccupancy: e.target.value })} /></div>
                <div><Label>Size sq.ft</Label><Input type="number" min="1" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} /></div>
              </div>
              <div><Label>Bed Type</Label><Input value={form.bedType} onChange={(e) => setForm({ ...form, bedType: e.target.value })} /></div>
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white">
                {editingSlug ? 'Update Room Type' : 'Save Room Type'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomTypes.map((roomType) => (
            <Card key={roomType.slug}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-3 text-forest-800 dark:text-white">
                  <span className="flex items-center gap-2"><BedDouble className="w-5 h-5" />{roomType.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{roomType.isActive ? 'Active' : 'Inactive'}</Badge>
                    <Button variant="outline" size="sm" onClick={() => editRoomType(roomType)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-forest-600 dark:text-mist-400">{roomType.shortDescription}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-forest-500">Price</p><p className="font-semibold">Rs. {roomType.basePrice.toLocaleString()}</p></div>
                  <div><p className="text-forest-500">Rooms</p><p className="font-semibold">{roomType.availableRooms}/{roomType.totalRooms} available</p></div>
                  <div><p className="text-forest-500">Bed</p><p className="font-semibold">{roomType.bedType}</p></div>
                  <div><p className="text-forest-500">Size</p><p className="font-semibold">{roomType.size} sq.ft</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
