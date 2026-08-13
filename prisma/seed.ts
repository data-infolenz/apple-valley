import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import path from "path";
import { encodeJsonField } from "../lib/json-fields";
import { ADDONS_DATA, DEFAULT_AMENITIES, PACKAGES_DATA, ROOM_CATEGORIES } from "../lib/constants";

function getMariaDbConfig() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);

  return {
    host: databaseUrl.hostname,
    port: databaseUrl.port ? Number(databaseUrl.port) : 3306,
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.replace(/^\//, ""),
    connectionLimit: 5,
  };
}

const adapter = new PrismaMariaDb(getMariaDbConfig());
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function roomNumbersFor(slug: string) {
  const numbers: Record<string, string[]> = {
    "standard-kodai-comfort": ["101", "102", "103", "104", "105", "106"],
    "deluxe-kodai-valley": ["201", "202", "203", "204", "205", "206", "207", "208"],
    "premium-mist-balcony": ["301", "302", "303", "304", "305", "306"],
    "tamil-nadu-family-cottage": ["401", "402", "403", "404"],
    "kurinji-honeymoon-suite": ["501", "502", "503"],
  };

  return numbers[slug] || [];
}

async function seedHotelData() {
  const desiredRoomNumbers = new Set(ROOM_CATEGORIES.flatMap((roomType) => roomNumbersFor(roomType.id)));

  for (const [index, roomType] of ROOM_CATEGORIES.entries()) {
    const savedRoomType = await prisma.roomType.upsert({
      where: { slug: roomType.id },
      update: {
        name: roomType.name,
        description: roomType.description,
        shortDescription: roomType.description,
        basePrice: roomType.basePrice,
        maxOccupancy: roomType.maxOccupancy,
        bedType: roomType.bedType,
        size: roomType.size,
        featured: index < 3,
        isActive: true,
        order: index + 1,
        amenities: encodeJsonField(DEFAULT_AMENITIES),
      },
      create: {
        slug: roomType.id,
        name: roomType.name,
        description: roomType.description,
        shortDescription: roomType.description,
        images: encodeJsonField([]),
        amenities: encodeJsonField(DEFAULT_AMENITIES),
        basePrice: roomType.basePrice,
        maxOccupancy: roomType.maxOccupancy,
        bedType: roomType.bedType,
        size: roomType.size,
        featured: index < 3,
        isActive: true,
        order: index + 1,
      },
    });

    for (const roomNumber of roomNumbersFor(roomType.id)) {
      await prisma.room.upsert({
        where: { roomNumber },
        update: {
          roomTypeId: savedRoomType.id,
          floor: Number(roomNumber[0]) || 1,
          isActive: true,
        },
        create: {
          roomNumber,
          floor: Number(roomNumber[0]) || 1,
          roomTypeId: savedRoomType.id,
          status: "available",
          isActive: true,
        },
      });
    }
  }

  await prisma.room.deleteMany({
    where: {
      roomNumber: {
        notIn: Array.from(desiredRoomNumbers),
      },
    },
  });

  for (const [index, addOn] of ADDONS_DATA.entries()) {
    await prisma.addOn.upsert({
      where: { slug: slugify(addOn.name) },
      update: {
        name: addOn.name,
        description: addOn.name,
        category: addOn.category,
        price: addOn.price,
        pricingUnit: "unit" in addOn && addOn.unit ? addOn.unit : "per_booking",
        available: true,
        order: index + 1,
      },
      create: {
        slug: slugify(addOn.name),
        name: addOn.name,
        description: addOn.name,
        category: addOn.category,
        price: addOn.price,
        pricingUnit: "unit" in addOn && addOn.unit ? addOn.unit : "per_booking",
        available: true,
        order: index + 1,
      },
    });
  }

  for (const pkg of PACKAGES_DATA) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        description: pkg.description,
        shortDescription: pkg.shortDescription,
        nights: pkg.nights,
        inclusions: encodeJsonField(pkg.inclusions),
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        maxOccupancy: pkg.maxOccupancy,
        featured: pkg.featured,
        isActive: true,
      },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        description: pkg.description,
        shortDescription: pkg.shortDescription,
        image: "",
        gallery: encodeJsonField([]),
        nights: pkg.nights,
        inclusions: encodeJsonField(pkg.inclusions),
        addOns: encodeJsonField([]),
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        maxOccupancy: pkg.maxOccupancy,
        featured: pkg.featured,
        isActive: true,
      },
    });
  }
}

