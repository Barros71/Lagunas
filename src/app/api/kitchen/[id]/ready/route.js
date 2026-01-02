import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(request, { params }) {
  try {
    // Verificar autenticação primeiro
    const admin = requireAdmin(request);
    if (!admin) {
      console.log('Acesso negado: usuário não é admin');
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();

    if (!id) {
      console.log('ID não fornecido na requisição');
      return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    }

    console.log('Tentando marcar pedido como pronto:', id, 'por admin:', admin.id);

    // Verificar se o pedido existe
    const existingOrder = await prisma.kitchenOrder.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      console.log('Pedido não encontrado:', id);
      return NextResponse.json({ success: false, error: 'Kitchen order not found' }, { status: 404 });
    }

    console.log('Pedido encontrado, status atual:', existingOrder.status);

    // Verificar se já está entregue
    if (existingOrder.status === 'DELIVERED') {
      console.log('Pedido já está marcado como entregue:', id);
      return NextResponse.json({ success: false, error: 'Order already delivered' }, { status: 400 });
    }

    const updated = await prisma.kitchenOrder.update({
      where: { id },
      data: { status: 'DELIVERED' }
    });

    console.log('Pedido atualizado com sucesso:', updated.id, updated.status);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Erro detalhado ao marcar pedido como pronto:', {
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack
    });

    // Retornar erro mais específico baseado no tipo de erro
    if (err.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Kitchen order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}