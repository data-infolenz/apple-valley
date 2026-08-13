'use client';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([
    { code: 'WELCOME10', discount: 10, status: 'active' },
    { code: 'FAMILY15', discount: 15, status: 'active' },
  ]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('10');

  const addCoupon = (event: React.FormEvent) => {
    event.preventDefault();
    setCoupons([{ code: code.toUpperCase(), discount: Number(discount), status: 'active' }, ...coupons]);
    setCode('');
    setDiscount('10');
    toast.success('Coupon added to this admin session');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Coupons</h1>
        <p className="text-forest-600 dark:text-mist-400">Create and review promo codes</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="w-5 h-5" />New Coupon</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={addCoupon} className="space-y-4">
              <div><Label>Code</Label><Input value={code} onChange={(e) => setCode(e.target.value)} required /></div>
              <div><Label>Discount %</Label><Input type="number" min="1" max="90" value={discount} onChange={(e) => setDiscount(e.target.value)} required /></div>
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white">Add Coupon</Button>
            </form>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-3">
          {coupons.map((coupon) => (
            <Card key={coupon.code}>
              <CardContent className="p-5 flex items-center justify-between">
                <div><p className="font-mono font-semibold">{coupon.code}</p><p className="text-sm text-forest-500">{coupon.discount}% discount</p></div>
                <Badge>{coupon.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
