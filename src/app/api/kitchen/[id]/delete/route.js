import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });

  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    await prisma.kitchenOrder.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}