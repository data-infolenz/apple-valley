import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RoomType from '@/models/RoomType';
import Room from '@/models/Room';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const query = activeOnly ? { isActive: true } : {};

    const roomTypes = await RoomType.find(query).sort({ order: 1 }).lean();

    // For each room type, get available rooms count
    const roomTypesWithAvailability = await Promise.all(
      roomTypes.map(async (rt) => {
        const totalRooms = await Room.countDocuments({
          roomTypeId: rt._id,
          isActive: true,
        });
        const availableRooms = await Room.countDocuments({
          roomTypeId: rt._id,
          isActive: true,
          status: 'available',
        });
        return {
          ...rt,
          totalRooms,
          availableRooms,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: roomTypesWithAvailability,
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
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      images,
      amenities,
      basePrice,
      maxOccupancy,
      bedType,
      size,
      featured,
    } = body;

    if (!name || !slug || !basePrice) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, and base price are required' },
        { status: 400 }
      );
    }

    const existingRoomType = await RoomType.findOne({ slug });
    if (existingRoomType) {
      return NextResponse.json(
        { success: false, error: 'Room type with this slug already exists' },
        { status: 400 }
      );
    }

    const roomType = await RoomType.create({
      name,
      slug,
      description: description || '',
      shortDescription: shortDescription || '',
      images: images || [],
      amenities: amenities || [],
      basePrice,
      maxOccupancy: maxOccupancy || 2,
      bedType: bedType || 'King',
      size: size || 200,
      featured: featured || false,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: roomType,
      message: 'Room type created successfully',
    });
  } catch (error) {
    console.error('Create room type error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
