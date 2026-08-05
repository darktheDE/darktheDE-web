import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog — darktheDE",
  description:
    "Thoughts on data engineering, backend systems, and building reliable data products.",
};

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
}

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.22em] text-accent hover:underline"
        >
          ← Back to portfolio
        </Link>
        <h1 className="mt-4 text-4xl font-black text-text sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-mute">
          Notes on data engineering, backend design, and the systems I build.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="border border-rule bg-panel/30 p-8 text-center">
          <p className="text-mute">No posts yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block border border-rule bg-panel/30 transition-colors hover:border-accent/40"
            >
              {post.cover_url && (
                <div className="relative aspect-[2/1] w-full overflow-hidden">
                  <Image
                    src={post.cover_url}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <time className="font-mono text-xs text-mute">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Draft"}
                </time>
                <h2 className="mt-2 text-xl font-bold text-text group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm leading-6 text-mute line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
