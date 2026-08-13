import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signCustomerToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').toLowerCase();

    if (!body.name || !email || !body.password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Name, valid email, and password are required' },
        { status: 400 }
      );
    }

    if (String(body.password).length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        email,
        name: body.name,
        phone: body.phone,
        password: await bcrypt.hash(body.password, 12),
      },
    });
    const token = await signCustomerToken({
      customerId: customer.id.toString(),
      email: customer.email,
      name: customer.name,
      role: 'customer',
    });
    const response = NextResponse.json({
      success: true,
      data: { id: customer.id, email: customer.email, name: customer.name },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Customer register error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to create customer account' },
      { status: 500 }
    );
  }
}
