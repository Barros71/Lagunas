import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  // Temporariamente removendo autenticação para debug
  // const user = verifyAuth(request);
  // if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

  try {
    console.log('Buscando pedidos da cozinha...');

    const orders = await prisma.kitchenOrder.findMany({
      include: { tab: { include: { client: true } } },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Encontrados ${orders.length} pedidos da cozinha`);

    const mapped = orders.map(o => ({
      id: o.id,
      tabId: o.tabId,
      itemName: o.itemName,
      clientName: o.clientName,
      status: o.status,
      createdAt: o.createdAt,
      tab: {
        id: o.tab.id,
        client_name: o.tab.client?.name || null,
        table_number: o.tab.client ? undefined : null
      }
    }));

    return NextResponse.json({ success: true, data: mapped, debug: { totalOrders: orders.length } });
  } catch (err) {
    console.error('Erro na API de cozinha:', err);
    return NextResponse.json({ success: false, error: 'Internal error', details: err.message }, { status: 500 });
  }
}