import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function serializeAddOn(addOn: {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricingUnit: string;
  available: boolean;
  order: number;
}) {
  return {
    id: addOn.id,
    slug: addOn.slug,
    name: addOn.name,
    description: addOn.description,
    category: addOn.category,
    price: addOn.price,
    pricingUnit: addOn.pricingUnit,
    available: addOn.available,
    order: addOn.order,
  };
}

type SerializedAddOnInput = Parameters<typeof serializeAddOn>[0];

export async function GET() {
  try {
    const addOns: SerializedAddOnInput[] = await prisma.addOn.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    return NextResponse.json({
      success: true,
      data: addOns.map(serializeAddOn),
    });
  } catch (error) {
    console.error('Get add-ons error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const slug = String(body.slug || slugify(name));

    if (!name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const addOn = await prisma.addOn.upsert({
      where: { slug },
      update: {
        name,
        description: body.description || name,
        category: body.category,
        price: Number(body.price),
        pricingUnit: body.pricingUnit || 'per_booking',
        available: body.available ?? true,
        order: Number(body.order || 0),
      },
      create: {
        slug,
        name,
        description: body.description || name,
        category: body.category,
        price: Number(body.price),
        pricingUnit: body.pricingUnit || 'per_booking',
        available: body.available ?? true,
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeAddOn(addOn),
      message: 'Add-on service saved successfully',
    });
  } catch (error) {
    console.error('Save add-on error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
