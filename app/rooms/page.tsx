'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  BedDouble,
  Maximize,
  Wifi,
  Coffee,
  Tv,
  Mountain,
  Thermometer,
  Droplets,
  Refrigerator,
  Armchair,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import Header from '@/components/public/Header';
import BackgroundParticles from '@/components/public/BackgroundParticles';
import Footer from '@/components/public/Footer';
import RoomSlideshow from '@/components/public/RoomSlideshow';
import { roomImages } from '@/lib/room-images';
import { getRoomAmenities } from '@/lib/room-amenities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import overviewImage from '@/components/public/src/img/overview.jpg';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const allRooms = [
  {
    id: 'deluxe',
    name: 'Deluxe',
    slug: 'deluxe',
    description: 'Comfortable deluxe room for couples and short stays with essential Apple Valley amenities.',
    shortDescription: 'Comfortable room with essential amenities',
    price: 3500,
    size: 280,
    maxOccupancy: 2,
    bedType: 'Queen Size',
    images: roomImages['deluxe'],
    amenities: getRoomAmenities('deluxe'),
    featured: false,
    badge: 'Best Value',
  },
  {
    id: 'super-deluxe',
    name: 'Super Deluxe',
    slug: 'super-deluxe',
    description: 'Larger premium room with upgraded comfort for guests who want more space.',
    shortDescription: 'Larger premium room with upgraded comfort',
    price: 4500,
    size: 320,
    maxOccupancy: 2,
    bedType: 'King Size',
    images: roomImages['super-deluxe'],
    amenities: getRoomAmenities('super-deluxe'),
    featured: true,
    badge: 'Popular',
  },
  {
    id: 'triple-deluxe',
    name: 'Triple Deluxe',
    slug: 'triple-deluxe',
    description: 'Deluxe room prepared for three guests, ideal for small families and groups.',
    shortDescription: 'Deluxe room prepared for three guests',
    price: 5200,
    size: 360,
    maxOccupancy: 3,
    bedType: 'Queen + Single',
    images: roomImages['triple-deluxe'],
    amenities: getRoomAmenities('triple-deluxe'),
    featured: true,
    badge: 'Triple Stay',
  },
  {
    id: 'honeymoon-suite',
    name: 'Honeymoon Suite',
    slug: 'honeymoon-suite',
    description: 'A romantic suite for couples with a king-size bed, balcony view, and sitting area. Enjoy all our standard room amenities plus a refrigerator and coffee maker.',
    shortDescription: 'Romantic suite with a refrigerator and coffee maker',
    price: 7500,
    size: 400,
    maxOccupancy: 2,
    bedType: 'King Size',
    images: roomImages['honeymoon-suite'],
    amenities: getRoomAmenities('honeymoon-suite'),
    featured: true,
    badge: 'Premium',
  },
  {
    id: 'family-suite',
    name: 'Family Suite',
    slug: 'family-suite',
    description: 'Spacious family suite for guests traveling with children or a larger group.',
    shortDescription: 'Spacious suite for families and groups',
    price: 6800,
    size: 450,
    maxOccupancy: 4,
    bedType: '2 Double Beds',
    images: roomImages['family-suite'],
    amenities: getRoomAmenities('family-suite'),
    featured: false,
    badge: 'Family Stay',
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  'TV': <Tv className="w-4 h-4" />,
  'WiFi': <Wifi className="w-4 h-4" />,
  'Water Heater': <Thermometer className="w-4 h-4" />,
  'Water Dispenser': <Droplets className="w-4 h-4" />,
  'Balcony View': <Mountain className="w-4 h-4" />,
  'Sitting Area': <Armchair className="w-4 h-4" />,
  'Refrigerator': <Refrigerator className="w-4 h-4" />,
  'Coffee Maker': <Coffee className="w-4 h-4" />,
};

