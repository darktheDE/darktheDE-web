import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

/**
 * Custom MDX components for blog posts.
 * Maps HTML elements to styled React components matching the dark-only design.
 *
 * Usage: <MDXRemote source={body_mdx} components={mdxComponents} />
 */
export const mdxComponents: MDXComponents = {
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-dim transition-colors"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-accent underline underline-offset-2 hover:text-accent-dim transition-colors"
      >
        {children}
      </Link>
    );
  },
  img: ({ src, alt }) => (
    <span className="relative block aspect-video w-full overflow-hidden border border-rule">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
    </span>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto border border-rule bg-ink p-4 text-sm leading-6 text-text">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.85em] text-accent">{children}</code>
  ),
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 text-3xl font-black text-text">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 text-2xl font-bold text-text">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-xl font-bold text-text">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-base leading-7 text-mute">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-mute">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-mute">{children}</ol>
  ),
  li: ({ children }) => <li className="text-base leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-accent/40 pl-4 italic text-mute">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-rule" />,
};
