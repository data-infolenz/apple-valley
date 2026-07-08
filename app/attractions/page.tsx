'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Calendar,
  Mountain,
  TreePine,
  Camera,
  Sunrise,
  Navigation,
  ArrowRight,
  Info,
} from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import kodaiLakeImage from '@/components/public/src/img/kodai lake 5.png';
import coakersWalkImage from "@/components/public/src/img/coaker's walk 4 (1).jpg";
import pillarRocksImage from '@/components/public/src/img/pillar rocks 1.jpg';
import pineForestImage from '@/components/public/src/img/pine forest 1.jpg';
import bryantParkImage from '@/components/public/src/img/bryant-park-1.jpg';
import gunaCaveImage from '@/components/public/src/img/guna cave -2.jpg';

const attractions = [
  {
    id: 'kodai-lake',
    name: 'Kodai Lake',
    slug: 'kodai-lake',
    description: 'A star-shaped man-made lake in the heart of Kodaikanal.Perfect for boating, cycling along the promenade, and enjoying sunset views. The lake is the center of all activities in the town and a must-visit for every tourist.',
    shortDescription: 'Star-shaped lake, boating, cycling promenade',
    image: kodaiLakeImage.src,
    gallery: [
      kodaiLakeImage.src,
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
    ],
    category: 'nature',
    distance: 0.5,
    visitDuration: '1-2 hours',
    timings: '8:00 AM - 6:00 PM',
    entryFee: 'Boating charges apply',
    bestTimeToVisit: 'Morning and Evening',
    tips: 'Rent a cycle and go around the 5km lake perimeter for a lovely experience. Evening boat rides during sunset are magical.',
    featured: true,
  },
  {
    id: 'coakers-walk',
    name: "Coaker's Walk",
    slug: 'coakers-walk',
    description: "A 1 km long paved pedestrian path on the edge of a cliff offering breathtaking views. On clear days, you can see views of the Virupaksha Peak and the valley below. Walk during early morning for misty views and the best photography opportunities.",
    shortDescription: 'Scenic cliff walk, panoramic valley views',
    image: coakersWalkImage.src,
    gallery: [
      coakersWalkImage.src,
      'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    ],
    category: 'viewpoint',
    distance: 1.2,
    visitDuration: '30 mins - 1 hour',
    timings: '7:00 AM - 7:00 PM',
    bestTimeToVisit: 'Early Morning',
    tips: 'Visit on a clear day for the best views. The morning mist creates a magical atmosphere perfect for photography.',
    featured: true,
  },
  {
    id: 'bryant-park',
    name: 'Bryant Park',
    slug: 'bryant-park',
    description: 'A beautiful botanical garden spread across 20 acres with over 740 species of plants. Famous for its rose garden, annual horticultural shows, and the 300-year-old eucalyptus tree. Great for families and nature lovers.',
    shortDescription: 'Botanical garden, rose collection, boating lake',
    image: bryantParkImage.src,
    gallery: [
      bryantParkImage.src,
      'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    ],
    category: 'park',
    distance: 2.0,
    visitDuration: '1-2 hours',
    timings: '9:00 AM - 6:00 PM',
    entryFee: 'Minimal entry fee',
    bestTimeToVisit: 'During Flower Show (May)',
    tips: 'The annual flower show in May is a must-see. Great place for picnics with family.',
    featured: true,
  },
  {
    id: 'pillar-rocks',
    name: 'Pillar Rocks',
    slug: 'pillar-rocks',
    description: 'Three giant rock pillars standing 400 feet tall offering breathtaking views of the valley below. The viewpoint provides spectacular vistas especially during sunset. One of the most photographed spots in Kodaikanal.',
    shortDescription: 'Giant rock pillars, valley viewpoint',
    image: pillarRocksImage.src,
    gallery: [
      pillarRocksImage.src,
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
    ],
    category: 'viewpoint',
    distance: 8.0,
    visitDuration: '30-45 mins',
    timings: '9:00 AM - 5:30 PM',
    bestTimeToVisit: 'Afternoon for best visibility',
    tips: 'Combined with Green Valley View and Moir Point for a scenic route. Carry a light jacket as it gets windy.',
    featured: true,
  },
  {
    id: 'pine-forest',
    name: 'Pine Forest',
    slug: 'pine-forest',
    description: 'A serene forest of tall pine trees perfect for nature walks and photography. The misty atmosphere creates magical photo opportunities throughout the year. Popular filming location for Indian movies.',
    shortDescription: 'Tall pine trees, misty walks, photography',
    image: pineForestImage.src,
    gallery: [
      pineForestImage.src,
      'https://images.pexels.com/photos/2583854/pexels-photo-2583854.jpeg',
    ],
    category: 'nature',
    distance: 5.5,
    visitDuration: '30 mins - 1 hour',
    bestTimeToVisit: 'Morning, especially during monsoon',
    tips: 'Best visited in the morning. The pine needle covered ground creates beautiful photo backdrops.',
    featured: false,
  },
  {
    id: 'guna-caves',
    name: 'Guna Caves',
    slug: 'guna-caves',
    description: 'Famous cave formations surrounded by dense forest. Known for their natural rock formations and the movie "Manjummel Boys". Accessible with guided tours. A unique adventure experience for thrill seekers.',
    shortDescription: 'Natural caves, forest trails, adventure',
    image: gunaCaveImage.src,
    gallery: [
      gunaCaveImage.src,
      'https://images.pexels.com/photos/1421903/pexels-photo-1421903.jpeg',
    ],
    category: 'cave',
    distance: 10.0,
    visitDuration: '1-2 hours',
    timings: '8:00 AM - 5:00 PM',
    tips: 'Wear comfortable shoes for the trek. Guided tours are available and recommended.',
    featured: true,
  },
];

const categories = [
  { id: 'all', name: 'All Attractions', icon: MapPin },
  { id: 'nature', name: 'Nature', icon: Mountain },
  { id: 'viewpoint', name: 'Viewpoints', icon: Camera },
  { id: 'park', name: 'Parks', icon: TreePine },
  { id: 'cave', name: 'Caves', icon: Mountain },
];

export default function AttractionsPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg"
            alt="Kodaikanal Attractions"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl font-bold mb-4"
          >
            Discover Kodaikanal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            Explore the misty hills, serene lakes, and breathtaking viewpoints of this hill station paradise
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-forest-600 data-[state=active]:text-white px-4 py-2 rounded-full border border-forest-200 dark:border-forest-700"
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attractions
                    .filter((a) => cat.id === 'all' || a.category === cat.id)
                    .map((attraction, index) => (
                      <motion.div
                        key={attraction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={attraction.image}
                              alt={attraction.name}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <Badge className="absolute top-4 left-4 bg-forest-600 text-white capitalize">
                              {attraction.category}
                            </Badge>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="font-heading text-xl font-semibold text-white">
                                {attraction.name}
                              </h3>
                            </div>
                          </div>

                          <CardContent className="p-5">
                            <p className="text-forest-600 dark:text-mist-400 text-sm mb-4 line-clamp-2">
                              {attraction.shortDescription}
                            </p>

                            <div className="space-y-2 text-sm mb-4">
                              <div className="flex items-center gap-2 text-forest-600 dark:text-mist-400">
                                <MapPin className="w-4 h-4 text-walnut-600 shrink-0" />
                                <span>{attraction.distance} km from hotel</span>
                              </div>
                              {attraction.timings && (
                                <div className="flex items-center gap-2 text-forest-600 dark:text-mist-400">
                                  <Clock className="w-4 h-4 text-walnut-600 shrink-0" />
                                  <span>{attraction.timings}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-forest-600 dark:text-mist-400">
                                <Clock className="w-4 h-4 text-walnut-600 shrink-0" />
                                <span>Visit Duration: {attraction.visitDuration}</span>
                              </div>
                              {attraction.entryFee && (
                                <div className="flex items-center gap-2 text-forest-600 dark:text-mist-400">
                                  <Info className="w-4 h-4 text-walnut-600 shrink-0" />
                                  <span>{attraction.entryFee}</span>
                                </div>
                              )}
                              {attraction.bestTimeToVisit && (
                                <div className="flex items-center gap-2 text-forest-600 dark:text-mist-400">
                                  <Sunrise className="w-4 h-4 text-walnut-600 shrink-0" />
                                  <span>Best: {attraction.bestTimeToVisit}</span>
                                </div>
                              )}
                            </div>

                            {attraction.tips && (
                              <div className="p-3 bg-forest-50 dark:bg-forest-900/50 rounded-lg text-sm text-forest-600 dark:text-mist-300 mb-4">
                                <strong>Tip:</strong> {attraction.tips}
                              </div>
                            )}

                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Location Guide</Badge>
              <h2 className="font-heading text-3xl font-bold text-forest-800 dark:text-white mb-4">
                All Attractions Nearby
              </h2>
              <p className="text-lg text-forest-600 dark:text-mist-400 mb-6">
                Apple Valley is perfectly positioned to give you easy access to all major Kodaikanal attractions. Most popular spots are within 10 km of our location.
              </p>
              <div className="space-y-3">
                {attractions.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-walnut-600 shrink-0" />
                    <span className="text-forest-700 dark:text-mist-300 font-medium">{a.name}</span>
                    <span className="text-sm text-forest-500 dark:text-mist-400">({a.distance} km)</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31443.9350629!2d77.46!3d10.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07d5c7d5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sKodaikanal%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-xl"
                title="Kodaikanal Attractions Map"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
