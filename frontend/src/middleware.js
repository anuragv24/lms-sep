import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("accessToken")?.value;

  let isTokenValid = false;
  let userPayload = null;

  if (sessionToken) {
    try {

      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const cacheBuster = Date.now();
      const verificationUrl = `${BACKEND_URL}/api/auth/me?cb=${cacheBuster}`;
      
      const res = await fetch(verificationUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });

      if (res.ok) {
        const data = await res.json();
        isTokenValid = true;
        userPayload = data.user; 
      }else {
        console.log(`Backend rejected token string with status code: ${res.status}`);
      isTokenValid = false;
      }
    } catch (error) {
      console.error("Middleware Auth Verification Handshake Failed:", error.message);
      isTokenValid = false;
    }
  }

  const isDashboardRoute =
    pathname.startsWith("/books") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/reader");
    
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/admin-upload");
    
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if ((isDashboardRoute || isAdminRoute) && !isTokenValid) {

    const response = NextResponse.redirect(new URL("/login", request.url));
    if (sessionToken) response.cookies.delete("accessToken");
    return response;
  }

  if (isAdminRoute && isTokenValid && userPayload?.role !== "admin") {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  if (isAuthRoute && isTokenValid) {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/books/:path*",
    "/bookmarks/:path*",
    "/admin/:path*",
    "/admin-upload/:path*",
    "/reader/:path*",
    "/login",
    "/register",
  ],
};