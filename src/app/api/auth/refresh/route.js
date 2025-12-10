import { NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    // Issue new token
    const newToken = generateToken({ clientId: payload.clientId });
    const res = NextResponse.json({ success: true, data: { token: newToken } });
    res.cookies.set('token', newToken, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
