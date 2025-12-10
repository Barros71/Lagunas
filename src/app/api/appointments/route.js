import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request) {
  const user = verifyAuth(request);
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date'); // YYYY-MM-DD

    const where = date
      ? {
          date: {
            gte: new Date(date + 'T00:00:00.000Z'),
            lt: new Date(date + 'T23:59:59.999Z'),
          },
        }
      : {};

    const appointments = await prisma.appointment.findMany({
      where,
      include: { client: true },
      orderBy: { date: 'asc' },
    });

    // Map note JSON
    const mapped = appointments.map((a) => {
      let extras = {};
      try {
        extras = a.note ? JSON.parse(a.note) : {};
      } catch {
        extras = {};
      }
      return {
        id: a.id,
        client_name: a.client?.name || extras.client_name || null,
        client_phone: a.client?.phone || extras.client_phone || null,
        date: a.date.toISOString().split('T')[0],
        time: extras.time || a.date.toISOString().split('T')[1].slice(0,5),
        duration: extras.duration || 60,
        tattoo_description: extras.tattoo_description || extras.note || '',
        tattoo_size: extras.tattoo_size || 'media',
        price_estimate: extras.price_estimate || 0,
        status: extras.status || 'agendado',
        notes: extras.notes || '',
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try {
    const body = await request.json();
    const {
      client_name,
      client_phone,
      date, // YYYY-MM-DD
      time = '14:00',
      duration = 60,
      tattoo_description = '',
      tattoo_size = 'media',
      price_estimate = 0,
      status = 'agendado',
      notes = '',
    } = body;

    // find or create client
    let client = null;
    if (client_phone) {
      client = await prisma.client.findFirst({ where: { phone: client_phone } });
    }
    if (!client) {
      client = await prisma.client.create({ data: { name: client_name || 'Cliente', phone: client_phone || null } });
    }

    const dateTime = new Date(date + 'T' + time + ':00.000Z');

    const noteObj = {
      client_name,
      client_phone,
      time,
      duration,
      tattoo_description,
      tattoo_size,
      price_estimate,
      status,
      notes,
    };

    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        date: dateTime,
        note: JSON.stringify(noteObj),
      },
    });

    return NextResponse.json({ success: true, data: { id: appointment.id } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
