import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy convention (Next.js 16+ replaces deprecated middleware.ts).
 * Refreshes Supabase auth session on request.
 * Protects /admin and /login routes.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Match /admin and /api routes. Skip _next, static files, images.
  matcher: ["/admin/:path*", "/login", "/api/:path*", "/blog/:path*"],
};
