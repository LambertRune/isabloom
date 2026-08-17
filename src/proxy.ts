import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/beheer") || pathname.startsWith("/beheer/login")) {
    return NextResponse.next();
  }
  if (!request.cookies.get("access_token")) {
    const login = new URL("/beheer/login", request.url);
    login.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/beheer", "/beheer/:path*"],
};
