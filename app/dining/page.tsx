'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Flame,
  Cake,
  Flower2,
  BedDouble,
  Wine,
  Music,
  Plus,
  ArrowRight,
  Check,
} from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import inHouseRestaurantImage from '@/components/public/src/img/in house restaurant.jpg';
import candleLightDinnerImage from '@/components/public/src/img/Candle Light Dinner.jpg';
import bbqDinnerImage from '@/components/public/src/img/bbq dinner.webp';
import restaurantHeroImage from '@/components/public/src/img/restaurant.webp';

const diningOptions = [
  {
    id: 'restaurant',
    name: 'In-House Restaurant',
    category: 'dining',
    description: 'Enjoy authentic Tamil Nadu cuisine and multi-cuisine dishes at our mist-view restaurant. Fresh locally sourced ingredients and traditional recipes.',
    image: inHouseRestaurantImage.src,
    price: 'Ala carte',
    unit: 'as per menu',
    features: ['Vegetarian & Non-Veg options', 'Local hill-station specialties', 'All-day dining', 'Lake view seating'],
  },
  {
    id: 'candle-light-dinner',
    name: 'Candle Light Dinner',
    category: 'dining',
    description: 'Romantic 4-course dinner for two with candlelight, soft music, and lake views. Perfect for anniversaries, proposals, or date nights.',
    image: candleLightDinnerImage.src,
    price: 1500,
    unit: 'per couple',
    features: ['4-Course meal', ' complimentary wine/juice', 'Rose decoration', 'Private setup'],
  },
  {
    id: 'bbq-dinner',
    name: 'BBQ Dinner',
    category: 'dining',
    description: 'Outdoor BBQ experience with grilled delicacies, campfire atmosphere, and hill station breeze. Great for groups and families.',
    image: bbqDinnerImage.src,
    price: 1200,
    unit: 'per person',
    features: ['Veg & Non-Veg options', 'Live grilling', 'Salad bar', 'Dessert included'],
  },
];

const celebrationAddOns: Array<{
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  price: number;
  unit: string;
  duration?: string;
  includes?: string[];
  sizes?: string[];
}> = [
  {
    id: 'campfire',
    name: 'Campfire Evening',
    icon: Flame,
    description: 'Private campfire session with wooden seating and hill views. Perfect for chilly evenings.',
    price: 500,
    unit: 'per session',
    duration: '2-3 hours',
    includes: ['Firewood', 'Seating arrangement', 'Snacks (optional extra)'],
  },
  {
    id: 'birthday-cake',
    name: 'Birthday Cake',
    icon: Cake,
    description: 'Celebrate with a fresh designer cake. Multiple flavors and customization options available.',
    price: 800,
    unit: 'per cake',
    sizes: ['500g (₹800)', '1kg (₹1400)', 'Custom designs available'],
  },
  {
    id: 'flower-decoration',
    name: 'Flower Decoration',
    icon: Flower2,
    description: 'Fresh flower arrangement for your room. Rose petals, orchids, and seasonal flowers.',
    price: 1000,
    unit: 'per room',
    includes: ['Rose petal bed decoration', 'Fresh bouquet', 'Candle setup'],
  },
  {
    id: 'celebration-setup',
    name: 'Celebration Setup',
    icon: Music,
    description: 'Complete party setup with balloons, banners, and decorations. Ideal for birthdays and anniversaries.',
    price: 2500,
    unit: 'per event',
    includes: ['Room decoration', 'Balloons', 'Happy Birthday banner', 'Small gift'],
  },
];

const comfortAddOns = [
  {
    id: 'extra-blanket',
    name: 'Extra Blanket',
    icon: BedDouble,
    description: 'Additional warm blankets for extra comfort during chilly nights.',
    price: 150,
    unit: 'per night',
    availability: 'Available year-round',
  },
  {
    id: 'extra-bed',
    name: 'Extra Bed',
    icon: BedDouble,
    description: 'Folding bed for additional guest. Includes mattress and bedding.',
    price: 500,
    unit: 'per night',
    maxOccupancyNote: 'Room max occupancy may apply',
  },
];

const transportAddOns: Array<{
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  price: number;
  unit: string;
  includes: string[];
  attractions?: string[];
}> = [];

const climateInfo = [
  { month: 'Jan-Feb', temp: '8-25°C', tip: 'Peak winter - Heaters essential' },
  { month: 'Mar-May', temp: '15-30°C', tip: 'Pleasant - No heater needed' },
  { month: 'Jun-Sep', temp: '12-22°C', tip: 'Monsoon - Rainwear recommended' },
  { month: 'Oct-Dec', temp: '10-28°C', tip: 'Post-monsoon - Cool evenings' },
];

