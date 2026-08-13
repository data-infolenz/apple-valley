import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: '/' });
  response.cookies.set('auth_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('customer_token', '', { path: '/', maxAge: 0 });
  return response;
}
