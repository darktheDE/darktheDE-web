import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSignedUpload } from "@/lib/cloudinary";

/**
 * POST /api/upload
 * Returns a signed Cloudinary upload URL. Browser uploads directly to Cloudinary.
 *
 * Auth: requires Supabase session (admin only).
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = generateSignedUpload("blog");
  return NextResponse.json(params);
}
