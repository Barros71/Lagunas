import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request) {
  const user = verifyAuth(request);
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category && category !== 'todos' ? { category } : {};
    const products = await prisma.product.findMany({ where: query, orderBy: { createdAt: 'desc' } });
    
    const mapped = products.map(p => ({ 
      id: p.id, 
      name: p.name, 
      category: p.category,
      price: p.price, 
      promo_price: p.promo_price,
      is_promo: p.is_promo,
      createdAt: p.createdAt 
    }));
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
    const { name, category = 'comida', price, promo_price, is_promo = false } = body;
    if (!name || typeof price !== 'number') return NextResponse.json({ success: false, error: 'name and price required' }, { status: 400 });
    
    const p = await prisma.product.create({ 
      data: { name, category, price, promo_price: promo_price || null, is_promo } 
    });
    
    return NextResponse.json({ success: true, data: p }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
