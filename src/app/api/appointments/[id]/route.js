import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  try {
      const resolvedParams = params && typeof params.then === 'function' ? await params : params;
      const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    const a = await prisma.appointment.findUnique({ where: { id }, include: { client: true } });
    if (!a) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    let extras = {};
    try { extras = a.note ? JSON.parse(a.note) : {}; } catch { extras = {}; }
    const mapped = {
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
    return NextResponse.json({ success: true, data: mapped });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
   try {
      const resolvedParams = params && typeof params.then === 'function' ? await params : params;
      const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    const body = await request.json();
    const { date, time, ...rest } = body;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    let extras = {};
    try { extras = appointment.note ? JSON.parse(appointment.note) : {}; } catch { extras = {}; }
    const newExtras = { ...extras, ...rest };

    let newDate = appointment.date;
    if (date) {
      const t = time || (extras.time || appointment.date.toISOString().split('T')[1].slice(0,5));
      newDate = new Date(date + 'T' + t + ':00.000Z');
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { date: newDate, note: JSON.stringify(newExtras) },
    });

    return NextResponse.json({ success: true, data: { id: updated.id } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
   try {
      const resolvedParams = params && typeof params.then === 'function' ? await params : params;
      const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
