import { NextResponse, type NextRequest } from "next/server";

/**
 * DEPRECATED: The "middleware" file convention is deprecated in Next.js 16+.
 * Consider using `next/auth` or `proxy` configuration in next.config.ts for new code.
 * This implementation is kept for backwards compatibility and still works correctly.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // Se não tem token → redireciona para login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se já tem token e tentar acessar /login → manda para dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};
