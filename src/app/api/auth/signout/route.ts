import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SITE_URLS } from "@/data/config";

/**
 * POST /api/auth/signout
 * Signs out the current user and redirects to home.
 */
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", SITE_URLS.primary));
}
