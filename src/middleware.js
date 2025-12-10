import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  const url = req.nextUrl.clone();

  // Se tentar acessar dashboard sem token → redireciona
  if (url.pathname.startsWith("/dashboard") && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Se tentar acessar login/cadastro MAS já está logado → envia pro dashboard
  if ((url.pathname === "/login" || url.pathname === "/register") && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
