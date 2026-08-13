import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signCustomerToken } from '@/lib/auth';
import { clearRateLimit, getClientIp, isRateLimited } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const rateLimitKey = `customer:${getClientIp(request.headers)}:${email || 'missing'}`;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Try again later.' },
        { status: 429 }
      );
    }

    const customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer || !customer.isActive || !(await bcrypt.compare(password, customer.password))) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    clearRateLimit(rateLimitKey);

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
    console.error('Customer login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