export default function DiningPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />

      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={restaurantHeroImage.src}
            alt="Dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y:20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl font-bold mb-4"
          >
            Dining & Add-ons
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            Enhance your stay with our dining experiences and comfort add-ons
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="dining" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto">
                <TabsTrigger
                  value="dining"
                  className="data-[state=active]:bg-forest-600 data-[state=active]:text-white px-4 py-2 rounded-full border border-forest-200 dark:border-forest-700"
                >
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Dining
                </TabsTrigger>
                <TabsTrigger
                  value="celebration"
                  className="data-[state=active]:bg-forest-600 data-[state=active]:text-white px-4 py-2 rounded-full border border-forest-200 dark:border-forest-700"
                >
                  <Cake className="w-4 h-4 mr-2" />
                  Celebrations
                </TabsTrigger>
                <TabsTrigger
                  value="comfort"
                  className="data-[state=active]:bg-forest-600 data-[state=active]:text-white px-4 py-2 rounded-full border border-forest-200 dark:border-forest-700"
                >
                  <BedDouble className="w-4 h-4 mr-2" />
                  Comfort
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dining Tab */}
            <TabsContent value="dining">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diningOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={option.image}
                          alt={option.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-walnut-600 text-white">
                          Dining
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-heading text-xl font-semibold text-forest-800 dark:text-white mb-2">
                          {option.name}
                        </h3>
                        <p className="text-forest-600 dark:text-mist-400 text-sm mb-4">
                          {option.description}
                        </p>
                        <ul className="space-y-2 mb-4">
                          {option.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-forest-600 dark:text-mist-400">
                              <Check className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between pt-4 border-t border-forest-100 dark:border-forest-800">
                          <div>
                            {typeof option.price === 'number' ? (
                              <>
                                <span className="text-2xl font-bold text-forest-800 dark:text-white">
                                  ₹{option.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-forest-500 dark:text-mist-400"> {option.unit}</span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-forest-800 dark:text-white">
                                {option.price}
                              </span>
                            )}
                          </div>
                          <Link href="/booking">
                            <Button className="bg-walnut-600 hover:bg-walnut-700 text-white">
                              Add to Booking
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Celebration Tab */}
            <TabsContent value="celebration">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {celebrationAddOns.map((addon, index) => (
                  <motion.div
                    key={addon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-walnut-100 dark:bg-walnut-900/50 flex items-center justify-center mb-4">
                          <addon.icon className="w-6 h-6 text-walnut-600" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-forest-800 dark:text-white mb-2">
                          {addon.name}
                        </h3>
                        <p className="text-sm text-forest-600 dark:text-mist-400 mb-4">
                          {addon.description}
                        </p>
                        {(addon.includes || addon.sizes || addon.duration) && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-forest-500 dark:text-mist-500 mb-2">
                              {addon.includes ? 'Includes:' : addon.sizes ? 'Sizes:' : 'Duration:'}
                            </p>
                            <ul className="space-y-1">
                              {(addon.includes || addon.sizes || [addon.duration])?.map((item) => (
                                <li key={item} className="text-xs text-forest-600 dark:text-mist-400 flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-forest-500 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-forest-100 dark:border-forest-800">
                          <div>
                            <span className="text-xl font-bold text-forest-800 dark:text-white">
                              ₹{addon.price}
                            </span>
                            <span className="text-xs text-forest-500 dark:text-mist-400"> {addon.unit}</span>
                          </div>
                          <Link href="/booking">
                            <Button size="sm" variant="outline" className="text-forest-600 dark:text-forest-300">
                              Add
                              <Plus className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Comfort Tab */}
            <TabsContent value="comfort">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {comfortAddOns.map((addon, index) => (
                  <motion.div
                    key={addon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center mb-4">
                          <addon.icon className="w-6 h-6 text-forest-600" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-forest-800 dark:text-white mb-2">
                          {addon.name}
                        </h3>
                        <p className="text-sm text-forest-600 dark:text-mist-400 mb-4">
                          {addon.description}
                        </p>
                        {addon.availability && (
                          <Badge variant="outline" className="mb-4">
                            {addon.availability}
                          </Badge>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-forest-100 dark:border-forest-800">
                          <div>
                            <span className="text-xl font-bold text-forest-800 dark:text-white">
                              ₹{addon.price}
                            </span>
                            <span className="text-xs text-forest-500 dark:text-mist-400"> {addon.unit}</span>
                          </div>
                          <Link href="/booking">
                            <Button size="sm" variant="outline" className="text-forest-600 dark:text-forest-300">
                              Add
                              <Plus className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Climate Info */}
              <div className="mt-12">
                <Card className="bg-forest-50 dark:bg-forest-900/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-forest-800 dark:text-white mb-4">
                      Kodaikanal Climate Guide
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {climateInfo.map((info) => (
                        <div key={info.month} className="text-center p-4 bg-white dark:bg-forest-800 rounded-lg">
                          <p className="font-semibold text-forest-800 dark:text-white">{info.month}</p>
                          <p className="text-lg font-bold text-walnut-600">{info.temp}</p>
                          <p className="text-xs text-forest-500 dark:text-mist-400 mt-1">{info.tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transport Tab */}
            <TabsContent value="transport">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transportAddOns.map((addon, index) => (
                  <motion.div
                    key={addon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-lake-100 dark:bg-lake-900/50 flex items-center justify-center mb-4">
                          <addon.icon className="w-6 h-6 text-lake-600" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-forest-800 dark:text-white mb-2">
                          {addon.name}
                        </h3>
                        <p className="text-sm text-forest-600 dark:text-mist-400 mb-4">
                          {addon.description}
                        </p>
                        <div className="mb-4">
                          <p className="text-xs font-medium text-forest-500 dark:text-mist-500 mb-2">Includes:</p>
                          <ul className="space-y-1">
                            {addon.includes.map((item) => (
                              <li key={item} className="text-xs text-forest-600 dark:text-mist-400 flex items-start gap-1">
                                <Check className="w-3 h-3 mt-0.5 text-forest-500 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {addon.attractions && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-forest-500 dark:text-mist-500 mb-2">Covering:</p>
                            <div className="flex flex-wrap gap-1">
                              {addon.attractions.map((a) => (
                                <Badge key={a} variant="outline" className="text-xs">
                                  {a}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-forest-100 dark:border-forest-800">
                          <div>
                            <span className="text-xl font-bold text-forest-800 dark:text-white">
                              ₹{addon.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-forest-500 dark:text-mist-400"> {addon.unit}</span>
                          </div>
                          <Link href="/booking">
                            <Button className="bg-walnut-600 hover:bg-walnut-700 text-white">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
