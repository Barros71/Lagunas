import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();

    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    console.log('Verificando pedido da cozinha:', id);

    const order = await prisma.kitchenOrder.findUnique({
      where: { id },
      include: { tab: { include: { client: true } } }
    });

    if (!order) {
      console.log('Pedido não encontrado:', id);
      return NextResponse.json({ success: false, error: 'Kitchen order not found' }, { status: 404 });
    }

    console.log('Pedido encontrado:', order);

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    return NextResponse.json({ success: false, error: 'Internal error', details: err.message }, { status: 500 });
  }
}