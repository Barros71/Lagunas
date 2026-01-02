import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop(); // tab id
    const body = await request.json();
    const { product_id, name, unit_price, quantity = 1 } = body;

    // if product_id provided, try to fetch product name/price
    let prod = null;
    if (product_id) prod = await prisma.product.findUnique({ where: { id: product_id } });

    await prisma.tabItem.create({
      data: {
        tabId: id,
        productId: product_id || null,
        name: prod ? prod.name : (name || 'Item'),
        price: prod ? (prod.is_promo && prod.promo_price ? prod.promo_price : prod.price) : (unit_price || 0),
        quantity: quantity,
      },
    });

    // Check if product category requires kitchen order
    if (prod && ['petiscos', 'cervejas', 'drinks', 'bebidas'].includes(prod.category)) {
      const tab = await prisma.tab.findUnique({ where: { id }, include: { client: true } });
      const clientName = tab?.client?.name || 'Cliente';

      await prisma.kitchenOrder.create({
        data: {
          tabId: id,
          itemName: prod.name,
          clientName: clientName,
        },
      });
    }

    // return updated tab mapped to frontend shape
    const tab = await prisma.tab.findUnique({ where: { id }, include: { items: true, client: true, payments: true } });
    if (!tab) {
      return NextResponse.json({ success: false, error: 'Tab not found' }, { status: 404 });
    }
    const total = (tab.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
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

    return NextResponse.json({ success: true, data: mapped }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const items = await prisma.tabItem.findMany({ where: { tabId: id } });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
