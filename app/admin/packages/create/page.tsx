import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { encodeJsonField } from '@/lib/json-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createPackage(formData: FormData) {
  'use server';

  const name = String(formData.get('name') || '');
  const description = String(formData.get('description') || '');
  const shortDescription = String(formData.get('shortDescription') || description || name);
  const inclusions = String(formData.get('inclusions') || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  await prisma.package.create({
    data: {
      slug: slugify(name),
      name,
      description,
      shortDescription,
      image: '',
      gallery: encodeJsonField([]),
      nights: Number(formData.get('nights') || 1),
      inclusions: encodeJsonField(inclusions),
      mealPlan: String(formData.get('mealPlan') || 'Room only'),
      hasTransport: formData.get('hasTransport') === 'on',
      addOns: encodeJsonField([]),
      price: Number(formData.get('price') || 0),
      originalPrice: Number(formData.get('originalPrice') || 0) || null,
      maxOccupancy: Number(formData.get('maxOccupancy') || 2),
      featured: formData.get('featured') === 'on',
      isActive: true,
    },
  });

  revalidatePath('/admin/packages');
  redirect('/admin/packages');
}

export default function CreatePackagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/packages">
          <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Create Package</h1>
          <p className="text-forest-600 dark:text-mist-400">Save a new package to the admin package list</p>
        </div>
      </div>
      <Card className="max-w-3xl">
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Package Details</CardTitle></CardHeader>
        <CardContent>
          <form action={createPackage} className="space-y-4">
            <div><Label htmlFor="name">Package Name</Label><Input id="name" name="name" required /></div>
            <div><Label htmlFor="shortDescription">Short Description</Label><Input id="shortDescription" name="shortDescription" required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" required /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label htmlFor="nights">Nights</Label><Input id="nights" name="nights" type="number" min="1" defaultValue="2" /></div>
              <div><Label htmlFor="maxOccupancy">Max Guests</Label><Input id="maxOccupancy" name="maxOccupancy" type="number" min="1" defaultValue="2" /></div>
              <div><Label htmlFor="price">Price</Label><Input id="price" name="price" type="number" min="1" required /></div>
              <div><Label htmlFor="originalPrice">Original Price</Label><Input id="originalPrice" name="originalPrice" type="number" min="0" /></div>
            </div>
            <div><Label htmlFor="mealPlan">Meal Plan</Label><Input id="mealPlan" name="mealPlan" defaultValue="Room only" /></div>
            <div><Label htmlFor="inclusions">Inclusions</Label><Textarea id="inclusions" name="inclusions" placeholder="One inclusion per line" /></div>
            <div className="flex flex-wrap gap-4 text-sm text-forest-700 dark:text-mist-300">
              <label className="flex items-center gap-2"><input type="checkbox" name="featured" /> Featured package</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="hasTransport" /> Includes transport</label>
            </div>
            <Button className="bg-forest-600 hover:bg-forest-700 text-white">Save Package</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
