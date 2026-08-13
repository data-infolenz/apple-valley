'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, MapPin, Clock, Shield, Heart, Users, Coffee, Mountain, ChevronLeft, ChevronRight, Phone, Calendar } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import kodaiLake1 from '@/components/public/src/img/1.png';
import kodaiLake2 from '@/components/public/src/img/kodai lake 2.png';
import kodaiLake3 from '@/components/public/src/img/kodai lake 3.png';
import kodaiLake4 from '@/components/public/src/img/kodai lake 4.jpg';
import kodaiLake5 from '@/components/public/src/img/kodai lake 5.png';
import coakersWalk1 from "@/components/public/src/img/coaker's walk 4 (1).jpg";
import coakersWalk2 from "@/components/public/src/img/coaker's walk 4 (2).jpg";
import coakersWalk3 from "@/components/public/src/img/coaker's walk 4 (3).jpg";
import coakersWalk4 from "@/components/public/src/img/coaker's walk 4 (4).jpg";
import pillarRocks1 from '@/components/public/src/img/pillar rocks 1.jpg';
import pillarRocks2 from '@/components/public/src/img/pillar rocks 2.jpg';
import pillarRocks3 from '@/components/public/src/img/pillar rocks 3.webp';
import pillarRocks4 from '@/components/public/src/img/pillar rocks 4.webp';
import pineForest1 from '@/components/public/src/img/pine forest 1.jpg';
import pineForest2 from '@/components/public/src/img/pine forest 2.jpg';
import pineForest3 from '@/components/public/src/img/pine forest 3.jpg';
import pineForest4 from '@/components/public/src/img/pine forest 4.jpg';
import premiumBalconyRoom from '@/components/public/src/img/room pic 1.webp';
import honeymoonSuiteRoom from '@/components/public/src/img/room pic 2.jpg';
import familyCottageRoom from '@/components/public/src/img/room pic 3.jpg';
import hotelOutlook from '@/components/public/src/img/hotel outlook.jpg';
import coupleMistyStayPackage from '@/components/public/src/img/Couple Misty Stay.jpg';
import familyVacationPackage from '@/components/public/src/img/Family Vacation.jpg';
import honeymoonPackage from '@/components/public/src/img/Honeymoon Package.jpg';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const kodaiLakeImages = [
  kodaiLake1.src,
  kodaiLake2.src,
  kodaiLake3.src,
  kodaiLake4.src,
  kodaiLake5.src,
];

const coakersWalkImages = [
  coakersWalk1.src,
  coakersWalk2.src,
  coakersWalk3.src,
  coakersWalk4.src,
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
];

const pillarRocksImages = [
  pillarRocks1.src,
  pillarRocks2.src,
  pillarRocks3.src,
  pillarRocks4.src,
];

