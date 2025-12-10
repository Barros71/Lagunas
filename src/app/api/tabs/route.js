import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request) {
  const user = verifyAuth(request);
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  try {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get('status'); // possible values from frontend (pt)
    let where = {};
    if (statusParam) {
      const map = {
        aberta: 'OPEN',
        fechada: 'CLOSED',
        paga: 'CLOSED',
        cancelada: 'CANCELED',
      };
      where = { status: map[statusParam] || statusParam };
    }
    const tabs = await prisma.tab.findMany({ where, include: { items: true, client: true, payments: true }, orderBy: { createdAt: 'desc' } });
    const dbMethodToPt = (m) => {
      if (!m) return null;
      const map = { CASH: 'dinheiro', PIX: 'pix', CREDIT: 'credito', DEBIT: 'debito' };
      return map[m] || m.toLowerCase();
    };

    const mapped = tabs.map(t => {
      const total = t.items.reduce((s, i) => s + i.price * i.quantity, 0);
      // map DB status to frontend Portuguese status
      let status_pt = 'aberta';
      if (t.status === 'OPEN') status_pt = 'aberta';
      else if (t.status === 'CLOSED') status_pt = (t.payments && t.payments.length > 0) ? 'paga' : 'fechada';
      else if (t.status === 'CANCELED') status_pt = 'cancelada';

      const payment_method = (t.payments && t.payments.length > 0) ? dbMethodToPt(t.payments[0].method) : undefined;
      const payments = (t.payments || []).map(p => ({ amount: p.amount, method: p.method, method_pt: dbMethodToPt(p.method), createdAt: p.createdAt }));

      return {
        id: t.id,
        client_name: t.client?.name || null,
        table_number: t.client ? undefined : null,
        items: t.items,
        total_amount: total,
        status: status_pt,
        payment_method,
        payments,
        createdAt: t.createdAt,
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
    const { client_name, table_number, client_phone } = body;

    let client = null;
    if (client_phone) client = await prisma.client.findFirst({ where: { phone: client_phone } });
    if (!client) client = await prisma.client.create({ data: { name: client_name || 'Cliente', phone: client_phone || null } });

    const created = await prisma.tab.create({ data: { clientId: client.id, status: 'OPEN' } });
    const tab = await prisma.tab.findUnique({ where: { id: created.id }, include: { items: true, client: true, payments: true } });
    const total = tab.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const mapped = {
      id: tab.id,
      client_name: tab.client?.name || null,
      table_number: tab.client ? undefined : null,
      items: tab.items,
      total_amount: total,
      status: 'aberta',
      createdAt: tab.createdAt,
    };
    return NextResponse.json({ success: true, data: mapped }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
