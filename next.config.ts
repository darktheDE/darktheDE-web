import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // darkthede.github.io is the production target — Vercel will set this via env
  // when wiring up the custom domain.
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        // Cloudinary-hosted images (blog covers, uploaded assets)
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Supabase Storage (if used for images in the future)
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;