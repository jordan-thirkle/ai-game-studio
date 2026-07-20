import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") || "/";
  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
  const response = NextResponse.redirect(new URL(safeRedirect, url));
  response.cookies.delete("eigen_admin_demo");
  return response;
}
