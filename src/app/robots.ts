import type { MetadataRoute } from "next";
import { SITE_URLS } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URLS.primary;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
