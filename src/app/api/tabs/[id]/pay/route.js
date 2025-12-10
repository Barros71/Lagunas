import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const body = await request.json();
    const { payment_method } = body;
    const tab = await prisma.tab.findUnique({ where: { id }, include: { items: true } });
    if (!tab) return NextResponse.json({ success: false, error: 'Tab not found' }, { status: 404 });

    const total = tab.items.reduce((s,i)=>s + i.price * i.quantity, 0);
    // create payment
    // map frontend payment methods (pt) to DB enum
    const methodMap = {
      dinheiro: 'CASH',
      pix: 'PIX',
      credito: 'CREDIT',
      debito: 'DEBIT',
    };
    const method = payment_method ? (methodMap[payment_method] || payment_method.toUpperCase()) : 'CASH';
    const payment = await prisma.payment.create({ data: { tabId: id, amount: total, method } });
    // update tab status to CLOSED
    await prisma.tab.update({ where: { id }, data: { status: 'CLOSED' } });

    const tabUpdated = await prisma.tab.findUnique({ where: { id }, include: { items: true, client: true, payments: true } });
    const totalUpdated = tabUpdated.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const status_pt = (tabUpdated.status === 'OPEN') ? 'aberta' : (tabUpdated.status === 'CLOSED' ? (tabUpdated.payments && tabUpdated.payments.length > 0 ? 'paga' : 'fechada') : 'cancelada');

    const dbMethodToPt = (m) => {
      if (!m) return null;
      const map = { CASH: 'dinheiro', PIX: 'pix', CREDIT: 'credito', DEBIT: 'debito' };
      return map[m] || m.toLowerCase();
    };

    const paymentsMapped = (tabUpdated.payments || []).map((p) => ({ amount: p.amount, method: p.method, method_pt: dbMethodToPt(p.method), createdAt: p.createdAt }));
    const payment_method_pt = paymentsMapped.length > 0 ? paymentsMapped[0].method_pt : undefined;

    const mapped = {
      id: tabUpdated.id,
      client_name: tabUpdated.client?.name || null,
      table_number: tabUpdated.client ? undefined : null,
      items: tabUpdated.items,
      total_amount: totalUpdated,
      status: status_pt,
      payment_method: payment_method_pt,
      payments: paymentsMapped,
      createdAt: tabUpdated.createdAt,
    };

    return NextResponse.json({ success: true, data: mapped });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