const pineForestImages = [
  pineForest1.src,
  pineForest2.src,
  pineForest3.src,
  pineForest4.src,
];

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: '',
  });
  const [kodaiLakeIndex, setKodaiLakeIndex] = useState(0);
  const [kodaiLakeTouchStart, setKodaiLakeTouchStart] = useState<number | null>(null);
  const [coakersWalkIndex, setCoakersWalkIndex] = useState(0);
  const [coakersWalkTouchStart, setCoakersWalkTouchStart] = useState<number | null>(null);
  const [pillarRocksIndex, setPillarRocksIndex] = useState(0);
  const [pillarRocksTouchStart, setPillarRocksTouchStart] = useState<number | null>(null);
  const [pineForestIndex, setPineForestIndex] = useState(0);
  const [pineForestTouchStart, setPineForestTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setKodaiLakeIndex((current) => (current + 1) % kodaiLakeImages.length);
      setCoakersWalkIndex((current) => (current + 1) % coakersWalkImages.length);
      setPillarRocksIndex((current) => (current + 1) % pillarRocksImages.length);
      setPineForestIndex((current) => (current + 1) % pineForestImages.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const showPreviousKodaiLakeImage = () => {
    setKodaiLakeIndex((current) => (
      current === 0 ? kodaiLakeImages.length - 1 : current - 1
    ));
  };

  const showNextKodaiLakeImage = () => {
    setKodaiLakeIndex((current) => (current + 1) % kodaiLakeImages.length);
  };

  const showPreviousCoakersWalkImage = () => {
    setCoakersWalkIndex((current) => (
      current === 0 ? coakersWalkImages.length - 1 : current - 1
    ));
  };

  const showNextCoakersWalkImage = () => {
    setCoakersWalkIndex((current) => (current + 1) % coakersWalkImages.length);
  };

  const showPreviousPillarRocksImage = () => {
    setPillarRocksIndex((current) => (
      current === 0 ? pillarRocksImages.length - 1 : current - 1
    ));
  };

  const showNextPillarRocksImage = () => {
    setPillarRocksIndex((current) => (current + 1) % pillarRocksImages.length);
  };

  const showPreviousPineForestImage = () => {
    setPineForestIndex((current) => (
      current === 0 ? pineForestImages.length - 1 : current - 1
    ));
  };

  const showNextPineForestImage = () => {
    setPineForestIndex((current) => (current + 1) % pineForestImages.length);
  };

  const featuredRooms = [
    {
      id: 'premium-balcony',
      name: 'Premium Balcony Room',
      description: 'Step out to your private balcony facing the valley',
      price: 4500,
      image: premiumBalconyRoom.src,
      amenities: ['Lake View', 'Balcony', 'Heater', 'WiFi'],
      badge: 'Most Popular',
    },
    {
      id: 'honeymoon-suite',
      name: 'Honeymoon Suite',
      description: 'Romantic retreat with premium amenities and lake views',
      price: 7500,
      image: honeymoonSuiteRoom.src,
      amenities: ['Lake View', 'Jacuzzi', 'Fireplace', 'Butler Service'],
      badge: 'Premium',
    },
    {
      id: 'family-cottage',
      name: 'Family Cottage',
      description: 'Spacious wooden cottage perfect for families',
      price: 6000,
      image: familyCottageRoom.src,
      amenities: ['Mountain View', '2 Bedrooms', 'Kitchen', 'Garden'],
      badge: 'Family Choice',
    },
  ];

  const whyChooseUs = [
    {
      icon: Mountain,
      title: 'Prime Location',
      description: 'Minutes from Kodai Lake with stunning misty hill views',
    },
    {
      icon: Heart,
      title: 'Warm Hospitality',
      description: 'Personalized service from our dedicated team',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: '24/7 security and sanitized rooms',
    },
    {
      icon: Coffee,
      title: 'Dining Experience',
      description: 'Authentic hill-station cuisine with local flavors',
    },
  ];

  const attractions = [
    {
      name: 'Kodai Lake',
      distance: '0.5 km',
      image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    },
    {
      name: "Coaker's Walk",
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
    },
    {
      name: 'Pillar Rocks',
      distance: '8 km',
      image: 'https://images.pexels.com/photos/2583854/pexels-photo-2583854.jpeg',
    },
    {
      name: 'Pine Forest',
      distance: '5.5 km',
      image: 'https://images.pexels.com/photos/1421903/pexels-photo-1421903.jpeg',
    },
  ];

  const packages = [
    {
      name: 'Couple Misty Stay',
      nights: 2,
      price: 8999,
      originalPrice: 12000,
      image: coupleMistyStayPackage.src,
    },
    {
      name: 'Family Vacation',
      nights: 3,
      price: 19999,
      originalPrice: 25000,
      image: familyVacationPackage.src,
    },
    {
      name: 'Honeymoon Package',
      nights: 3,
      price: 24999,
      originalPrice: 32000,
      image: honeymoonPackage.src,
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Chennai',
      rating: 5,
      text: 'The misty hills view from our balcony was magical. Staff was incredibly helpful. Perfect getaway!',
    },
    {
      name: 'Rahul Menon',
      location: 'Bangalore',
      rating: 5,
      text: 'Family cottage was spacious and cozy. Kids loved the campfire. Will definitely return.',
    },
    {
      name: 'Anjali Krishnan',
      location: 'Coimbatore',
      rating: 5,
      text: 'Honeymoon suite exceeded expectations. Candle light dinner was romantic. Highly recommend!',
    },
  ];

  const handleSearchRooms = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn);
    if (searchParams.checkOut) params.set('checkOut', searchParams.checkOut);
    if (searchParams.guests) params.set('guests', searchParams.guests);
    if (searchParams.roomType) params.set('roomType', searchParams.roomType);

    window.location.href = `/booking?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg"
            alt="Misty hills of Kodaikanal"
            className="block dark:hidden w-full h-full object-cover brightness-110 saturate-110"
          />
          <img
            src="https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg"
            alt="Misty hills of Kodaikanal"
            className="hidden dark:block w-full h-full object-cover brightness-75 saturate-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-white/5 dark:from-black/70 dark:via-black/50 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/45 via-transparent to-white/10 dark:from-black/60 dark:via-transparent dark:to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:min-h-[calc(90vh-112px)] lg:flex lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-walnut-600/90 text-white border-0">
              Premium Hill Station Resort
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-950 dark:text-white mb-6 leading-tight">
              Escape to the Misty Hills of Kodaikanal
            </h1>
            <p className="text-lg sm:text-xl text-forest-800 dark:text-white/90 mb-8 leading-relaxed">
              Book your perfect stay with lake views, cozy rooms, and peaceful hill-station comfort.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking">
                <Button size="lg" className="bg-walnut-600 hover:bg-walnut-700 text-white">
                  Book Your Stay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/rooms">
                <Button size="lg" variant="outline" className="bg-white/70 border-forest-300 text-forest-800 hover:bg-white dark:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/20">
                  Explore Rooms
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Booking Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex justify-end lg:mt-0 lg:absolute lg:right-8 lg:top-[40%] lg:-translate-y-1/2"
          >
            <div className="booking-panel w-full sm:max-w-md lg:w-[340px] p-6 ml-auto">
              <form onSubmit={handleSearchRooms} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-forest-800 dark:text-mist-100 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 rounded-lg border border-forest-300 dark:border-mist-600 bg-white dark:bg-mist-950 text-forest-950 dark:text-mist-50 shadow-sm focus:ring-2 focus:ring-forest-500"
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-forest-800 dark:text-mist-100 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 rounded-lg border border-forest-300 dark:border-mist-600 bg-white dark:bg-mist-950 text-forest-950 dark:text-mist-50 shadow-sm focus:ring-2 focus:ring-forest-500"
                    value={searchParams.checkOut}
                    onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-forest-800 dark:text-mist-100 mb-1">
                    <Users className="w-4 h-4 inline mr-1" />
                    Guests
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg border border-forest-300 dark:border-mist-600 bg-white dark:bg-mist-950 text-forest-950 dark:text-mist-50 shadow-sm focus:ring-2 focus:ring-forest-500"
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-forest-800 dark:text-mist-100 mb-1">
                    Room Type
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg border border-forest-300 dark:border-mist-600 bg-white dark:bg-mist-950 text-forest-950 dark:text-mist-50 shadow-sm focus:ring-2 focus:ring-forest-500"
                    value={searchParams.roomType}
                    onChange={(e) => setSearchParams({ ...searchParams, roomType: e.target.value })}
                  >
                    <option value="">All Rooms</option>
                    <option value="deluxe-hill-view">Deluxe Hill View</option>
                    <option value="premium-balcony">Premium Balcony</option>
                    <option value="family-cottage">Family Cottage</option>
                    <option value="honeymoon-suite">Honeymoon Suite</option>
                    <option value="budget-standard">Budget Standard</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700 text-white">
                    Search Rooms
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section id="rooms" className="py-20 bg-stone-50 dark:bg-forest-950 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Accommodations</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-4">
              Featured Rooms & Suites
            </h2>
            <p className="text-lg text-forest-600 dark:text-mist-400 max-w-2xl mx-auto">
              Experience comfort in our handcrafted rooms with misty hill views
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-walnut-600 text-white">
                      {room.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-forest-800 dark:text-white mb-2">
                      {room.name}
                    </h3>
                    <p className="text-forest-600 dark:text-mist-400 text-sm mb-4">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs px-2 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-forest-800 dark:text-white">
                          ₹{room.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-forest-600 dark:text-mist-400"> /night</span>
                      </div>
                      <Link href={`/rooms/${room.id}`}>
                        <Button variant="outline" size="sm" className="text-forest-600 dark:text-forest-300">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/rooms">
              <Button className="bg-forest-600 hover:bg-forest-700 text-white">
                View All Rooms
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">Why Choose Us</Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-6">
                Your Perfect Hill Station Escape Awaits
              </h2>
              <p className="text-lg text-forest-600 dark:text-mist-400 mb-8">
                Nestled in the misty hills of Kodaikanal, Apple Valley offers an unforgettable experience with premium accommodations, stunning views, and warm hospitality that makes every stay special.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-forest-600 dark:text-forest-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-forest-800 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-forest-600 dark:text-mist-400">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={hotelOutlook.src}
                alt="Apple Valley"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-forest-800 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-walnut-400 text-walnut-400" />
                  ))}
                </div>
                <p className="text-forest-800 dark:text-white font-semibold">4.5 Rating</p>
                <p className="text-sm text-forest-600 dark:text-mist-400">500+ Reviews</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section id="attractions" className="py-20 bg-stone-50 dark:bg-forest-950 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Explore</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-4">
              Nearby Attractions
            </h2>
            <p className="text-lg text-forest-600 dark:text-mist-400 max-w-2xl mx-auto">
              Discover the beauty of Kodaikanal with these must-visit destinations near our retreat
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden"
                onTouchStart={(e) => {
                  if (attraction.name === 'Kodai Lake') {
                    setKodaiLakeTouchStart(e.touches[0].clientX);
                  }
                  if (attraction.name === "Coaker's Walk") {
                    setCoakersWalkTouchStart(e.touches[0].clientX);
                  }
                  if (attraction.name === 'Pillar Rocks') {
                    setPillarRocksTouchStart(e.touches[0].clientX);
                  }
                  if (attraction.name === 'Pine Forest') {
                    setPineForestTouchStart(e.touches[0].clientX);
                  }
                }}
                onTouchEnd={(e) => {
                  if (attraction.name === 'Kodai Lake') {
                    if (kodaiLakeTouchStart === null) return;

                    const distance = kodaiLakeTouchStart - e.changedTouches[0].clientX;
                    if (Math.abs(distance) > 40) {
                      if (distance > 0) {
                        showNextKodaiLakeImage();
                      } else {
                        showPreviousKodaiLakeImage();
                      }
                    }
                    setKodaiLakeTouchStart(null);
                  }

                  if (attraction.name === "Coaker's Walk") {
                    if (coakersWalkTouchStart === null) return;

                    const distance = coakersWalkTouchStart - e.changedTouches[0].clientX;
                    if (Math.abs(distance) > 40) {
                      if (distance > 0) {
                        showNextCoakersWalkImage();
                      } else {
                        showPreviousCoakersWalkImage();
                      }
                    }
                    setCoakersWalkTouchStart(null);
                  }

                  if (attraction.name === 'Pillar Rocks') {
                    if (pillarRocksTouchStart === null) return;

                    const distance = pillarRocksTouchStart - e.changedTouches[0].clientX;
                    if (Math.abs(distance) > 40) {
                      if (distance > 0) {
                        showNextPillarRocksImage();
                      } else {
                        showPreviousPillarRocksImage();
                      }
                    }
                    setPillarRocksTouchStart(null);
                  }

                  if (attraction.name === 'Pine Forest') {
                    if (pineForestTouchStart === null) return;

                    const distance = pineForestTouchStart - e.changedTouches[0].clientX;
                    if (Math.abs(distance) > 40) {
                      if (distance > 0) {
                        showNextPineForestImage();
                      } else {
                        showPreviousPineForestImage();
                      }
                    }
                    setPineForestTouchStart(null);
                  }
                }}
              >
                <img
                  src={
                    attraction.name === 'Kodai Lake'
                      ? kodaiLakeImages[kodaiLakeIndex]
                      : attraction.name === "Coaker's Walk"
                      ? coakersWalkImages[coakersWalkIndex]
                      : attraction.name === 'Pillar Rocks'
                      ? pillarRocksImages[pillarRocksIndex]
                      : attraction.name === 'Pine Forest'
                      ? pineForestImages[pineForestIndex]
                      : attraction.image
                  }
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {attraction.name === 'Kodai Lake' && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous Kodai Lake image"
                      onClick={showPreviousKodaiLakeImage}
                      className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Kodai Lake image"
                      onClick={showNextKodaiLakeImage}
                      className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute left-4 top-4 z-20 flex gap-1.5">
                      {kodaiLakeImages.map((image, imageIndex) => (
                        <button
                          key={image}
                          type="button"
                          aria-label={`Show Kodai Lake image ${imageIndex + 1}`}
                          onClick={() => setKodaiLakeIndex(imageIndex)}
                          className={`h-1.5 rounded-full transition-all ${
                            kodaiLakeIndex === imageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/55'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {attraction.name === "Coaker's Walk" && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous Coaker's Walk image"
                      onClick={showPreviousCoakersWalkImage}
                      className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Coaker's Walk image"
                      onClick={showNextCoakersWalkImage}
                      className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute left-4 top-4 z-20 flex gap-1.5">
                      {coakersWalkImages.map((image, imageIndex) => (
                        <button
                          key={image}
                          type="button"
                          aria-label={`Show Coaker's Walk image ${imageIndex + 1}`}
                          onClick={() => setCoakersWalkIndex(imageIndex)}
                          className={`h-1.5 rounded-full transition-all ${
                            coakersWalkIndex === imageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/55'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {attraction.name === 'Pillar Rocks' && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous Pillar Rocks image"
                      onClick={showPreviousPillarRocksImage}
                      className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Pillar Rocks image"
                      onClick={showNextPillarRocksImage}
                      className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute left-4 top-4 z-20 flex gap-1.5">
                      {pillarRocksImages.map((image, imageIndex) => (
                        <button
                          key={image}
                          type="button"
                          aria-label={`Show Pillar Rocks image ${imageIndex + 1}`}
                          onClick={() => setPillarRocksIndex(imageIndex)}
                          className={`h-1.5 rounded-full transition-all ${
                            pillarRocksIndex === imageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/55'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {attraction.name === 'Pine Forest' && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous Pine Forest image"
                      onClick={showPreviousPineForestImage}
                      className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Pine Forest image"
                      onClick={showNextPineForestImage}
                      className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-800 shadow-md transition hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute left-4 top-4 z-20 flex gap-1.5">
                      {pineForestImages.map((image, imageIndex) => (
                        <button
                          key={image}
                          type="button"
                          aria-label={`Show Pine Forest image ${imageIndex + 1}`}
                          onClick={() => setPineForestIndex(imageIndex)}
                          className={`h-1.5 rounded-full transition-all ${
                            pineForestIndex === imageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/55'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-heading text-lg font-semibold text-white mb-1">
                    {attraction.name}
                  </h3>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {attraction.distance} from hotel
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/attractions">
              <Button className="bg-forest-600 hover:bg-forest-700 text-white">
                View All Attractions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 bg-white dark:bg-forest-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Special Offers</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-4">
              Exclusive Packages
            </h2>
            <p className="text-lg text-forest-600 dark:text-mist-400 max-w-2xl mx-auto">
              Curated experiences for every type of traveler
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                      Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-forest-800 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-forest-600 dark:text-mist-400 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.nights} Nights</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-forest-500 dark:text-mist-500 line-through">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                        <div className="text-2xl font-bold text-forest-800 dark:text-white">
                          ₹{pkg.price.toLocaleString()}
                        </div>
                      </div>
                      <Link href={`/packages/${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button className="bg-walnut-600 hover:bg-walnut-700 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/packages">
              <Button variant="outline" className="text-forest-600 dark:text-forest-300">
                View All Packages
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-forest-50 dark:bg-forest-950 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Guest Reviews</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-4">
              What Our Guests Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-walnut-400 text-walnut-400" />
                      ))}
                    </div>
                    <p className="text-forest-700 dark:text-mist-300 mb-6 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold text-forest-800 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-forest-500 dark:text-mist-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Contact */}
      <section id="contact" className="py-20 bg-white dark:bg-forest-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">Location</Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-6">
                Find Us in Kodaikanal
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-walnut-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-forest-800 dark:text-white">Anna Salai, Opposite the Police Station</p>
                    <p className="text-forest-600 dark:text-mist-400">Municipal Colony, Kodaikanal, Tamil Nadu 624101</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-walnut-600 shrink-0" />
                  <a href="tel:+919361979918" className="text-forest-700 dark:text-mist-300 hover:text-forest-900 dark:hover:text-white">
                    +91 93619 79918
                  </a>
                </div>
              </div>
              <Link href="/contact">
                <Button className="bg-forest-600 hover:bg-forest-700 text-white">
                  Get Directions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31443.9350629!2d77.46!3d10.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07d5c7d5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sKodaikanal%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Apple Valley Location"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-12 bg-gradient-to-b from-green-700 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="font-heading text-xl font-semibold mb-1">Have Questions?</h3>
              <p className="text-green-100">Chat with us on WhatsApp for instant support</p>
            </div>
            <a
              href="https://wa.me/919361979918?text=Hi,%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Apple%20Valley"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
