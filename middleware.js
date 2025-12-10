import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public paths and Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    PUBLIC_PATHS.includes(pathname) ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // If no token, redirect to login for protected routes
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Validate JWT using jose
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/agenda/:path*',
    '/comandas/:path*',
    '/cardapio/:path*',
    '/api/:path*'
  ]
};
