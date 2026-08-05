# Process docs

How we work, not what we decided. `decisions/` records irreversible choices; `specs/` records what we're building; this directory records **how we run the loop**.

## Contents

| File | Purpose |
|---|---|
| [README.md](README.md) | This index. |
| [workflow.md](workflow.md) | Standard loop for non-trivial tasks: spec → implement → verify → commit. |
| [ui-review-checklist.md](ui-review-checklist.md) | Pre-delivery UI checklist (a11y, perf, motion, contrast, SEO). |
| [implementation-log.md](implementation-log.md) | Session-by-session record of what shipped, in chronological order. |
| [templates/](templates/) | Templates for session notes, retrospective entries. |

## Why this exists

Three forces push against consistent process on a solo repo:

1. **AI agents have per-session memory.** Each new session starts cold unless process docs anchor it. AGENTS.md + CLAUDE.md set ground rules; this directory sets the *workflow*.
2. **Stack moves fast.** A 6-month-old ADR can quietly rot. The implementation log + re-verification cadence (per ADR-0005) catch this before it bites.
3. **Small commits, frequent commits** only works if you can reconstruct the "why" later. The log captures the why.

## When to write something here

| Trigger | Write |
|---|---|
| You shipped a non-trivial batch (3+ files, ADR, spec) | Append to `implementation-log.md` |
| You learned a project-specific lesson ("always run `npm run verify` before X") | Edit `workflow.md` |
| You did a UI pass and want a reusable checklist | Edit `ui-review-checklist.md` |
| You want a structured retrospective | Use `templates/retrospective.md` |

## When NOT to write here

- One-line bug fixes → commit message suffices.
- Stack decisions → write an ADR in `docs/decisions/`.
- Feature specs → write a spec in `docs/specs/`.

This directory is **about process**, not about code or architecture. Keep code in `src/`, decisions in `docs/decisions/`, specs in `docs/specs/`.

## Relationship to AGENTS.md / CLAUDE.md

- `AGENTS.md` — vendor-neutral entrypoint, ground rules for any AI agent.
- `CLAUDE.md` — Claude Code-specific overrides (model defaults, subagent prefs, workflow rules).
- `docs/process/workflow.md` — the canonical loop every agent follows.
- `docs/process/implementation-log.md` — the historical record.

If `AGENTS.md` and `workflow.md` conflict, `AGENTS.md` wins for ground rules; `workflow.md` wins for step-by-step process.
