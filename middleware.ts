import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { updateSession } from '@/utils/supabase/middleware';

function isAdminRole(role: unknown) {
  return ['admin', 'manager'].includes(String(role || '').trim().toLowerCase());
}

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (process.env.NODE_ENV === 'production' && (!secret || secret.length < 32)) {
    throw new Error('JWT_SECRET must be set to at least 32 characters in production');
  }

  return new TextEncoder().encode(secret || 'apple-valley-local-dev-secret');
}

async function verifyToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseResponse = await updateSession(request);

  if (pathname.startsWith('/admin/login')) {
    const payload = await verifyToken(request.cookies.get('auth_token')?.value);
    if (payload && isAdminRole(payload.role)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return supabaseResponse;
  }

  if (pathname.startsWith('/admin')) {
    const payload = await verifyToken(request.cookies.get('auth_token')?.value);
    if (!payload || !isAdminRole(payload.role)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname.startsWith('/customer/dashboard')) {
    const payload = await verifyToken(request.cookies.get('customer_token')?.value);
    if (!payload || payload.role !== 'customer') {
      return NextResponse.redirect(new URL('/customer/login', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)',
  ],
};
