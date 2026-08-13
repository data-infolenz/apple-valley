import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: '/' });
  response.cookies.delete('customer_token');
  return response;
}
