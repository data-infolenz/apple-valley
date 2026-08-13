'use client';

import { useEffect, useState } from 'react';
import { Coffee, Edit, Plus, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddOn {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricingUnit: string;
  available: boolean;
  order: number;
}

interface BookingOrder {
  id: number;
  item: string;
  quantity: number;
  price: number;
  total: number;
  bookingId: string;
  guestName: string;
}

export default function AddOnOrdersPage() {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'dining',
    price: '',
    pricingUnit: 'per_booking',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [addOnResponse, bookingResponse] = await Promise.all([
        fetch('/api/addons', { cache: 'no-store' }),
        fetch('/api/bookings?status=all&limit=100', { cache: 'no-store' }),
      ]);
      const addOnResult = await addOnResponse.json();
      const bookingResult = await bookingResponse.json();

      if (!addOnResponse.ok || !addOnResult.success) {
        throw new Error(addOnResult.error || 'Unable to load add-on services');
      }

      setAddOns(addOnResult.data);
      if (bookingResponse.ok && bookingResult.success) {
        setOrders(
          bookingResult.data.flatMap((booking: {
            bookingId: string;
            guestSnapshot: { name?: string };
            orders?: Array<{ id: number; item: string; quantity: number; price: number; total: number }>;
          }) => (booking.orders || []).map((order) => ({
            ...order,
            bookingId: booking.bookingId,
            guestName: booking.guestSnapshot.name || 'Guest',
          })))
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load add-on services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingSlug(null);
    setForm({ name: '', category: 'dining', price: '', pricingUnit: 'per_booking' });
  };

  const editAddOn = (addOn: AddOn) => {
    setEditingSlug(addOn.slug);
    setForm({
      name: addOn.name,
      category: addOn.category,
      price: String(addOn.price),
      pricingUnit: addOn.pricingUnit,
    });
  };

  const saveAddOn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/addons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: editingSlug || undefined,
          price: Number(form.price),
          available: true,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to save add-on service');
      }

      toast.success(editingSlug ? 'Add-on service updated' : 'Add-on service added');
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save add-on service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Add-on Orders</h1>
          <p className="text-forest-600 dark:text-mist-400">Available add-ons and guest order history</p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={isLoading}>
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
                {editingSlug ? 'Edit Service' : 'Add Service'}
              </span>
              {editingSlug && (
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveAddOn} className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="comfort">Comfort</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Price</Label><Input type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div>
                <Label>Pricing Unit</Label>
                <Select value={form.pricingUnit} onValueChange={(value) => setForm({ ...form, pricingUnit: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_booking">Per Booking</SelectItem>
                    <SelectItem value="per_night">Per Night</SelectItem>
                    <SelectItem value="per_room">Per Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white">
                {editingSlug ? 'Update Service' : 'Add Service'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Coffee className="w-5 h-5" />Add-on Menu</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {addOns.map((addOn) => (
              <div key={addOn.id} className="flex items-center justify-between gap-3 border-b border-forest-100 dark:border-forest-800 pb-2 last:border-0">
                <div>
                  <p className="font-medium text-forest-800 dark:text-white">{addOn.name}</p>
                  <p className="text-xs text-forest-500 capitalize">{addOn.category} - {addOn.pricingUnit.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold">Rs. {addOn.price.toLocaleString()}</p>
                    <Badge variant="outline">{addOn.available ? 'Available' : 'Hidden'}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => editAddOn(addOn)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-forest-100 dark:border-forest-800 pb-2 last:border-0">
                <div>
                  <p className="font-medium text-forest-800 dark:text-white">{order.item} x {order.quantity}</p>
                  <p className="text-xs text-forest-500">{order.bookingId} - {order.guestName}</p>
                </div>
                <p className="font-semibold">Rs. {order.total.toLocaleString()}</p>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-forest-500">No add-on orders yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
