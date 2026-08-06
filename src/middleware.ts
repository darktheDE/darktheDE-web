import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware: refresh Supabase auth session on every request.
 * Also protects /admin routes (redirects unauthenticated to home).
 *
 * See: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Match /admin and /api routes. Skip _next, static files, images.
  matcher: ["/admin/:path*", "/login", "/api/:path*", "/blog/:path*"],
};
