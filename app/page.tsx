'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import RoomSlideshow from '@/components/public/RoomSlideshow';
import { roomImages } from '@/lib/room-images';
import { getRoomAmenities } from '@/lib/room-amenities';
import { ArrowRight, Star, MapPin, Clock, Shield, Heart, Coffee, Mountain, ChevronLeft, ChevronRight, Phone, ParkingSquareIcon, Stethoscope, Bed, Utensils } from 'lucide-react';
import Header from '@/components/public/Header';
import BackgroundParticles from '@/components/public/BackgroundParticles';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import restaurantImage from '@/components/public/src/img/in house restaurant.png';
import restaurantImage2 from '@/components/public/src/img/in house restaurant1.png';
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
import whyChooseImage from '@/public/why to choose img.png';
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

const heroSlides = [
  '/landing%20page/front.png',
  '/landing%20page/IMG_6506.jpg',
  '/landing%20page/IMG_6509.jpg',
  '/landing%20page/IMG_6523.jpg',
  '/landing%20page/IMG_6524.jpg',
  '/landing%20page/IMG_6525.jpg',
  '/landing%20page/reception.png',
  '/landing%20page/recption%202.png',
  '/landing%20page/waiting%20area.png',
];

const restaurantImages = [restaurantImage.src, restaurantImage2.src];

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
  const [kodaiLakeIndex, setKodaiLakeIndex] = useState(0);
  const [kodaiLakeTouchStart, setKodaiLakeTouchStart] = useState<number | null>(null);
  const [coakersWalkIndex, setCoakersWalkIndex] = useState(0);
  const [coakersWalkTouchStart, setCoakersWalkTouchStart] = useState<number | null>(null);
  const [pillarRocksIndex, setPillarRocksIndex] = useState(0);
  const [pillarRocksTouchStart, setPillarRocksTouchStart] = useState<number | null>(null);
  const [pineForestIndex, setPineForestIndex] = useState(0);
  const [pineForestTouchStart, setPineForestTouchStart] = useState<number | null>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % heroSlides.length);
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
      id: 'deluxe',
      name: 'Deluxe',
      description: 'Comfortable room with essential amenities',
      price: 3500,
      amenities: getRoomAmenities('deluxe'),
      badge: 'Best Value',
    },
    {
      id: 'super-deluxe',
      name: 'Super Deluxe',
      description: 'Larger premium room with upgraded comfort',
      price: 4500,
      amenities: getRoomAmenities('super-deluxe'),
      badge: 'Popular',
    },
    {
      id: 'triple-deluxe',
      name: 'Triple Deluxe',
      description: 'Deluxe room prepared for three guests',
      price: 5200,
      amenities: getRoomAmenities('triple-deluxe'),
      badge: 'Triple Stay',
    },
    {
      id: 'honeymoon-suite',
      name: 'Honeymoon Suite',
      description: 'Romantic retreat with a refrigerator and coffee maker',
      price: 7500,
      amenities: getRoomAmenities('honeymoon-suite'),
      badge: 'Premium',
    },
  ];

  const whyChooseUs = [
    {
      icon: Mountain,
      title: 'Prime Location',
      description: 'Discover the charm of Kodaikanal from Apple Valley, an inviting base for exploring the hill town and making the most of your getaway.',
    },
     {
      icon: ParkingSquareIcon,
      title: 'Car Parking',
      description: 'Enjoy a worry-free stay with our spacious and secure car-parking facility, offering easy access and complete convenience throughout your visit.',
    },
    {
      icon: Stethoscope,
      title: 'Doctor on call',
      description: 'Medical assistance is just a call away, with a doctor available on request for added peace of mind during your stay.',
    },
     {
      icon: Phone,
      title: 'Travel Desk & Concierge',
      description: 'Our concierge team is available to assist with your needs and reservations throughout your stay.',
    },
    {
      icon: Bed,
      title: 'Driver Accommodation',
      description: 'Rest for you and your driver—our driver accommodation offers a place to unwind between journeys.',
    },
 {
      icon: Utensils,
      title: 'In-House Restaurant',
      description: 'Enjoy delicious meals at our in-house restaurant, serving a variety of local and international cuisines.',
    },

    {
      icon: Heart,
      title: 'Warm Hospitality',
      description: 'Personalized service from our dedicated team',
    },
    {
      icon: Shield,
      title: 'Nearby Police Station',
      description: 'A police station nearby for added peace of mind',
    },
    {
      icon: Coffee,
      title: 'Dining Experience',
      description: 'Authentic hill-station cuisine with local flavors',
    },
    {
      icon: Clock,
      title: '24/7 Room Service',
      description: 'Room service available around the clock for your comfort',
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
      name: 'Gajendra babu',
      location: 'Chennai',
      rating: 5,
      text: 'We stayed in Hotel apple valley through happy holidays.Xcellent customer service,strong hospitality,good restaurant with humble service. Nice gardening serving food for birds and i can sparrows after a long time. Car parking also available. Worth for money. All together good hotel to stay in kodaikanal town',
    },
    {
      name: 'Passion4vacations',
      location: 'Bangalore',
      rating: 4,
      text: 'We really liked the ambience of the hotel...nice place to stay in kodaikanal with great hotel staff, good service. It has free Wifi, a water dispenser (so no electric kettle). Washrooms are in good condition. Well worth the price.',
    },
    {
      name: 'Sankey',
      location: 'malaysia',
      rating: 5,
      text: 'Apple Valley resort was really a class hotel, the hotel room were spacious, hotel interior was good. Even the hotel staff was friendly. Hotel is at the centre of the city Kodaikanal. The lake is just walking distance from the hotel.',
    },
    {
      name: 'Floor v Kempen',
      location: 'The Hague, The Netherlands',
      rating: 4,
      text: 'We had a perfect stay at the Apple Valley. The super deluxe room was nice and clean with a great view of the mountains. The bed was really comfortable and there is good wifi and a hot shower.The staff was extremely friendly and helpfull. They remembered my friends birthday and even decorated the room. We would definitely stay at this hotel again!.',
    },
    {
      name: 'Rahul Gambhwa',
      location: 'Delhi',
      rating: 5,
      text: 'We stayed here for 2 nights, hotel location is close to market. Rooms are bigger, comfortable and clean. If you are in group there is good sitting area. A person in front office Mr. Sam help us during check-in & check out very gently For dinner they took extra care the prepares excellent food at all time Mr. Nambhu working as F&B attendant is very polite and humble person always available in service.Overall we had wonderful experience.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="resort-hero relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <Image
              key={slide}
              src={slide}
              alt="Apple Valley Kodaikanal resort"
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${
                index === heroSlideIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:min-h-[calc(90vh-112px)] lg:flex lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="hero-eyebrow mb-4 bg-walnut-600/90 text-white border-0">
              Premium Hill Station Resort
            </Badge>
            <h1 className="hero-title font-heading text-4xl sm:text-5xl lg:text-7xl font-medium text-forest-950 dark:text-white mb-6 leading-tight [text-shadow:0_2px_8px_rgb(0_0_0_/_60%)]">
              <span className="hero-line">Escape to the</span>
              <span className="hero-line hero-line-delay">Misty Hills of <em className="text-walnut-700 dark:text-walnut-300">Kodaikanal</em></span>
            </h1>
            <p className="hero-description text-lg sm:text-xl text-forest-800 dark:text-white/90 mb-8 leading-relaxed [text-shadow:0_1px_4px_rgb(0_0_0_/_80%)]">
              Book your perfect stay with lake views, cozy rooms, and peaceful hill-station comfort.
            </p>
            <div className="hero-actions flex flex-wrap gap-4">
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

        </div>
      </section>

      {/* Featured Rooms */}
      <section id="rooms" className="particle-scene rooms-neu-scene py-20 scroll-mt-24">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Accommodations</Badge>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl font-medium text-forest-800 dark:text-white mb-4">
              Featured Rooms & Suites
            </motion.h2>
            <p className="text-lg text-forest-600 dark:text-mist-400 max-w-2xl mx-auto">
              Experience comfort in our handcrafted rooms with misty hill views
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {featuredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="room-card rooms-neu-panel overflow-hidden group transition-all duration-300 h-full">
                  <div className="relative h-64">
                    <RoomSlideshow images={roomImages[room.id]} name={room.name} />
                    <Badge className="absolute top-4 left-4 bg-walnut-600 text-white">
                      {room.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-6 sm:p-7">
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
                          className="rooms-neu-chip text-xs px-2.5 py-1 rounded-full"
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
                        <Button variant="outline" size="sm" className="rooms-neu-button">
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
              <Button className="rooms-neu-cta px-7 h-12 rounded-full">
                View All Rooms
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="particle-scene rooms-neu-scene py-20">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="rooms-neu-chip mb-4">Why Choose Us</Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-6">
                Relax, Refresh and Enjoy the Hills
              </h2>
              <p className="text-lg text-forest-600 dark:text-mist-400 mb-8">
                Nestled in the misty hills of Kodaikanal, Apple Valley offers an unforgettable experience with premium accommodations, stunning views, and warm hospitality that makes every stay special.<br></br>Where misty mornings awaken your soul,
every breathtaking view feels like a dream.
Where luxury embraces the magic of Kodaikanal—
Apple Valley, a stay that lives in your heart forever.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rooms-neu-panel flex gap-3 p-5"
                  >
                    <div className="rooms-neu-chip w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
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
              className="rooms-neu-panel relative p-3 mb-6"
            >
              <Image
                src={whyChooseImage}
                alt="Apple Valley"
                loading="lazy"
                width={whyChooseImage.width}
                height={whyChooseImage.height}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto rounded-2xl"
              />
              <div className="rooms-neu-panel absolute -bottom-6 left-6 p-4 rounded-xl">
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
      <section id="attractions" className="particle-scene rooms-neu-scene py-20 scroll-mt-24">
        <BackgroundParticles />
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rooms-neu-panel neu-attraction-card group relative aspect-[4/5] overflow-hidden"
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
                <Image
                  fill
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
                  sizes="(max-width: 768px) 50vw, 25vw"
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
      <section id="packages" className="particle-scene rooms-neu-scene py-20 scroll-mt-24">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="rooms-neu-chip mb-4">Special Offers</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-4">
              Exclusive Packages
            </h2>
            <p className="text-lg text-forest-600 dark:text-mist-400 max-w-2xl mx-auto">
              Curated experiences for every type of traveler
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="room-card rooms-neu-panel h-full overflow-hidden transition-all duration-300">
                  <div className="relative h-48">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="rooms-neu-chip absolute top-4 right-4 px-3 py-1">
                      Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-forest-800 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="rooms-neu-chip inline-flex items-center gap-2 text-sm mb-5 rounded-full px-3 py-2">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.nights} Nights</span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <span className="text-sm text-forest-500 dark:text-mist-500 line-through">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                        <div className="text-2xl font-bold text-forest-800 dark:text-white">
                          ₹{pkg.price.toLocaleString()}
                        </div>
                      </div>
                      <Link href={`/packages/${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button className="rooms-neu-button">
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
              <Button variant="outline" className="rooms-neu-cta px-7 h-12">
                View All Packages
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="dining" className="particle-scene rooms-neu-scene py-20 scroll-mt-24">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="rooms-neu-panel overflow-hidden p-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-2xl">
                <RoomSlideshow images={restaurantImages} name="Apple Valley in-house restaurant" />
              </div>
              <CardContent className="p-6 sm:p-8">
                <Badge className="rooms-neu-chip mb-4">Dining &amp; Add-ons</Badge>
                <h2 className="font-heading text-3xl sm:text-4xl text-forest-800 dark:text-white mb-4">Good Food, Special Moments</h2>
                <p className="text-forest-600 dark:text-mist-300 mb-6">Enjoy our in-house restaurant, candlelight dinners, and BBQ experiences. Add a campfire evening or celebration decorations to make your stay special.</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['In-House Restaurant', 'Candlelight Dinner', 'BBQ', 'Campfire', '24/7 Room Service'].map((label) => (
                    <span key={label} className="rooms-neu-chip text-sm rounded-full px-3 py-2">{label}</span>
                  ))}
                </div>
                <Link href="/dining"><Button className="rooms-neu-button">View Dining &amp; Add-ons<ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="particle-scene rooms-neu-scene py-20 scroll-mt-24">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="rooms-neu-chip mb-4">Guest Reviews</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-800 dark:text-white mb-4">
              What Our Guests Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rooms-neu-panel neu-review-card h-full">
                  <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                    <div className="rooms-neu-chip self-start rounded-full px-3 py-2 flex gap-1 mb-5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-walnut-400 text-walnut-400" />
                      ))}
                    </div>
                    <p className="text-forest-700 dark:text-mist-300 mb-6 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="mt-auto">
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
      <section id="contact" className="particle-scene rooms-neu-scene py-20 scroll-mt-24">
        <BackgroundParticles />
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
              <div className="rooms-neu-panel p-6 space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-walnut-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-forest-800 dark:text-white">Anna Salai, Opposite the Police Station</p>
                    <p className="text-forest-600 dark:text-mist-400">Municipal Colony, Kodaikanal, Tamil Nadu 624101</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-walnut-600 shrink-0" />
                  <a href="tel:+919488401385" className="text-forest-700 dark:text-mist-300 hover:text-forest-900 dark:hover:text-white">
                    +91 9488401385
                  </a>
                </div>
              </div>
              <Link href="/contact">
                <Button className="rooms-neu-button">
                  Get Directions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rooms-neu-panel p-3 overflow-hidden self-start"
            >
              <iframe
                className="rounded-2xl"
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
              href="https://wa.me/+919488401385?text=Hi,%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Apple%20Valley"
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
