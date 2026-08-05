import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client. Reads auth session from cookies.
 * Used in Server Components, Server Actions, Route Handlers.
 *
 * Pattern: per-request client (cookies() is async in Next 15+).
 * See: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — ignore.
            // Can be called in middleware to refresh session.
          }
        },
      },
    }
  );
}

/**
 * Service-role client — bypasses RLS.
 * USE SPARINGLY: only for trusted server-only ops (admin seeding, migrations).
 * Never import in client components.
 */
export async function createServiceClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll from Server Component — ignore.
          }
        },
      },
    }
  );
}
