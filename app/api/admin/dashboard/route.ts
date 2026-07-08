import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import Booking from '@/models/Booking';
import Room from '@/models/Room';
import RoomType from '@/models/RoomType';
import Package from '@/models/Package';
import { getLocalBookings, LocalBooking } from '@/lib/local-booking-store';

type AddOnAggregate = {
  _id: string;
  sold: number;
  revenue: number;
};

type DashboardRoomSnapshot = {
  roomTypeName?: string;
  roomNumber?: string;
};

function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) return false;
  return [
    'ECONNREFUSED',
    'ServerSelection',
    'MongoNetwork',
    'MONGODB_URI',
    'bufferCommands',
    'querySrv',
  ].some((message) => error.message.includes(message));
}

function buildDashboardResponse(allBookings: LocalBooking[]) {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const recentBookings = allBookings.slice(0, 5);
  const monthlyRevenue = allBookings
    .filter((booking) => {
      const createdAt = new Date(booking.createdAt);
      return createdAt >= monthStart && createdAt < nextMonthStart;
    })
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const todayActivities = allBookings
    .flatMap((booking) => {
      const room = booking.rooms
        .map((item: DashboardRoomSnapshot) => item.roomNumber)
        .filter(Boolean)
        .join(', ') || booking.rooms[0]?.roomTypeName || '-';
      const activities: Array<{ time: string; activity: string; guest: string; room: string }> = [];
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      if (checkIn >= todayStart && checkIn <= todayEnd) {
        activities.push({
          time: '02:00 PM',
          activity: 'Check-in',
          guest: booking.guestSnapshot.name,
          room,
        });
      }

      if (checkOut >= todayStart && checkOut <= todayEnd) {
        activities.push({
          time: '11:00 AM',
          activity: 'Check-out',
          guest: booking.guestSnapshot.name,
          room,
        });
      }

      return activities;
    })
    .slice(0, 5);

  const addOnSales = allBookings
    .flatMap((booking) => booking.addOns)
    .reduce<Record<string, { name: string; sold: number; revenue: number }>>((items, addOn) => {
      const current = items[addOn.name] || { name: addOn.name, sold: 0, revenue: 0 };
      current.sold += addOn.quantity;
      current.revenue += addOn.price * addOn.quantity;
      items[addOn.name] = current;
      return items;
    }, {});

  const pendingPayments = allBookings.filter((booking) => booking.paymentStatus === 'pending');

  return NextResponse.json({
    success: true,
    data: {
      bookings: {
        all: allBookings,
        recent: recentBookings,
      },
      stats: {
        totalBookings: allBookings.length,
        todayCheckIns: todayActivities.filter((activity) => activity.activity === 'Check-in').length,
        monthlyRevenue,
        occupancyRate: 0,
        availableRooms: 0,
      },
      roomAvailability: [],
      todayActivities,
      topPackages: [],
      addOnSales: Object.values(addOnSales).sort((a, b) => b.revenue - a.revenue).slice(0, 4),
      pendingPayments: {
        count: pendingPayments.length,
        total: pendingPayments.reduce((sum, booking) => sum + booking.totalAmount, 0),
      },
    },
  });
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [
      allBookings,
      recentBookings,
      monthlyRevenue,
      roomTypes,
      packages,
      addOnSales,
      pendingPayments,
    ] = await Promise.all([
      Booking.find({}).sort({ createdAt: -1 }).limit(1000).lean(),
      Booking.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Booking.aggregate([
        { $match: { createdAt: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      RoomType.find({ isActive: true }).sort({ order: 1 }).lean(),
      Package.find({ isActive: true }).sort({ featured: -1, createdAt: -1 }).limit(3).lean(),
      Booking.aggregate<AddOnAggregate>([
        { $unwind: '$addOns' },
        {
          $group: {
            _id: '$addOns.name',
            sold: { $sum: '$addOns.quantity' },
            revenue: {
              $sum: { $multiply: ['$addOns.price', '$addOns.quantity'] },
            },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 4 },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'pending' } },
        { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const roomAvailability = await Promise.all(
      roomTypes.map(async (roomType) => {
        const [total, available] = await Promise.all([
          Room.countDocuments({ roomTypeId: roomType._id, isActive: true }),
          Room.countDocuments({ roomTypeId: roomType._id, isActive: true, status: 'available' }),
        ]);

        return {
          type: roomType.name,
          total,
          available,
        };
      })
    );

    const todayActivities = allBookings
      .flatMap((booking) => {
        const room = booking.rooms
          .map((item: DashboardRoomSnapshot) => item.roomNumber)
          .filter(Boolean)
          .join(', ') || booking.rooms[0]?.roomTypeName || '-';
        const activities: Array<{ time: string; activity: string; guest: string; room: string }> = [];
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);

        if (checkIn >= todayStart && checkIn <= todayEnd) {
          activities.push({
            time: '02:00 PM',
            activity: 'Check-in',
            guest: booking.guestSnapshot.name,
            room,
          });
        }

        if (checkOut >= todayStart && checkOut <= todayEnd) {
          activities.push({
            time: '11:00 AM',
            activity: 'Check-out',
            guest: booking.guestSnapshot.name,
            room,
          });
        }

        return activities;
      })
      .slice(0, 5);

    const topPackages = await Promise.all(
      packages.map(async (pkg) => {
        const packageBookings = await Booking.find({ packageId: pkg._id }).lean();
        return {
          name: pkg.name,
          bookings: packageBookings.length,
          revenue: packageBookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
        };
      })
    );

    const totalRooms = roomAvailability.reduce((sum, room) => sum + room.total, 0);
    const availableRooms = roomAvailability.reduce((sum, room) => sum + room.available, 0);

    return NextResponse.json({
      success: true,
      data: {
        bookings: {
          all: allBookings,
          recent: recentBookings,
        },
        stats: {
          totalBookings: allBookings.length,
          todayCheckIns: todayActivities.filter((activity) => activity.activity === 'Check-in').length,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          occupancyRate: totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0,
          availableRooms,
        },
        roomAvailability,
        todayActivities,
        topPackages,
        addOnSales: addOnSales.map((item) => ({
          name: item._id,
          sold: item.sold,
          revenue: item.revenue,
        })),
        pendingPayments: {
          count: pendingPayments[0]?.count || 0,
          total: pendingPayments[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    if (isDatabaseUnavailable(error)) {
      const localBookings = await getLocalBookings();
      return buildDashboardResponse(localBookings);
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
