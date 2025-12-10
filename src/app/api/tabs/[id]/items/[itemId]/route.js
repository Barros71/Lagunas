import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function DELETE(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    let id = resolvedParams && resolvedParams.id;
    let itemId = resolvedParams && resolvedParams.itemId;
    if (!id || !itemId) {
      const parts = new URL(request.url).pathname.split('/').filter(Boolean);
      // expected .../tabs/{id}/items/{itemId}
      itemId = itemId || parts[parts.length - 1];
      id = id || parts[parts.length - 3];
    }
    await prisma.tabItem.delete({ where: { id: itemId } });
    const tab = await prisma.tab.findUnique({ where: { id }, include: { items: true, client: true, payments: true } });
    const total = tab.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const status_pt = (tab.status === 'OPEN') ? 'aberta' : (tab.status === 'CLOSED' ? (tab.payments && tab.payments.length > 0 ? 'paga' : 'fechada') : 'cancelada');
    const mapped = {
      id: tab.id,
      client_name: tab.client?.name || null,
      table_number: tab.client ? undefined : null,
      items: tab.items,
      total_amount: total,
      status: status_pt,
      createdAt: tab.createdAt,
    };
    return NextResponse.json({ success: true, data: mapped });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
