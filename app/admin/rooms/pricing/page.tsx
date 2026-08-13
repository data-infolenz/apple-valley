'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Edit, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { SEASONS_DATA } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RoomType {
  slug: string;
  name: string;
  basePrice: number;
}

type Season = (typeof SEASONS_DATA)[number];

export default function AdminSeasonalPricingPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [seasons, setSeasons] = useState<Season[]>(SEASONS_DATA);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    multiplier: '1',
  });

  const loadRoomTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rooms/types?active=true', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to load room types');
      setRoomTypes(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load room types');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem('admin_seasonal_pricing');
    if (saved) {
      setSeasons(JSON.parse(saved));
    }
    loadRoomTypes();
  }, []);

  const editSeason = (season: Season) => {
    setEditingName(season.name);
    setForm({
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      multiplier: String(season.multiplier),
    });
  };

  const resetForm = () => {
    setEditingName(null);
    setForm({ name: '', startDate: '', endDate: '', multiplier: '1' });
  };

  const saveSeason = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedSeasons = seasons.map((item) => (
      item.name === editingName
        ? {
            ...item,
            name: form.name,
            startDate: form.startDate,
            endDate: form.endDate,
            multiplier: Number(form.multiplier),
        }
        : item
    ));
    setSeasons(updatedSeasons);
    window.localStorage.setItem('admin_seasonal_pricing', JSON.stringify(updatedSeasons));
    resetForm();
    toast.success('Seasonal pricing updated on this page');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Seasonal Pricing</h1>
          <p className="text-forest-600 dark:text-mist-400">Review and edit seasonal multipliers</p>
        </div>
        <Button variant="outline" onClick={loadRoomTypes} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {editingName && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Edit className="w-5 h-5" />Edit Season</span>
              <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSeason} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div>
              <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div>
              <div><Label>Multiplier</Label><Input type="number" min="1" step="0.01" value={form.multiplier} onChange={(e) => setForm({ ...form, multiplier: e.target.value })} required /></div>
              <div className="md:col-span-4"><Button className="bg-forest-600 hover:bg-forest-700 text-white">Update Season</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {seasons.map((season) => (
          <Card key={season.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3 text-forest-800 dark:text-white">
                <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5" />{season.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{season.multiplier}x</Badge>
                  <Button variant="outline" size="sm" onClick={() => editSeason(season)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-forest-600 dark:text-mist-400 mb-4">
                {new Date(season.startDate).toLocaleDateString('en-IN')} to {new Date(season.endDate).toLocaleDateString('en-IN')}
              </p>
              <div className="space-y-2">
                {roomTypes.map((roomType) => (
                  <div key={roomType.slug} className="flex items-center justify-between text-sm">
                    <span>{roomType.name}</span>
                    <span className="font-semibold">Rs. {Math.round(roomType.basePrice * season.multiplier).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
