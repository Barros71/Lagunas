import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone } = body;
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'name and phone required' }, { status: 400 });
    }

    // create or find client
    let client = await prisma.client.findFirst({ where: { phone } });
    if (!client) {
      client = await prisma.client.create({ data: { name, phone } });
    }

    const token = generateToken({ clientId: client.id });
    const res = NextResponse.json({ success: true, data: { token, user: client } }, { status: 201 });
    res.cookies.set('token', token, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