async function seedExistingBookings() {
  const bookingFile = path.join(process.cwd(), "data", "local-bookings.json");
  let bookings: Array<Record<string, any>> = [];

  try {
    bookings = JSON.parse(await readFile(bookingFile, "utf8"));
  } catch {
    bookings = [];
  }

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { bookingId: booking.bookingId },
      update: {
        guestSnapshot: encodeJsonField(booking.guestSnapshot || {}),
        rooms: encodeJsonField(booking.rooms || []),
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        adults: Number(booking.adults || 1),
        children: Number(booking.children || 0),
        nights: Number(booking.nights || 1),
        packageId: booking.packageId,
        addOns: encodeJsonField(booking.addOns || []),
        baseAmount: Number(booking.baseAmount || 0),
        addOnAmount: Number(booking.addOnAmount || 0),
        taxAmount: Number(booking.taxAmount || 0),
        discountAmount: Number(booking.discountAmount || 0),
        totalAmount: Number(booking.totalAmount || 0),
        paymentStatus: booking.paymentStatus || "pending",
        bookingStatus: booking.bookingStatus || "pending",
        source: booking.source || "website",
        specialRequests: booking.specialRequests,
        couponCode: booking.couponCode,
        confirmedAt: booking.confirmedAt ? new Date(booking.confirmedAt) : null,
        checkedInAt: booking.checkedInAt ? new Date(booking.checkedInAt) : null,
        checkedOutAt: booking.checkedOutAt ? new Date(booking.checkedOutAt) : null,
        cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : null,
        cancellationReason: booking.cancellationReason,
        createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date(),
      },
      create: {
        bookingId: booking.bookingId,
        guestSnapshot: encodeJsonField(booking.guestSnapshot || {}),
        rooms: encodeJsonField(booking.rooms || []),
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        adults: Number(booking.adults || 1),
        children: Number(booking.children || 0),
        nights: Number(booking.nights || 1),
        packageId: booking.packageId,
        addOns: encodeJsonField(booking.addOns || []),
        baseAmount: Number(booking.baseAmount || 0),
        addOnAmount: Number(booking.addOnAmount || 0),
        taxAmount: Number(booking.taxAmount || 0),
        discountAmount: Number(booking.discountAmount || 0),
        totalAmount: Number(booking.totalAmount || 0),
        paymentStatus: booking.paymentStatus || "pending",
        bookingStatus: booking.bookingStatus || "pending",
        source: booking.source || "website",
        specialRequests: booking.specialRequests,
        couponCode: booking.couponCode,
        confirmedAt: booking.confirmedAt ? new Date(booking.confirmedAt) : null,
        checkedInAt: booking.checkedInAt ? new Date(booking.checkedInAt) : null,
        checkedOutAt: booking.checkedOutAt ? new Date(booking.checkedOutAt) : null,
        cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : null,
        cancellationReason: booking.cancellationReason,
        createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date(),
      },
    });
  }
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@applevalley.com";
  const name = process.env.ADMIN_NAME || "Admin User";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD must be set before seeding production");
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD is not set. Using local development password: admin123");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
    create: {
      email,
      name,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  });

  console.log(`Seeded admin user: ${admin.email}`);
  await seedHotelData();
  await seedExistingBookings();
  console.log("Seeded room types, rooms, add-ons, packages, and existing bookings");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