export default function RoomsPage() {
  const [priceRange, setPriceRange] = useState('all');
  const [occupancy, setOccupancy] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const filteredRooms = allRooms;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={overviewImage.src}
            alt="Our Rooms"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="rooms-neu-hero relative z-10 text-center text-white mx-4 px-6 py-8 sm:px-12 sm:py-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl font-bold mb-4"
          >
            Rooms & Suites
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            Choose from our thoughtfully designed rooms, each offering unique views and experiences
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="particle-scene rooms-neu-scene rooms-neu-listing py-12 sm:py-16 px-4">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto">
          <div>
            {/* Filters Sidebar */}
            <aside className="hidden">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-forest-800 dark:text-white mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>

                  <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium text-forest-700 dark:text-mist-300">
                        Price Range (per night)
                      </Label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All prices" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-3000">Under ₹3,000</SelectItem>
                          <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                          <SelectItem value="5000-7000">₹5,000 - ₹7,000</SelectItem>
                          <SelectItem value="7000">Above ₹7,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Occupancy */}
                    <div>
                      <Label className="text-sm font-medium text-forest-700 dark:text-mist-300">
                        Min. Occupancy
                      </Label>
                      <Select value={occupancy} onValueChange={setOccupancy}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any</SelectItem>
                          <SelectItem value="2">2+ Guests</SelectItem>
                          <SelectItem value="3">3+ Guests</SelectItem>
                          <SelectItem value="4">4+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div>
                      <Label className="text-sm font-medium text-forest-700 dark:text-mist-300">
                        Sort By
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Featured" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="size">Room Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Room Listings */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <p className="rooms-neu-chip rounded-full px-4 py-2 text-sm">
                  Showing {filteredRooms.length} rooms
                </p>
              </div>

              <div className="space-y-10">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="room-card rooms-neu-panel overflow-hidden transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Image */}
                        <div className="relative h-64 md:h-full">
                          <RoomSlideshow images={room.images} name={room.name} />
                          {room.badge && (
                            <Badge className="absolute top-4 left-4 bg-walnut-600 text-white">
                              {room.badge}
                            </Badge>
                          )}
                        </div>

                        {/* Details */}
                        <CardContent className="md:col-span-2 p-6 sm:p-8">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <h3 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-2">
                                {room.name}
                              </h3>
                              <p className="text-forest-600 dark:text-mist-400 text-sm mb-4 line-clamp-2">
                                {room.shortDescription}
                              </p>

                              {/* Quick Info */}
                              <div className="rooms-neu-facts flex flex-wrap gap-4 mb-5 p-4 rounded-2xl">
                                <div className="flex items-center gap-1 text-sm text-forest-600 dark:text-mist-400">
                                  <Maximize className="w-4 h-4" />
                                  <span>{room.size} sq ft</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-forest-600 dark:text-mist-400">
                                  <Users className="w-4 h-4" />
                                  <span>Max {room.maxOccupancy}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-forest-600 dark:text-mist-400">
                                  <BedDouble className="w-4 h-4" />
                                  <span>{room.bedType}</span>
                                </div>
                              </div>

                              {/* Amenities */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {room.amenities.map((amenity) => (
                                  <span
                                    key={amenity}
                                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full rooms-neu-chip"
                                  >
                                    {amenityIcons[amenity] || <Check className="w-3 h-3" />}
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 rooms-neu-price-row">
                              <div>
                                <div className="text-2xl font-bold text-forest-800 dark:text-white">
                                  ₹{room.price.toLocaleString()}
                                </div>
                                <div className="text-sm text-forest-500 dark:text-mist-400">
                                  per night + taxes
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="rooms-neu-button"
                                    >
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rooms-neu-panel rooms-neu-dialog max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle className="text-2xl font-heading">
                                        {room.name}
                                      </DialogTitle>
                                      <DialogDescription>
                                        {room.shortDescription}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                      <div className="grid grid-cols-2 gap-2">
                                        {room.images.map((img, i) => (
                                          <img
                                            key={i}
                                            src={img}
                                            alt={`${room.name} ${i + 1}`}
                                            className="w-full h-40 object-cover rounded-lg"
                                          />
                                        ))}
                                      </div>
                                      <p className="text-forest-600 dark:text-mist-400">
                                        {room.description}
                                      </p>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-sm text-forest-500">Size</span>
                                          <p className="font-medium">{room.size} sq ft</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-forest-500">Bed Type</span>
                                          <p className="font-medium">{room.bedType}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-forest-500">Max Occupancy</span>
                                          <p className="font-medium">{room.maxOccupancy} guests</p>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-sm text-forest-500">Amenities</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {room.amenities.map((amenity) => (
                                            <span
                                              key={amenity}
                                              className="text-xs px-2 py-1 rounded-full rooms-neu-chip"
                                            >
                                              {amenity}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                          <span className="text-3xl font-bold">₹{room.price.toLocaleString()}</span>
                                          <span className="text-forest-500"> /night</span>
                                        </div>
                                        <Link href={`/booking?roomType=${room.slug}`}>
                                          <Button className="rooms-neu-button rooms-neu-book">
                                            Book Now
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Link href={`/booking?roomType=${room.slug}`}>
                                  <Button className="rooms-neu-button rooms-neu-book">
                                    Book Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
