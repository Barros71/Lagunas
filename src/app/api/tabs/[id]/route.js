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
    const tab = await prisma.tab.findUnique({ where: { id }, include: { items: true, payments: true, client: true } });
    if (!tab) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const total = tab.items.reduce((s,i)=>s + i.price * i.quantity, 0);
    return NextResponse.json({ success: true, data: { ...tab, total_amount: total } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    const body = await request.json();
    const { status, client_name } = body;
    const data = {};
    if (status) {
      // accept Portuguese status values and map to DB enum
      const map = {
        aberta: 'OPEN',
        fechada: 'CLOSED',
        paga: 'CLOSED',
        cancelada: 'CANCELED',
      };
      const mapped = map[status] || status.toUpperCase();
      data.status = mapped;
    }
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const updated = await prisma.tab.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: updated });
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
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    
    // First delete related TabItems and Payments, then delete the Tab itself
    const [itemsResult, paymentsResult, deletedTab] = await prisma.$transaction([
      prisma.tabItem.deleteMany({ where: { tabId: id } }),
      prisma.payment.deleteMany({ where: { tabId: id } }),
      prisma.tab.delete({ where: { id } }),
    ]);

    const details = {
      deletedItems: itemsResult?.count ?? itemsResult,
      deletedPayments: paymentsResult?.count ?? paymentsResult,
      deletedTabId: deletedTab?.id ?? null,
    };

    console.log('DELETE /api/tabs/[id] - success', { id, details });
    return NextResponse.json({ success: true, details });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error', details: err.message }, { status: 500 });
  }
}
