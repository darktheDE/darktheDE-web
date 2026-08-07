import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URLS } from "@/data/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URLS.primary;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");

    if (posts) {
      posts.forEach((post) => {
        routes.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || Date.now()),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }
  } catch {
    // Fallback if DB query during static generation fails
  }

  return routes;
}
