"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { createPost, updatePost, deletePost, publishPost } from "@/lib/actions";
import { cn } from "@/lib/cn";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[300px] border border-rule bg-panel/30 flex items-center justify-center text-mute">
      Loading editor...
    </div>
  ),
});

interface Post {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface PostEditorProps {
  posts: Post[];
}

type View = "list" | "create" | "edit";

export function PostEditor({ posts }: PostEditorProps) {
  const [view, setView] = useState<View>("list");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [bodyMdx, setBodyMdx] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  function resetForm() {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCoverUrl("");
    setBodyMdx("");
    setStatus("draft");
  }

  function startCreate() {
    resetForm();
    setEditingPost(null);
    setView("create");
  }

  function startEdit(post: Post) {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setView("edit");
    // Full body loaded via separate fetch or pre-loaded — for now, empty
    setBodyMdx("");
  }

  function handleSlugFromTitle() {
    setSlug(
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("excerpt", excerpt);
      formData.append("cover_url", coverUrl);
      formData.append("body_mdx", bodyMdx);
      formData.append("status", status);

      if (view === "create") {
        await createPost(formData);
      } else if (view === "edit" && editingPost) {
        formData.append("id", editingPost.id);
        await updatePost(formData);
      }
      setView("list");
      resetForm();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      await deletePost(formData);
    });
  }

  function handlePublish(id: string) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      await publishPost(formData);
    });
  }

  // ── List view ──────────────────────────────────────────────
  if (view === "list") {
    return (
      <div>
        <button
          onClick={startCreate}
          className="mb-6 bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-dim"
        >
          + New Post
        </button>

        <div className="grid gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between border border-rule bg-panel/30 p-4"
            >
              <div>
                <h3 className="text-sm font-bold text-text">{post.title}</h3>
                <p className="mt-1 font-mono text-xs text-mute">
                  /{post.slug} ·{" "}
                  <span
                    className={cn(
                      post.status === "published" ? "text-accent" : "text-warn"
                    )}
                  >
                    {post.status}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {post.status === "draft" && (
                  <button
                    onClick={() => handlePublish(post.id)}
                    className="border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono text-accent transition-colors hover:bg-accent/20"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => startEdit(post)}
                  className="border border-rule px-3 py-1 text-xs font-mono text-mute transition-colors hover:border-accent/40 hover:text-text"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="border border-warn/30 bg-warn/10 px-3 py-1 text-xs font-mono text-warn transition-colors hover:bg-warn/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-mute">No posts yet.</p>
          )}
        </div>
      </div>
    );
  }

  // ── Create / Edit view ─────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setView("list")}
          className="font-mono text-xs text-accent hover:underline"
        >
          ← Back to list
        </button>
        <span className="text-mute">|</span>
        <span className="font-mono text-xs text-mute">
          {view === "create" ? "New post" : `Editing: ${editingPost?.slug}`}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs text-mute">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={view === "create" ? handleSlugFromTitle : undefined}
            required
            className="w-full border border-rule bg-panel/30 px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-mute">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="w-full border border-rule bg-panel/30 px-3 py-2 font-mono text-sm text-text outline-none focus:border-accent/50"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs text-mute">
          Excerpt
        </label>
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full border border-rule bg-panel/30 px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs text-mute">
          Cover URL
        </label>
        <input
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="w-full border border-rule bg-panel/30 px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs text-mute">
          Body (MDX)
        </label>
        <div data-color-mode="dark">
          <MDEditor
            value={bodyMdx}
            onChange={(val) => setBodyMdx(val ?? "")}
            height={400}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-mute">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border border-rule bg-panel/30 px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-auto bg-accent px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-dim disabled:opacity-50"
        >
          {isPending ? "Saving..." : view === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}
