import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try multiple ways of getting the token
  const accessTokenFromCookie = request.cookies.get("accessToken")?.value;
  const accessTokenFromHeader = request.headers
    .get("Authorization")
    ?.split("Bearer ")[1];

  // Define public paths
  const publicPaths = ["/login", "/register", "/auth/callback"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  const token = accessTokenFromCookie || accessTokenFromHeader;

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // Preserve the original path
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and tries to access a public path, redirect to /board
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
