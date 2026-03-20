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
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const p = await prisma.product.findUnique({ 
      where: { id },
      include: { options: true }
    });
    if (!p) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: p });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const id = (resolvedParams && resolvedParams.id) || new URL(request.url).pathname.split('/').pop();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const body = await request.json();
    const { name, category, price, promo_price, is_promo, hasOptions, options } = body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (price !== undefined) data.price = price;
    if (promo_price !== undefined) data.promo_price = promo_price;
    if (is_promo !== undefined) data.is_promo = is_promo;
    if (hasOptions !== undefined) data.hasOptions = hasOptions;
    
    // Handle options update
    if (options !== undefined) {
      // Delete existing options
      await prisma.productOption.deleteMany({ where: { productId: id } });
      
      // Create new options if hasOptions is true
      if (hasOptions && Array.isArray(options) && options.length > 0) {
        data.options = {
          create: options.map(opt => ({ name: typeof opt === 'string' ? opt : opt.name }))
        };
      }
    }
    
    const updated = await prisma.product.update({ 
      where: { id }, 
      data,
      include: { options: true }
    });
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
