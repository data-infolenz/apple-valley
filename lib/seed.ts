import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Guest from '../models/Guest';
import RoomType from '../models/RoomType';
import Room from '../models/Room';
import Package from '../models/Package';
import Attraction from '../models/Attraction';
import AddOn from '../models/AddOn';
import Coupon from '../models/Coupon';
import Review from '../models/Review';
import HotelSettings from '../models/HotelSettings';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apple-valley';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Guest.deleteMany({}),
      RoomType.deleteMany({}),
      Room.deleteMany({}),
      Package.deleteMany({}),
      Attraction.deleteMany({}),
      AddOn.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      HotelSettings.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      email: 'admin@applevalley.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    });
    console.log('Created admin user');

    // Create Room Types
    const roomTypes = await RoomType.insertMany([
      {
        name: 'Budget Standard Room',
        slug: 'budget-standard',
        description: 'Comfortable and affordable hill-station stay without compromising on essential amenities. Perfect for solo travelers, students, and budget-conscious tourists exploring the beauty of Kodaikanal.',
        shortDescription: 'Affordable comfort with essential amenities',
        images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'],
        amenities: ['Room Heater', 'Hot Water', 'WiFi', 'TV', 'Tea/Coffee Maker', 'Private Bathroom', 'Toiletries'],
        basePrice: 2000,
        maxOccupancy: 2,
        bedType: 'Queen Size',
        size: 180,
        featured: false,
        order: 1,
      },
      {
        name: 'Deluxe Hill View Room',
        slug: 'deluxe-hill-view',
        description: 'Wake up to panoramic views of the misty hills. Our Deluxe Hill View rooms offer a perfect blend of comfort and natural beauty.',
        shortDescription: 'Panoramic misty hill views with modern comfort',
        images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'],
        amenities: ['Hill View', 'Room Heater', 'Hot Water', 'WiFi', 'TV with Cable', 'Tea/Coffee Maker', 'Private Bathroom', 'Toiletries', 'Hair Dryer'],
        basePrice: 3500,
        maxOccupancy: 2,
        bedType: 'King Size',
        size: 280,
        featured: false,
        order: 2,
      },
      {
        name: 'Premium Balcony Room',
        slug: 'premium-balcony',
        description: 'Step out to your private balcony facing the valley. Watch the mist roll in during mornings and enjoy spectacular sunsets.',
        shortDescription: 'Private valley-view balcony with premium amenities',
        images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'],
        amenities: ['Balcony', 'Lake View', 'Mountain View', 'Room Heater', 'Hot Water', 'WiFi', 'TV with Cable', 'Mini Bar', 'Tea/Coffee Maker', 'Seating Area', 'Private Bathroom', 'Hair Dryer'],
        basePrice: 4500,
        maxOccupancy: 2,
        bedType: 'King Size',
        size: 320,
        featured: true,
        order: 3,
      },
      {
        name: 'Family Cottage',
        slug: 'family-cottage',
        description: 'Spacious wooden cottage perfect for families. These standalone cottages feature separate living and sleeping areas, a kitchen, and a private garden.',
        shortDescription: 'Spacious wooden cottage with garden and kitchen',
        images: ['https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg'],
        amenities: ['Mountain View', 'Private Garden', 'Kitchen', 'Living Area', 'Room Heater', 'Hot Water', 'WiFi', 'TV', 'Sofa Bed', 'Private Bathroom', 'Kids-friendly', 'Parking'],
        basePrice: 6000,
        maxOccupancy: 4,
        bedType: '2 Double Beds',
        size: 450,
        featured: true,
        order: 4,
      },
      {
        name: 'Honeymoon Suite',
        slug: 'honeymoon-suite',
        description: 'Begin your forever in the lap of misty hills. Premium suite with rose decorations, private dinners, and lake views.',
        shortDescription: 'Romantic suite with fireplace, lake views, and butler service',
        images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
        amenities: ['Lake View', 'Fireplace', 'Jacuzzi', 'Room Heater', 'Hot Water', 'WiFi', 'TV', 'Mini Bar', 'Butler Service', 'Rose Decoration', 'Chocolate Hamper', 'Work Desk', 'Private Bathroom'],
        basePrice: 7500,
        maxOccupancy: 2,
        bedType: 'King Size',
        size: 400,
        featured: true,
        order: 5,
      },
    ]);
    console.log('Created room types');

    // Create Rooms
    const rooms: unknown[] = [];
    for (let i = 1; i <= 6; i++) {
      rooms.push({
        roomNumber: `10${i}`,
        floor: 1,
        roomTypeId: roomTypes[0]._id,
        status: 'available',
      });
    }
    for (let i = 1; i <= 10; i++) {
      rooms.push({
        roomNumber: `20${i}`,
        floor: 2,
        roomTypeId: roomTypes[1]._id,
        status: 'available',
      });
    }
    for (let i = 1; i <= 8; i++) {
      rooms.push({
        roomNumber: `30${i}`,
        floor: 3,
        roomTypeId: roomTypes[2]._id,
        status: 'available',
      });
    }
    for (let i = 1; i <= 4; i++) {
      rooms.push({
        roomNumber: `C${i}`,
        floor: 1,
        roomTypeId: roomTypes[3]._id,
        status: 'available',
      });
    }
    for (let i = 1; i <= 4; i++) {
      rooms.push({
        roomNumber: `S${i}`,
        floor: 2,
        roomTypeId: roomTypes[4]._id,
        status: 'available',
      });
    }
    await Room.insertMany(rooms);
    console.log('Created rooms');

    // Create Attractions
    const attractions = await Attraction.insertMany([
      {
        name: 'Kodai Lake',
        slug: 'kodai-lake',
        description: 'A star-shaped man-made lake in the heart of Kodaikanal.Perfect for boating, cycling along the promenade, and enjoying sunset views.',
        shortDescription: 'Star-shaped lake, boating, cycling promenade',
        image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
        category: 'nature',
        distance: 0.5,
        visitDuration: '1-2 hours',
        timings: '8:00 AM - 6:00 PM',
        entryFee: 'Boating charges apply',
        bestTimeToVisit: 'Morning and Evening',
        featured: true,
        order: 1,
      },
      {
        name: "Coaker's Walk",
        slug: 'coakers-walk',
        description: 'A 1 km long paved pedestrian path on the edge of a cliff offering breathtaking views.',
        shortDescription: 'Scenic cliff walk, panoramic valley views',
        image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
        category: 'viewpoint',
        distance: 1.2,
        visitDuration: '30 mins - 1 hour',
        timings: '7:00 AM - 7:00 PM',
        bestTimeToVisit: 'Early Morning',
        featured: true,
        order: 2,
      },
      {
        name: 'Pillar Rocks',
        slug: 'pillar-rocks',
        description: 'Three giant rock pillars standing 400 feet tall offering breathtaking views of the valley below.',
        shortDescription: 'Giant rock pillars, valley viewpoint',
        image: 'https://images.pexels.com/photos/2583854/pexels-photo-2583854.jpeg',
        category: 'viewpoint',
        distance: 8.0,
        visitDuration: '30-45 mins',
        timings: '9:00 AM - 5:30 PM',
        bestTimeToVisit: 'Afternoon for best visibility',
        featured: true,
        order: 3,
      },
      {
        name: 'Pine Forest',
        slug: 'pine-forest',
        description: 'A serene forest of tall pine trees perfect for nature walks and photography.',
        shortDescription: 'Tall pine trees, misty walks, photography',
        image: 'https://images.pexels.com/photos/1421903/pexels-photo-1421903.jpeg',
        category: 'nature',
        distance: 5.5,
        visitDuration: '30 mins - 1 hour',
        bestTimeToVisit: 'Morning, especially during monsoon',
        featured: false,
        order: 4,
      },
    ]);
    console.log('Created attractions');

    // Create Add-ons
    const addOns = await AddOn.insertMany([
      { name: 'Candle Light Dinner', slug: 'candle-light-dinner', description: 'Romantic 4-course dinner with wine', category: 'dining', price: 1500, pricingUnit: 'per_booking', order: 1 },
      { name: 'BBQ Dinner', slug: 'bbq-dinner', description: 'Outdoor BBQ experience', category: 'dining', price: 1200, pricingUnit: 'per_booking', order: 2 },
      { name: 'Campfire', slug: 'campfire', description: 'Private campfire session', category: 'celebration', price: 500, pricingUnit: 'per_booking', order: 3 },
      { name: 'Birthday Cake', slug: 'birthday-cake', description: 'Fresh designer cake', category: 'celebration', price: 800, pricingUnit: 'per_booking', order: 4 },
      { name: 'Flower Decoration', slug: 'flower-decoration', description: 'Fresh flower arrangement', category: 'celebration', price: 1000, pricingUnit: 'per_booking', order: 5 },
      { name: 'Room Heater', slug: 'room-heater', description: 'Essential during winter months', category: 'comfort', price: 300, pricingUnit: 'per_night', order: 6 },
      { name: 'Extra Blanket', slug: 'extra-blanket', description: 'Additional warm blankets', category: 'comfort', price: 150, pricingUnit: 'per_night', order: 7 },
      { name: 'Extra Bed', slug: 'extra-bed', description: 'Folding bed for additional guest', category: 'comfort', price: 500, pricingUnit: 'per_night', order: 8 },
      { name: 'Half Day Sightseeing Cab', slug: 'half-day-cab', description: '4 hours local sightseeing', category: 'transport', price: 1500, pricingUnit: 'per_booking', order: 9 },
      { name: 'Full Day Sightseeing Cab', slug: 'full-day-cab', description: '8 hours full day tour', category: 'transport', price: 2500, pricingUnit: 'per_booking', order: 10 },
    ]);
    console.log('Created add-ons');

    // Create Packages
    await Package.insertMany([
      {
        name: 'Couple Misty Stay Package',
        slug: 'couple-misty-stay',
        description: 'A romantic 2-night escape designed for couples.',
        shortDescription: 'Romantic 2-night stay with dinner and decorations',
        image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
        roomTypeId: roomTypes[2]._id,
        nights: 2,
        inclusions: [
          { name: 'Premium Balcony Room' },
          { name: 'Daily Breakfast' },
          { name: 'Candle Light Dinner once' },
          { name: 'Flower Decoration' },
          { name: 'Campfire Evening' },
          { name: 'Welcome Drink on Arrival' },
        ],
        mealPlan: 'Breakfast + 1 Dinner',
        hasTransport: false,
        price: 8999,
        originalPrice: 12000,
        maxOccupancy: 2,
        featured: true,
        validFrom: new Date(),
        validTo: new Date('2025-12-31'),
      },
      {
        name: 'Family Vacation Package',
        slug: 'family-vacation',
        description: 'Perfect family getaway with spacious cottage accommodation.',
        shortDescription: '3-night family stay with cottage and sightseeing',
        image: 'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg',
        roomTypeId: roomTypes[3]._id,
        nights: 3,
        inclusions: [
          { name: 'Family Cottage' },
          { name: 'Daily Breakfast and Dinner' },
          { name: 'Full Day Sightseeing Cab' },
          { name: 'BBQ Evening' },
          { name: 'Campfire Session' },
          { name: 'Kids Activity Kit' },
        ],
        mealPlan: 'Breakfast & Dinner',
        hasTransport: true,
        transportDetails: 'Full day sightseeing cab included',
        price: 19999,
        originalPrice: 25000,
        maxOccupancy: 4,
        featured: true,
        validFrom: new Date(),
        validTo: new Date('2025-12-31'),
      },
    ]);
    console.log('Created packages');

    // Create Coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: '10% off on first booking',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 1000,
        validFrom: new Date(),
        validTo: new Date('2025-12-31'),
        isActive: true,
      },
      {
        code: 'SAVE500',
        description: 'Flat ₹500 off',
        discountType: 'fixed',
        discountValue: 500,
        minOrderValue: 5000,
        validFrom: new Date(),
        validTo: new Date('2025-12-31'),
        isActive: true,
      },
    ]);
    console.log('Created coupons');

    // Create Reviews
    const reviews = [
      { guestName: 'Priya Sharma', rating: 5, content: 'The misty hills view from our balcony was magical. Staff was incredibly helpful. Perfect getaway!', source: 'website', featured: true },
      { guestName: 'Rahul Menon', rating: 5, content: 'Family cottage was spacious and cozy. Kids loved the campfire. Will definitely return.', source: 'website', featured: true },
      { guestName: 'Anjali Krishnan', rating: 5, content: 'Honeymoon suite exceeded expectations. Candle light dinner was romantic. Highly recommend!', source: 'website', featured: true },
      { guestName: 'Vikram Singh', rating: 4, content: 'Great location near Kodai Lake. Room heater was essential during winter. Good value for money.', source: 'google', featured: false },
      { guestName: 'Meena Patel', rating: 5, content: 'Best hill station hotel we have stayed at. The staff went above and beyond to make our trip special.', source: 'tripadvisor', featured: true },
    ];
    await Review.insertMany(reviews);
    console.log('Created reviews');

    // Create Hotel Settings
    await HotelSettings.create({
      hotelName: 'Apple Valley',
      tagline: 'Stay Above the Clouds',
      address: 'Anna Salai, Opposite the Police Station, Municipal Colony, Kodaikanal, Tamil Nadu, 624101',
      city: 'Kodaikanal',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '624101',
      phone: '+91 93619 79918',
      email: 'info@applevalley.com',
      whatsappNumber: '+91 93619 79918',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      socialLinks: {
        facebook: 'https://facebook.com/applevalley',
        instagram: 'https://instagram.com/applevalley',
        twitter: 'https://twitter.com/applevalley',
      },
    });
    console.log('Created hotel settings');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
