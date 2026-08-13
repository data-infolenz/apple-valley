import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!secret) {
      throw new Error('JWT_SECRET must be set in production');
    }

    if (secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
  }

  return secret || 'apple-valley-local-dev-secret';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface CustomerJWTPayload {
  customerId: string;
  email: string;
  name: string;
  role: 'customer';
}

export function normalizeRole(role: unknown): string {
  return String(role || '').trim().toLowerCase();
}

export function isAdminRole(role: unknown): boolean {
  return ['admin', 'manager'].includes(normalizeRole(role));
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecret());
  const payloadObj: Record<string, unknown> = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };
  return new SignJWT(payloadObj)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);
}

export async function signCustomerToken(payload: CustomerJWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecret());
  return new SignJWT({
    customerId: payload.customerId,
    email: payload.email,
    role: 'customer',
    name: payload.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.name !== 'string'
    ) {
      return null;
    }

    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyCustomerToken(token: string): Promise<CustomerJWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.customerId !== 'string' ||
      typeof payload.email !== 'string' ||
      payload.role !== 'customer' ||
      typeof payload.name !== 'string'
    ) {
      return null;
    }

    return payload as unknown as CustomerJWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCustomerUser(): Promise<CustomerJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return null;

    return verifyCustomerToken(token);
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30,
    path: '/',
  });
}

export async function setCustomerAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('customer_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30,
    path: '/',
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function clearCustomerAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('customer_token');
}

export function generateBookingId(): string {
  const prefix = 'AV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
