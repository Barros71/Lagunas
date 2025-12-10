import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  const user = verifyAuth(request);
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const total_appointments_today = await prisma.appointment.count({ where: { date: { gte: startOfDay, lt: endOfDay } } });
    const total_appointments_week = await prisma.appointment.count({ where: { date: { gte: startOfWeek, lt: endOfWeek } } });

    const payments = await prisma.payment.findMany({ where: { createdAt: { gte: startOfMonth, lt: endOfMonth } } });
    const total_revenue_month = payments.reduce((s,p) => s + p.amount, 0);

    const open_tabs_count = await prisma.tab.count({ where: { status: 'OPEN' } });

    const upcoming_appointments_raw = await prisma.appointment.findMany({ where: { date: { gte: now } }, include: { client: true }, orderBy: { date: 'asc' }, take: 5 });
    const upcoming_appointments = upcoming_appointments_raw.map(a => ({ id: a.id, client_name: a.client?.name || null, client_phone: a.client?.phone || null, date: a.date.toISOString().split('T')[0], time: a.date.toISOString().split('T')[1].slice(0,5) }));

    const open_tabs_raw = await prisma.tab.findMany({ where: { status: 'OPEN' }, include: { items: true, client: true } });
    const open_tabs = open_tabs_raw.map(t => ({ id: t.id, client_name: t.client?.name || null, items: t.items, total_amount: t.items.reduce((s,i)=>s + i.price*i.quantity, 0), status: t.status }));

    return NextResponse.json({ success: true, data: { total_appointments_today, total_appointments_week, total_revenue_month, open_tabs_count, upcoming_appointments, open_tabs } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
