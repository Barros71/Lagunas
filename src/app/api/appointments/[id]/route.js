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

      console.log('PUT /api/appointments/[id] chamado com ID:', id);

    const body = await request.json();
    console.log('Dados recebidos para atualização:', body);

    const { date, time, client_name, client_phone, ...rest } = body;

    const appointment = await prisma.appointment.findUnique({ 
      where: { id },
      include: { client: true }
    });
    if (!appointment) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    let extras = {};
    try { extras = appointment.note ? JSON.parse(appointment.note) : {}; } catch { extras = {}; }
    
    // Remover client_name e client_phone dos extras se temos um cliente associado
    const { client_name: _, client_phone: __, ...restWithoutClientData } = rest;
    const newExtras = { ...extras, ...restWithoutClientData, ...(time !== undefined && { time }) };

    // Atualizar cliente se os dados foram fornecidos
    if (appointment.client && (client_name !== undefined || client_phone !== undefined)) {
      console.log('Atualizando cliente associado:', appointment.client.id);
      await prisma.client.update({
        where: { id: appointment.client.id },
        data: {
          ...(client_name !== undefined && { name: client_name }),
          ...(client_phone !== undefined && { phone: client_phone }),
        },
      });
      console.log('Cliente atualizado com sucesso');
    }

    let newDate = appointment.date;
    if (date || time) {
      const currentDateStr = date || appointment.date.toISOString().split('T')[0];
      const t = time || (extras.time || appointment.date.toISOString().split('T')[1].slice(0,5));
      newDate = new Date(currentDateStr + 'T' + t + ':00.000Z');
    }

    // Se não há cliente associado, manter client_name e client_phone no note
    const finalExtras = appointment.client ? newExtras : { ...newExtras, ...(client_name !== undefined && { client_name }), ...(client_phone !== undefined && { client_phone }) };
    
    const updated = await prisma.appointment.update({
      where: { id },
      data: { date: newDate, note: Object.keys(finalExtras).length > 0 ? JSON.stringify(finalExtras) : null },
    });

    console.log('Appointment atualizado no banco:', updated.id, 'com dados:', { date: newDate, note: Object.keys(finalExtras).length > 0 ? JSON.stringify(finalExtras) : null });

    return NextResponse.json({ success: true, data: { id: updated.id } });
  } catch (err) {
    console.error('Erro na atualização do appointment:', err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
   try {
      const resolvedParams = params && typeof params.then === 'function' ? await params : params;
      const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('Error in DELETE /api/appointments/:id', err);
    const message = (err && err.message) ? err.message : 'Internal error';
    const payload = { success: false, error: process.env.NODE_ENV === 'development' ? message : 'Internal error' };
    return NextResponse.json(payload, { status: 500 });
  }
}
