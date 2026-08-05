"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Actions for blog post CRUD.
 * All actions check auth via the Supabase server client.
 * RLS policies on the `posts` table enforce access control.
 */

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("posts").insert({
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    cover_url: (formData.get("cover_url") as string) || null,
    body_mdx: (formData.get("body_mdx") as string) || "",
    status: (formData.get("status") as "draft" | "published") || "draft",
    published_at:
      formData.get("status") === "published" ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const newStatus = formData.get("status") as "draft" | "published";

  const update: Record<string, unknown> = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: (formData.get("excerpt") as string) || null,
    cover_url: (formData.get("cover_url") as string) || null,
    body_mdx: formData.get("body_mdx"),
    status: newStatus,
  };

  // Set published_at when publishing for the first time
  if (newStatus === "published") {
    update.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("posts").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function publishPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin");
}
