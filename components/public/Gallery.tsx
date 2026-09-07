'use client';

import { useState } from 'react';
import Image from 'next/image';
import { galleryImages } from '@/lib/gallery-images';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const categories = ['All', 'Property', 'Rooms', 'Dining'];
export default function Gallery() {
  const [category, setCategory] = useState('All');
  const photos = galleryImages.filter((photo) => category === 'All' || photo.category === category);
  return <>
    <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label="Filter gallery">
      {categories.map((item) => <button key={item} type="button" aria-pressed={category === item}
        onClick={() => setCategory(item)}
        className={`rounded-full px-5 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${category === item ? 'bg-forest-700 text-white' : 'rooms-neu-chip'}`}>{item}</button>)}
    </div>
    <p className="text-sm text-forest-600 dark:text-mist-300 mb-6" aria-live="polite">{photos.length} photos · Select a photo to enlarge</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, index) => <Dialog key={photo.src}>
        <DialogTrigger asChild>
          <button className="rooms-neu-panel text-left overflow-hidden rounded-2xl group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`Enlarge ${photo.title}`}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={photo.src} alt={`${photo.title} at Apple Valley, Kodaikanal`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" priority={index === 0}
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
            </div>
            <div className="p-5"><span className="text-xs uppercase tracking-widest text-forest-600 dark:text-mist-300">{photo.category}</span><h2 className="font-heading text-xl mt-1">{photo.title}</h2></div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] max-h-[90dvh] overflow-auto rounded-2xl">
          <DialogTitle>{photo.title}</DialogTitle>
          <DialogDescription>Apple Valley · Kodaikanal</DialogDescription>
          <div className="relative h-[60dvh]"><Image src={photo.src} alt={`${photo.title} at Apple Valley, Kodaikanal`} fill sizes="90vw" className="object-contain" /></div>
        </DialogContent>
      </Dialog>)}
    </div>
  </>;
}

