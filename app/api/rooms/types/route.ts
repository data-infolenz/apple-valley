import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decodeJsonField, encodeJsonField } from '@/lib/json-fields';

function serializeRoomType(roomType: {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  images: unknown;
  amenities: unknown;
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  size: number;
  featured: boolean;
  isActive: boolean;
  order: number;
  rooms?: Array<{ status: string; isActive: boolean }>;
}) {
  const totalRooms = roomType.rooms?.filter((room) => room.isActive).length || 0;
  const availableRooms = roomType.rooms?.filter((room) => room.isActive && room.status === 'available').length || 0;

  return {
    _id: roomType.slug,
    id: roomType.slug,
    slug: roomType.slug,
    name: roomType.name,
    description: roomType.description,
    shortDescription: roomType.shortDescription,
    images: decodeJsonField(roomType.images, []),
    amenities: decodeJsonField(roomType.amenities, []),
    basePrice: roomType.basePrice,
    maxOccupancy: roomType.maxOccupancy,
    bedType: roomType.bedType,
    size: roomType.size,
    featured: roomType.featured,
    isActive: roomType.isActive,
    order: roomType.order,
    totalRooms,
    availableRooms,
  };
}

type SerializedRoomTypeInput = Parameters<typeof serializeRoomType>[0];

function clampAvailability(totalRooms: number, availableRooms: number) {
  const total = Math.max(0, Math.floor(Number.isFinite(totalRooms) ? totalRooms : 0));
  const available = Math.min(total, Math.max(0, Math.floor(Number.isFinite(availableRooms) ? availableRooms : total)));

  return { total, available };
}

function buildRoomNumber(slug: string, index: number, usedRoomNumbers: Set<string>) {
  const prefix = slug
    .split('-')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase() || 'RM';
  let roomNumber = `${prefix}${String(index).padStart(2, '0')}`;
  let suffix = index;

  while (usedRoomNumbers.has(roomNumber)) {
    suffix += 1;
    roomNumber = `${prefix}${String(suffix).padStart(2, '0')}`;
  }

  usedRoomNumbers.add(roomNumber);
  return roomNumber;
}

async function syncRoomAvailability(roomTypeId: number, slug: string, totalRoomsValue: unknown, availableRoomsValue: unknown) {
  if (totalRoomsValue === undefined && availableRoomsValue === undefined) return;

  const currentRooms = await prisma.room.findMany({
    where: { roomTypeId },
    orderBy: [{ id: 'asc' }],
  });
  const fallbackTotal = currentRooms.filter((room) => room.isActive).length;
  const fallbackAvailable = currentRooms.filter((room) => room.isActive && room.status === 'available').length;
  const { total, available } = clampAvailability(
    Number(totalRoomsValue ?? fallbackTotal),
    Number(availableRoomsValue ?? fallbackAvailable)
  );
  const usedRoomNumbers = new Set((await prisma.room.findMany({
    where: { roomTypeId: { not: roomTypeId } },
    select: { roomNumber: true },
  })).map((room) => room.roomNumber));
  const existingRoomNumbers = new Set(currentRooms.map((room) => room.roomNumber));
  existingRoomNumbers.forEach((roomNumber) => usedRoomNumbers.add(roomNumber));
  let rooms = [...currentRooms];

  for (let index = rooms.length + 1; index <= total; index += 1) {
    const room = await prisma.room.create({
      data: {
        roomNumber: buildRoomNumber(slug, index, usedRoomNumbers),
        floor: Math.ceil(index / 10),
        roomTypeId,
        status: 'available',
        isActive: true,
      },
    });
    rooms.push(room);
  }

  await Promise.all(rooms.map((room, index) => prisma.room.update({
    where: { id: room.id },
    data: {
      isActive: index < total,
      status: index < total && index < available ? 'available' : 'occupied',
    },
  })));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const roomTypes: SerializedRoomTypeInput[] = await prisma.roomType.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: { rooms: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: roomTypes.map(serializeRoomType),
    });
  } catch (error) {
    console.error('Get room types error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const slug = String(body.slug || body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    if (!slug || !body.name || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, and base price are required' },
        { status: 400 }
      );
    }

    const roomType = await prisma.roomType.upsert({
      where: { slug },
      update: {
        name: body.name,
        description: body.description || body.name,
        shortDescription: body.shortDescription || body.description || body.name,
        images: encodeJsonField(body.images || []),
        amenities: encodeJsonField(body.amenities || []),
        basePrice: Number(body.basePrice),
        maxOccupancy: Number(body.maxOccupancy || 2),
        bedType: body.bedType || 'Queen',
        size: Number(body.size || 200),
        featured: Boolean(body.featured),
        isActive: body.isActive ?? true,
        order: Number(body.order || 0),
      },
      create: {
        slug,
        name: body.name,
        description: body.description || body.name,
        shortDescription: body.shortDescription || body.description || body.name,
        images: encodeJsonField(body.images || []),
        amenities: encodeJsonField(body.amenities || []),
        basePrice: Number(body.basePrice),
        maxOccupancy: Number(body.maxOccupancy || 2),
        bedType: body.bedType || 'Queen',
        size: Number(body.size || 200),
        featured: Boolean(body.featured),
        isActive: body.isActive ?? true,
        order: Number(body.order || 0),
      },
      include: { rooms: true },
    });
    await syncRoomAvailability(roomType.id, roomType.slug, body.totalRooms, body.availableRooms);
    const roomTypeWithRooms = await prisma.roomType.findUnique({
      where: { id: roomType.id },
      include: { rooms: true },
    });

    return NextResponse.json({
      success: true,
      data: serializeRoomType(roomTypeWithRooms || roomType),
      message: 'Room type saved successfully',
    });
  } catch (error) {
    console.error('Save room type error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
