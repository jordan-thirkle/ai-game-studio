import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  if (request.cookies.get("eigen_admin_demo")?.value === "1") return NextResponse.next();
  const login = new URL("/api/auth/demo", request.url);
  login.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*"] };
