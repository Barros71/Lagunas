import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = NextResponse.json({ success: true, message: 'Logged out' });
  // Clear cookie
  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
