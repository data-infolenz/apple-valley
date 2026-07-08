'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Check,
  Star,
  Heart,
  Gift,
  MapPin,
  ArrowRight,
  Tag,
} from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import coupleMistyStayPackage from '@/components/public/src/img/Couple Misty Stay.jpg';
import familyVacationPackage from '@/components/public/src/img/Family Vacation.jpg';
import honeymoonPackage from '@/components/public/src/img/Honeymoon Package.jpg';
import hotelPackageHero from '@/components/public/src/img/hotel package.jpg';
import roomPicTwo from '@/components/public/src/img/room pic 2.jpg';
import roomPicThree from '@/components/public/src/img/room pic 3.jpg';

const packages = [
  {
    id: 'couple-misty-stay',
    name: 'Couple Misty Stay Package',
    slug: 'couple-misty-stay',
    description: 'A romantic 2-night escape designed for couples. Wake up to misty hill views, enjoy a candle-lit dinner, and create memories that last forever. Perfect for anniversaries, proposals, or just a romantic getaway.',
    shortDescription: 'Romantic 2-night stay with dinner and decorations',
    image: coupleMistyStayPackage.src,
    nights: 2,
    price: 8999,
    originalPrice: 12000,
    maxOccupancy: 2,
    roomType: 'Premium Balcony Room',
    inclusions: [
      { name: 'Premium Balcony Room', description: 'Lake & hill view room with private balcony' },
      { name: 'Daily Breakfast', description: 'Breakfast for 2 at our restaurant' },
      { name: 'Candle Light Dinner', description: 'One romantic 4-course dinner with wine' },
      { name: 'Flower Decoration', description: 'Rose & orchid decoration in room on arrival' },
      { name: 'Campfire Evening', description: 'Private campfire session with snacks' },
      { name: 'Welcome Drink', description: 'Refreshing welcome drink on arrival' },
      { name: 'Late Check-out', description: 'Extended check-out till 1 PM' },
    ],
    mealPlan: 'Breakfast + 1 Dinner',
    hasTransport: false,
    featured: true,
    bestFor: 'Couples, Honeymooners, Anniversaries',
    seasonalNote: 'Book 30 days in advance for best availability',
  },
  {
    id: 'family-vacation',
    name: 'Family Vacation Package',
    slug: 'family-vacation',
    description: 'Perfect family getaway with spacious cottage accommodation, fun activities for kids, and sightseeing tour of Kodaikanal\'s best attractions. Create wonderful memories with your loved ones in the hills.',
    shortDescription: '3-night family stay with cottage and sightseeing',
    image: familyVacationPackage.src,
    nights: 3,
    price: 19999,
    originalPrice: 25000,
    maxOccupancy: 4,
    roomType: 'Family Cottage',
    inclusions: [
      { name: 'Family Cottage', description: 'Spacious wooden cottage with 2 bedrooms' },
      { name: 'Daily Breakfast', description: 'Breakfast for 4 at our restaurant' },
      { name: 'Daily Dinner', description: 'Traditional Tamil Nadu & multi-cuisine dinner' },
      { name: 'Full Day Sightseeing', description: 'Private cab for all major attractions' },
      { name: 'BBQ Evening', description: 'BBQ dinner with family around campfire' },
      { name: 'Campfire Session', description: 'Evening campfire with marshmallows for kids' },
      { name: 'Kids Activity Kit', description: 'Board games and activity set for children' },
    ],
    mealPlan: 'Breakfast & Dinner included',
    hasTransport: true,
    transportDetails: 'Full day sightseeing cab included',
    featured: true,
    bestFor: 'Families with Kids, Multi-generational trips',
    seasonalNote: 'Summer and Diwali - Book early!',
  },
  {
    id: 'weekend-escape',
    name: 'Weekend Escape Package',
    slug: 'weekend-escape',
    description: 'Quick 2-night refresh from city life. Perfect for professionals seeking a peaceful weekend retreat in the hills. Unplug, relax, and rejuvenate before heading back to the grind.',
    shortDescription: '2-night hill station retreat',
    image: roomPicTwo.src,
    nights: 2,
    price: 7499,
    originalPrice: 9000,
    maxOccupancy: 2,
    roomType: 'Deluxe Hill View Room',
    inclusions: [
      { name: 'Deluxe Hill View Room', description: 'Cozy room with panoramic hill views' },
      { name: 'Daily Breakfast', description: 'Breakfast for 2 at our restaurant' },
      { name: 'Evening Tea/Coffee', description: 'Complimentary evening beverages with snacks' },
      { name: 'Nature Walk Guide', description: 'Guided morning nature walk to viewpoints' },
      { name: '15% Discount on Add-ons', description: 'Special discount on all add-on services' },
      { name: 'Early Check-in', description: 'Check-in from 12 PM subject to availability' },
    ],
    mealPlan: 'Breakfast included',
    hasTransport: false,
    featured: false,
    bestFor: 'Solo travelers, Couples, Weekend warriors',
    seasonalNote: 'Weekend package - Friday to Sunday',
  },
  {
    id: 'honeymoon-hill-view',
    name: 'Honeymoon Hill View Package',
    slug: 'honeymoon-hill-view',
    description: 'Begin your forever in the lap of misty hills. Premium suite with rose decorations, private dinners, romantic setups, and magical lake views. The ultimate romantic experience in Kodaikanal.',
    shortDescription: 'Luxury honeymoon with premium suite and romantic setups',
    image: honeymoonPackage.src,
    nights: 3,
    price: 24999,
    originalPrice: 32000,
    maxOccupancy: 2,
    roomType: 'Honeymoon Suite',
    inclusions: [
      { name: 'Honeymoon Suite', description: 'Premium suite with jacuzzi and fireplace' },
      { name: 'Daily Breakfast in Bed', description: 'Breakfast served in your room' },
      { name: '2 Candle Light Dinners', description: 'Two special 5-course romantic dinners' },
      { name: 'Rose Bed Decoration', description: 'Rose petal decoration on bed on first night' },
      { name: 'Room Fresh Flowers', description: 'Daily fresh flower arrangement in room' },
      { name: 'Chocolate Hamper', description: 'Premium chocolates and dry fruits' },
      { name: 'Private Campfire', description: 'Romantic campfire session just for two' },
      { name: 'Lake View Dinner Setup', description: 'Special lakeside dining experience' },
      { name: 'Late Check-out', description: 'Extended check-out till 2 PM' },
    ],
    mealPlan: 'Breakfast + 2 Dinners',
    hasTransport: false,
    featured: true,
    bestFor: 'Newlyweds, Anniversary Celebrations',
    seasonalNote: 'Most popular April-June and October-December',
  },
  {
    id: 'corporate-refresh',
    name: 'Corporate Refresh Package',
    slug: 'corporate-refresh',
    description: 'Bring your team for a refreshing retreat. Conference facilities, team activities, and comfortable group accommodation. Perfect for team building, strategy sessions, or employee recognition.',
    shortDescription: 'Corporate retreat with conference facilities',
    image: roomPicThree.src,
    nights: 2,
    price: 4500,
    originalPrice: 5500,
    maxOccupancy: 2,
    roomType: 'Deluxe Room (Group Rate)',
    inclusions: [
      { name: 'Deluxe Room', description: 'Per person group rate in deluxe rooms' },
      { name: 'Daily Breakfast', description: 'Breakfast buffet for team' },
      { name: 'Daily Lunch', description: 'Lunch at conference facility' },
      { name: 'Conference Room', description: '4 hours conference room per day' },
      { name: 'AV Equipment', description: 'Projector, screen, and sound system' },
      { name: 'Evening Team Snacks', description: 'Evening tea with snacks for team' },
      { name: 'High-Speed WiFi', description: 'Complimentary high-speed internet' },
      { name: 'Team Activities', description: 'Optional adventure activities available' },
    ],
    mealPlan: 'Breakfast & Lunch included',
    hasTransport: false,
    featured: false,
    bestFor: 'Corporate Teams, Offsites, Training Programs',
    seasonalNote: 'Group discounts available for 10+ rooms',
    minRooms: 5,
  },
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={hotelPackageHero.src}
            alt="Packages"
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
            Exclusive Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            Curated experiences for every type of traveler with best value guaranteed
          </motion.p>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Special Offers</Badge>
            <h2 className="font-heading text-3xl font-bold text-forest-800 dark:text-white">
              Featured Packages
            </h2>
          </div>

          <div className="space-y-12">
            {packages.filter((p) => p.featured).map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Side */}
                    <div className="relative h-64 lg:h-auto lg:min-h-[400px]">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent lg:hidden" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-green-600 text-white">
                          <Tag className="w-3 h-3 mr-1" />
                          Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                        </Badge>
                        <Badge className="bg-walnut-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>

                    {/* Content Side */}
                    <CardContent className="p-6 lg:p-8 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-forest-600 dark:text-mist-400 mb-2">
                          <Heart className="w-4 h-4 text-walnut-600" />
                          <span>Best for: {pkg.bestFor}</span>
                        </div>
                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-forest-800 dark:text-white mb-3">
                          {pkg.name}
                        </h3>
                        <p className="text-forest-600 dark:text-mist-400 mb-6">
                          {pkg.description}
                        </p>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-walnut-600" />
                            <div>
                              <p className="text-sm text-forest-500 dark:text-mist-400">Duration</p>
                              <p className="font-medium text-forest-800 dark:text-white">{pkg.nights} Nights</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-walnut-600" />
                            <div>
                              <p className="text-sm text-forest-500 dark:text-mist-400">Capacity</p>
                              <p className="font-medium text-forest-800 dark:text-white">Up to {pkg.maxOccupancy}</p>
                            </div>
                          </div>
                        </div>

                        {/* Inclusions */}
                        <div className="mb-6">
                          <p className="text-sm font-medium text-forest-700 dark:text-mist-300 mb-3">
                            Package Includes:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pkg.inclusions.slice(0, 6).map((inc) => (
                              <div key={inc.name} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-forest-600 dark:text-forest-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-forest-600 dark:text-mist-400">{inc.name}</span>
                              </div>
                            ))}
                            {pkg.inclusions.length > 6 && (
                              <span className="text-sm text-forest-500 dark:text-mist-400">
                                +{pkg.inclusions.length - 6} more inclusions
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-forest-100 dark:border-forest-800">
                        <div>
                          <div className="text-sm text-forest-500 dark:text-mist-400 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-forest-800 dark:text-white">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            <span className="text-forest-600 dark:text-mist-400">/ package</span>
                          </div>
                          <div className="text-sm text-forest-500 dark:text-mist-400">
                            {pkg.mealPlan}
                          </div>
                        </div>
                        <Link href={`/booking?package=${pkg.slug}`}>
                          <Button size="lg" className="bg-walnut-600 hover:bg-walnut-700 text-white">
                            Book This Package
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Packages */}
      <section className="py-16 bg-forest-50 dark:bg-forest-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">More Options</Badge>
            <h2 className="font-heading text-3xl font-bold text-forest-800 dark:text-white">
              Other Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.filter((p) => !p.featured).map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="relative h-40 sm:h-full">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-green-600 text-white text-xs">
                        Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex flex-col">
                      <h3 className="font-heading text-lg font-semibold text-forest-800 dark:text-white mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-forest-600 dark:text-mist-400 mb-3 line-clamp-2">
                        {pkg.shortDescription}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-forest-500 dark:text-mist-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {pkg.nights} nights
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Up to {pkg.maxOccupancy}
                        </span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-forest-800 dark:text-white">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                        </div>
                        <Link href={`/booking?package=${pkg.slug}`}>
                          <Button size="sm" className="bg-walnut-600 hover:bg-walnut-700 text-white">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Package CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-forest-600 to-forest-800 text-white">
            <CardContent className="p-8 sm:p-12">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Need a Custom Package?
              </h2>
              <p className="text-lg text-white/80 mb-6">
                Planning a group trip, wedding, or special event? Our team can create a personalized package tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="bg-white text-forest-800 hover:bg-forest-50">
                    Contact Us
                  </Button>
                </Link>
                <a
                  href="https://wa.me/919361979918?text=Hi,%20I%20would%20like%20to%20discuss%20a%20custom%20package%20for%20my%20group"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
