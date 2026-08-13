'use client';

import { useEffect, useState } from 'react';
import { Edit, ImageIcon, MapPin, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { ATTRACTIONS_DATA } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Attraction = (typeof ATTRACTIONS_DATA)[number];

export default function AdminAttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>(ATTRACTIONS_DATA);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    distance: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    const saved = window.localStorage.getItem('admin_attractions');
    if (saved) {
      setAttractions(JSON.parse(saved));
    }
  }, []);

  const editAttraction = (attraction: Attraction) => {
    setEditingSlug(attraction.slug);
    setForm({
      name: attraction.name,
      shortDescription: attraction.shortDescription,
      distance: String(attraction.distance),
      category: attraction.category,
      image: attraction.image,
    });
  };

  const resetForm = () => {
    setEditingSlug(null);
    setForm({ name: '', shortDescription: '', distance: '', category: '', image: '' });
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result || '') }));
    };
    reader.onerror = () => toast.error('Unable to read image file');
    reader.readAsDataURL(file);
  };

  const saveAttraction = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedAttractions = attractions.map((item) => (
      item.slug === editingSlug
        ? {
            ...item,
            name: form.name,
            shortDescription: form.shortDescription,
            distance: Number(form.distance),
            category: form.category,
            image: form.image,
        }
        : item
    ));
    setAttractions(updatedAttractions);
    window.localStorage.setItem('admin_attractions', JSON.stringify(updatedAttractions));
    resetForm();
    toast.success('Attraction updated on this page');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Attractions</h1>
        <p className="text-forest-600 dark:text-mist-400">Local attractions configured for the public website</p>
      </div>

      {editingSlug && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Edit className="w-5 h-5" />Edit Attraction</span>
              <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveAttraction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
              <div><Label>Distance</Label><Input type="number" step="0.1" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} required /></div>
              <div className="md:col-span-2"><Label>Short Description</Label><Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required /></div>
              <div className="md:col-span-2 space-y-3">
                <Label>Attraction Image</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-forest-200 bg-forest-50 dark:border-forest-800 dark:bg-forest-950">
                    {form.image ? (
                      <img src={form.image} alt={form.name || 'Attraction preview'} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-forest-400" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Paste image URL or upload a file" />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-forest-200 px-4 py-2 text-sm font-medium text-forest-700 hover:bg-forest-50 dark:border-forest-800 dark:text-mist-200 dark:hover:bg-forest-900">
                      <Upload className="h-4 w-4" />
                      Upload Image
                      <input type="file" accept="image/*" className="sr-only" onChange={uploadImage} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2"><Button className="bg-forest-600 hover:bg-forest-700 text-white">Update Attraction</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {attractions.map((attraction) => (
          <Card key={attraction.slug}>
            {attraction.image && (
              <div className="aspect-video overflow-hidden rounded-t-lg border-b border-forest-100 dark:border-forest-800">
                <img src={attraction.image} alt={attraction.name} className="h-full w-full object-cover" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-3 text-forest-800 dark:text-white">
                <span>{attraction.name}</span>
                <div className="flex items-center gap-2">
                  {attraction.featured && <Badge>Featured</Badge>}
                  <Button variant="outline" size="sm" onClick={() => editAttraction(attraction)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-forest-600 dark:text-mist-400">{attraction.shortDescription}</p>
              <div className="flex items-center gap-2 text-forest-700 dark:text-mist-300">
                <MapPin className="w-4 h-4" />
                {attraction.distance} km from hotel
              </div>
              <Badge variant="outline" className="capitalize">{attraction.category}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
