import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signCustomerToken } from '@/lib/auth';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(`customer-register:${getClientIp(request.headers)}`)) {
      return NextResponse.json({ success: false, error: 'Too many sign-up attempts. Try again later.' }, { status: 429 });
    }
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name || name.length > 100 || !email || typeof body.password !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Name, valid email, and password are required' },
        { status: 400 }
      );
    }

    if (body.password.length < 8 || Buffer.byteLength(body.password, 'utf8') > 72) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters and no more than 72 bytes' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        email,
        name,
        phone: typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : undefined,
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
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'An account already exists with this email. Please sign in.' }, { status: 409 });
    }
    console.error('Customer register error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to create customer account' },
      { status: 500 }
    );
  }
}
