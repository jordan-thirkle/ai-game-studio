import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") || "/admin";
  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/admin";
  const response = NextResponse.redirect(new URL(safeRedirect, url));
  response.cookies.set("eigen_admin_demo", "1", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
