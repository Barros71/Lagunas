import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload?.clientId) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const client = await prisma.client.findUnique({ where: { id: payload.clientId } });
    if (!client) return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: client });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
