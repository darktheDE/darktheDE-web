import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.22em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-3xl font-black text-text sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-mute">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 border border-accent/30 bg-accent/10 px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
      >
        ← Back to home
      </Link>
    </section>
  );
}
