"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-24 sm:px-6">
      <div className="border border-rule bg-panel/40 p-6 sm:p-8 backdrop-blur-xs">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
            Admin Auth
          </p>
          <h1 className="mt-1 text-2xl font-black text-text">Sign In</h1>
          <p className="mt-2 text-xs text-mute">
            Enter your credentials to access the blog editor.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs text-mute mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@darkthede.com"
              className="w-full border border-rule bg-ink px-3 py-2 text-sm text-text placeholder:text-mute/50 focus:border-accent focus:outline-hidden"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs text-mute mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-rule bg-ink px-3 py-2 text-sm text-text placeholder:text-mute/50 focus:border-accent focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-accent bg-accent/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-ink disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
