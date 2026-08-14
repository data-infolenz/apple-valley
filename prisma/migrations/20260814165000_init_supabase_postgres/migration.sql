-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roomtype" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "images" TEXT,
    "amenities" TEXT,
    "basePrice" INTEGER NOT NULL,
    "maxOccupancy" INTEGER NOT NULL,
    "bedType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roomtype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roomTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "pricingUnit" TEXT NOT NULL DEFAULT 'per_booking',
    "image" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "image" TEXT,
    "gallery" TEXT,
    "roomTypeSlug" TEXT,
    "nights" INTEGER NOT NULL,
    "inclusions" TEXT NOT NULL,
    "mealPlan" TEXT NOT NULL DEFAULT 'Room only',
    "hasTransport" BOOLEAN NOT NULL DEFAULT false,
    "transportDetails" TEXT,
    "addOns" TEXT,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "maxOccupancy" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "guestSnapshot" TEXT NOT NULL,
    "rooms" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "nights" INTEGER NOT NULL,
    "packageId" TEXT,
    "addOns" TEXT NOT NULL,
    "baseAmount" INTEGER NOT NULL,
    "addOnAmount" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "bookingStatus" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'website',
    "specialRequests" TEXT,
    "couponCode" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "documentName" TEXT,
    "documentType" TEXT,
    "documentUrl" TEXT,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pincodelocation" (
    "id" SERIAL NOT NULL,
    "pincode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pincodelocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthlyreport" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthlyreport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_slug_key" ON "roomtype"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "room"("roomNumber");

-- CreateIndex
CREATE INDEX "Room_roomTypeId_idx" ON "room"("roomTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "AddOn_slug_key" ON "addon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "package"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingId_key" ON "booking"("bookingId");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_idx" ON "booking"("bookingStatus");

-- CreateIndex
CREATE INDEX "Booking_checkIn_idx" ON "booking"("checkIn");

-- CreateIndex
CREATE INDEX "Booking_checkOut_idx" ON "booking"("checkOut");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "booking"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "booking"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_bookingId_idx" ON "order"("bookingId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "PincodeLocation_district_idx" ON "pincodelocation"("district");

-- CreateIndex
CREATE INDEX "PincodeLocation_pincode_idx" ON "pincodelocation"("pincode");

-- CreateIndex
CREATE INDEX "PincodeLocation_state_idx" ON "pincodelocation"("state");

-- CreateIndex
CREATE UNIQUE INDEX "PincodeLocation_pincode_city_district_state_key" ON "pincodelocation"("pincode", "city", "district", "state");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReport_month_year_key" ON "monthlyreport"("month", "year");

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "Room_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "roomtype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "Order_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
