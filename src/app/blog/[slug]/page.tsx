import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createClient } from "@/lib/supabase/server";
import { mdxComponents } from "@/lib/mdx-components";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  body_mdx: string;
  published_at: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} — darktheDE`,
    description: post.excerpt ?? `Blog post: ${post.title}`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="font-mono text-xs uppercase tracking-[0.22em] text-accent hover:underline"
      >
        ← Back to blog
      </Link>

      <header className="mt-8">
        {publishedDate && (
          <time className="font-mono text-xs text-mute">{publishedDate}</time>
        )}
        <h1 className="mt-3 text-3xl font-black leading-tight text-text sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 max-w-xl text-base leading-7 text-mute">
            {post.excerpt}
          </p>
        )}
      </header>

      {post.cover_url && (
        <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden border border-rule">
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose mt-10">
        <MDXRemote source={post.body_mdx} components={mdxComponents} />
      </div>
    </article>
  );
}
