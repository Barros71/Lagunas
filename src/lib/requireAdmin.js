import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function requireAdmin(request) {
  try {
    const cookieHeader = request.headers?.get ? request.headers.get('cookie') : (request.headers && request.headers.cookie) || '';
    if (!cookieHeader) return null;
    
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('token='));
    if (!tokenCookie) return null;
    
    const token = decodeURIComponent(tokenCookie.split('=')[1]);
    const payload = verifyToken(token);
    
    if (!payload.isAdmin) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}

export function adminOnly(request) {
  const user = requireAdmin(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  return null;
}

export default requireAdmin;
