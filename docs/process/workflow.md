# Workflow — standard loop

The canonical sequence for non-trivial tasks. Trivial tasks (typo, copy tweak, 1-2 file edit) skip most of this.

## Decision tree first

Before writing anything, classify the task:

| If the task is... | Then... |
|---|---|
| Typo, copy tweak, single-component style | Ship directly. Commit. Skip the rest. |
| 1-2 files, no behavior change, refactor | Ship with a clear commit message. No spec needed. |
| 3+ files, new feature, schema change, stack change | **Spec first**, then implement. |
| Irreversible decision (stack swap, schema migration, API shape) | **ADR first**, then spec, then implement. |
| You don't know which bucket | Default to "spec first". 10-min spec saves 2-hour refactor. |

## The loop (for non-trivial tasks)

```
1. SPEC (if applicable)
   └─ docs/specs/NNN-<slug>.md
   └─ Status: Draft → Active when starting work

2. ADR (if stack/schema/IRREVERSIBLE)
   └─ docs/decisions/NNNN-<slug>.md
   └─ Status: Proposed → Accepted

3. IMPLEMENT
   └─ Small commits. Conventional Commits (feat/fix/chore/docs/refactor/test).
   └─ One logical change per commit. Don't bundle.
   └─ No raw hex in components. No raw hex in commits either.

4. VERIFY
   └─ npm run verify (typecheck + build)
   └─ Manual smoke test of changed routes
   └─ Update spec status: Active → Done

5. LOG
   └─ Append to docs/process/implementation-log.md
   └─ One paragraph: what shipped, why, any leftovers.

6. COMMIT + PUSH (only after user OK)
   └─ Don't auto-commit. Don't auto-push. User owns git.
```

## Hard rules

1. **No silent side effects.** If you install a dep, list it in the response. If you rename a file, say so.
2. **Read before edit.** Use Read on any file you haven't seen this session before editing it.
3. **Ask before assuming.** Spec ambiguity → AskUserQuestion. Don't fabricate answers to save tokens.
4. **Verify before "done".** Run `npm run verify`. Paste the green output. No "should work" without proof.
5. **No scope creep.** Don't add features the user didn't ask for. Note them as suggestions at the end.
6. **Small, frequent commits.** User commits themselves per repo convention; agent proposes commit messages.

## Where things live

| Thing | Location |
|---|---|
| Ground rules for any AI agent | `AGENTS.md` |
| Claude Code-specific overrides | `CLAUDE.md` |
| Architecture decisions | `docs/decisions/` |
| Feature specs | `docs/specs/` |
| Process + workflow + history | `docs/process/` (this directory) |
| Per-session memory | `~/.claude/memory/<project>/` (user-managed) |

## Common failure modes (from karpathy-skills)

Watch for these — they're how AI sessions silently go wrong:

1. **Overcomplication.** Adding abstractions the user didn't ask for. If 5 lines works, don't write 50.
2. **Mysterious refactors.** "While I was there I also..." — no. Touch only what the task requires.
3. **Unverified assumptions.** "This should work" without `npm run verify`. Always verify.
4. **Skipping the spec.** Multi-file changes without `docs/specs/NNN-*` — leads to rework.
5. **Scope drift.** Adding features the user implied might be nice. Don't.

## When to delegate to a subagent

| Task | Subagent | Why |
|---|---|---|
| Locate code across many files | `Explore` or `cavecrew-investigator` | Save main context. |
| Plan architecture | `Plan` | Independent design pass. |
| 1-2 file surgical edit | `cavecrew-builder` | Compressed output. |
| Review diff / PR | `cavecrew-reviewer` or `/review` | Independent perspective. |
| Anything else | Do it inline. Subagent overhead rarely pays off. |

Don't spawn subagents for single-line edits or trivial questions — overhead > savings.
