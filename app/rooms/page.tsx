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
  Wind,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
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
import premiumBalconyRoom from '@/components/public/src/img/room pic 1.webp';
import honeymoonSuiteRoom from '@/components/public/src/img/room pic 2.jpg';
import familyCottageRoom from '@/components/public/src/img/room pic 3.jpg';
import budgetStandardRoom from '@/components/public/src/img/Budget Standard Room.jpg';
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
    id: 'deluxe-hill-view',
    name: 'Deluxe Hill View Room',
    slug: 'deluxe-hill-view',
    description: 'Wake up to panoramic views of the misty hills. Our Deluxe Hill View rooms offer a perfect blend of comfort and natural beauty. Each room features modern amenities and traditional hill-station charm.',
    shortDescription: 'Panoramic misty hill views with modern comfort',
    price: 3500,
    size: 280,
    maxOccupancy: 2,
    bedType: 'King Size',
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      'https://images.pexels.com/261102/pexels-photo-261102.jpeg',
      'https://images.pexels.com/271624/pexels-photo-271624.jpeg',
    ],
    amenities: ['Hill View', 'Room Heater', 'Hot Water', 'WiFi', 'TV with Cable', 'Tea/Coffee Maker', 'Private Bathroom', 'Toiletries', 'Hair Dryer'],
    featured: false,
    badge: 'Best Value',
  },
  {
    id: 'premium-balcony',
    name: 'Premium Balcony Room',
    slug: 'premium-balcony',
    description: 'Step out to your private balcony facing the valley. Watch the mist roll in during mornings and enjoy spectacular sunsets. Our Premium Balcony rooms offer an elevated experience with premium furnishing and personalized service.',
    shortDescription: 'Private valley-view balcony with premium amenities',
    price: 4500,
    size: 320,
    maxOccupancy: 2,
    bedType: 'King Size',
    images: [
      premiumBalconyRoom.src,
      'https://images.pexels.com/1648776/pexels-photo-1648776.jpeg',
      'https://images.pexels.com/261102/pexels-photo-261102.jpeg',
    ],
    amenities: ['Balcony', 'Lake View', 'Mountain View', 'Room Heater', 'Hot Water', 'WiFi', 'TV with Cable', 'Mini Bar', 'Tea/Coffee Maker', 'Seating Area', 'Private Bathroom', 'Hair Dryer'],
    featured: true,
    badge: 'Most Popular',
  },
  {
    id: 'family-cottage',
    name: 'Family Cottage',
    slug: 'family-cottage',
    description: 'Spacious wooden cottage perfect for families. These standalone cottages feature separate living and sleeping areas, a kitchen, and a private garden. Ideal for families seeking privacy and comfort.',
    shortDescription: 'Spacious wooden cottage with garden and kitchen',
    price: 6000,
    size: 450,
    maxOccupancy: 4,
    bedType: '2 Double Beds',
    images: [
      familyCottageRoom.src,
      'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    ],
    amenities: ['Mountain View', 'Private Garden', 'Kitchen', 'Living Area', 'Room Heater', 'Hot Water', 'WiFi', 'TV', 'Sofa Bed', 'Private Bathroom', 'Kids-friendly', 'Parking'],
    featured: true,
    badge: 'Family Favorite',
  },
  {
    id: 'honeymoon-suite',
    name: 'Honeymoon Suite',
    slug: 'honeymoon-suite',
    description: 'Begin your forever in the lap of misty hills. Our Honeymoon Suite features a king-size bed with premium linens, romantic rose decorations, a fireplace, and lake views. Perfect for couples seeking a magical experience.',
    shortDescription: 'Romantic suite with fireplace, lake views, and butler service',
    price: 7500,
    size: 400,
    maxOccupancy: 2,
    bedType: 'King Size',
    images: [
      honeymoonSuiteRoom.src,
      'https://images.pexels.com/photos/1024608/pexels-photo-1024608.jpeg',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
    ],
    amenities: ['Lake View', 'Fireplace', 'Jacuzzi', 'Room Heater', 'Hot Water', 'WiFi', 'TV', 'Mini Bar', 'Butler Service', 'Rose Decoration', 'Chocolate Hamper', 'Work Desk', 'Private Bathroom'],
    featured: true,
    badge: 'Premium',
  },
  {
    id: 'budget-standard',
    name: 'Budget Standard Room',
    slug: 'budget-standard',
    description: 'Comfortable and affordable hill-station stay without compromising on essential amenities. Perfect for solo travelers, students, and budget-conscious tourists exploring the beauty of Kodaikanal.',
    shortDescription: 'Affordable comfort with essential amenities',
    price: 2000,
    size: 180,
    maxOccupancy: 2,
    bedType: 'Queen Size',
    images: [
      budgetStandardRoom.src,
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
    ],
    amenities: ['Room Heater', 'Hot Water', 'WiFi', 'TV', 'Tea/Coffee Maker', 'Private Bathroom', 'Toiletries'],
    featured: false,
    badge: 'Budget Pick',
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  'Hill View': <Mountain className="w-4 h-4" />,
  'Lake View': <Mountain className="w-4 h-4" />,
  'Mountain View': <Mountain className="w-4 h-4" />,
  'WiFi': <Wifi className="w-4 h-4" />,
  'Room Heater': <Wind className="w-4 h-4" />,
  'Tea/Coffee Maker': <Coffee className="w-4 h-4" />,
  'TV': <Tv className="w-4 h-4" />,
  'TV with Cable': <Tv className="w-4 h-4" />,
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
        <div className="relative z-10 text-center text-white px-4">
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
      <section className="py-12 px-4">
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
              <div className="flex items-center justify-between mb-6">
                <p className="text-forest-600 dark:text-mist-400">
                  Showing {filteredRooms.length} rooms
                </p>
              </div>

              <div className="space-y-6">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Image */}
                        <div className="relative h-64 md:h-full">
                          <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                          {room.badge && (
                            <Badge className="absolute top-4 left-4 bg-walnut-600 text-white">
                              {room.badge}
                            </Badge>
                          )}
                        </div>

                        {/* Details */}
                        <CardContent className="md:col-span-2 p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <h3 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-2">
                                {room.name}
                              </h3>
                              <p className="text-forest-600 dark:text-mist-400 text-sm mb-4 line-clamp-2">
                                {room.shortDescription}
                              </p>

                              {/* Quick Info */}
                              <div className="flex flex-wrap gap-4 mb-4">
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
                                {room.amenities.slice(0, 6).map((amenity) => (
                                  <span
                                    key={amenity}
                                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-300"
                                  >
                                    {amenityIcons[amenity] || <Check className="w-3 h-3" />}
                                    {amenity}
                                  </span>
                                ))}
                                {room.amenities.length > 6 && (
                                  <span className="text-xs px-2 py-1 text-forest-500 dark:text-mist-400">
                                    +{room.amenities.length - 6} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-forest-100 dark:border-forest-800">
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
                                      className="text-forest-600 dark:text-forest-300"
                                    >
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                              className="text-xs px-2 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-300"
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
                                          <Button className="bg-walnut-600 hover:bg-walnut-700">
                                            Book Now
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Link href={`/booking?roomType=${room.slug}`}>
                                  <Button className="bg-walnut-600 hover:bg-walnut-700 text-white">
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
