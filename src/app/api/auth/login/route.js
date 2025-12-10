import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';
import { comparePassword } from '@/lib/hash';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, password } = body;
    if (!name) return NextResponse.json({ success: false, error: 'name required' }, { status: 400 });

    // Find client by name (names are assumed unique/identifier in this app)
    const client = await prisma.client.findFirst({ where: { name } });
    if (!client) return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });

    // Se cliente é admin, verificar senha
    if (client.isAdmin && password) {
      const passwordMatch = await comparePassword(password, client.password);
      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
      }
    }

    const token = generateToken({ clientId: client.id, isAdmin: client.isAdmin });
    const res = NextResponse.json({ success: true, data: { token, user: { id: client.id, name: client.name, phone: client.phone, isAdmin: client.isAdmin } } });
    res.cookies.set('token', token, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
