import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/PostEditor";

export const metadata = {
  title: "Admin — darktheDE",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-black text-text">
            Manage Posts
          </h1>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="border border-rule bg-panel/30 px-4 py-2 text-xs font-mono text-mute transition-colors hover:border-accent/40 hover:text-text"
          >
            Sign out
          </button>
        </form>
      </div>

      <PostEditor posts={posts ?? []} />
    </section>
  );
}
