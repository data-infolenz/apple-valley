import restaurant from '@/components/public/src/img/in house restaurant.png';
import restaurant2 from '@/components/public/src/img/in house restaurant1.png';

const galleryPhoto = (file: string, title: string, category: string) => ({
  src: `/src/gallery/${encodeURIComponent(file)}`,
  title,
  category,
});

const photoSeries = (prefix: string, numbers: number[], extension: string, title: string, category: string) =>
  numbers.map((number) => galleryPhoto(`${prefix} (${number}).${extension}`, `${title} ${number}`, category));

const range = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

export const galleryImages = [
  { src: '/landing%20page/front.png', title: 'Welcome to Apple Valley', category: 'Property' },
  { src: '/landing%20page/reception.png', title: 'Reception', category: 'Property' },
  { src: '/landing%20page/waiting%20area.png', title: 'Waiting area', category: 'Property' },
  { src: '/src/deluxe/7%20(1).png', title: 'Deluxe room', category: 'Rooms' },
  { src: '/src/deluxe/7%20(2).jpg', title: 'Deluxe room interior', category: 'Rooms' },
  { src: '/src/super%20delux/11%20(1).png', title: 'Super Deluxe room', category: 'Rooms' },
  { src: '/src/triple%20deluxe/3.png', title: 'Triple Deluxe room', category: 'Rooms' },
  { src: '/src/honeymoon/10%20(1).png', title: 'Honeymoon Suite', category: 'Rooms' },
  { src: '/src/honeymoon/10%20(2).png', title: 'Honeymoon Suite interior', category: 'Rooms' },
  { src: restaurant.src, title: 'In-house restaurant', category: 'Dining' },
  { src: restaurant2.src, title: 'Another view of our restaurant', category: 'Dining' },
  galleryPhoto('Apple-Valley-Restaurant-Cinematic.jpg', 'Restaurant cinematic view', 'Dining'),
  galleryPhoto('in house restaurant.png', 'Restaurant interior', 'Dining'),
  galleryPhoto('in house restaurant1.png', 'Restaurant seating', 'Dining'),
  galleryPhoto('in house restaurant (2).png', 'Another restaurant view', 'Dining'),
  ...photoSeries('honeymoonsuite', range(24).filter((number) => number !== 6 && number !== 7), 'jpeg', 'Honeymoon Suite view', 'Honeymoon Suite'),
  ...photoSeries('birthday', range(2), 'jpeg', 'Birthday celebration', 'Celebrations'),
  ...photoSeries('art ', range(3), 'jpg', 'Artwork', 'Artwork'),
  ...photoSeries('bookself', range(4), 'jpg', 'Bookshelf', 'Bookshelves'),
  ...photoSeries('corrdor2', range(4), 'jpg', 'Corridor', 'Corridors'),
  ...photoSeries('kitchan', range(7), 'jpg', 'Kitchen view', 'Kitchen'),
  ...photoSeries('Outsite', range(7), 'jpg', 'Property exterior', 'Exterior'),
  ...photoSeries('parking area', range(4), 'jpeg', 'Parking area', 'Parking'),
  galleryPhoto('playing (1).jpeg', 'Play area overview', 'Play Area'),
  ...photoSeries('playing', range(2), 'jpg', 'Play area', 'Play Area'),
  ...photoSeries('reception', range(9), 'jpg', 'Reception view', 'Reception'),
  ...photoSeries('seting area', range(7), 'jpg', 'Seating area', 'Seating Areas'),
];

export const galleryCategories = ['All', ...Array.from(new Set(galleryImages.map((photo) => photo.category)))];
