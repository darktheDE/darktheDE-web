# CLAUDE.md

> Claude Code-specific overrides. Imports `AGENTS.md` for everything vendor-neutral.
> Personal scratchpad (gitignored): `CLAUDE.local.md`.

`@AGENTS.md`

## Model + effort defaults

- Default model: **Sonnet** for routine edits, tests, refactors.
- Use **Opus** for: architecture decisions, hard debugging, ambiguous spec interpretation, multi-file feature planning.
- Reasoning effort: medium by default. Low for mechanical edits. High only when problem genuinely warrants it.

## Subagent preferences

- **Codebase exploration / search:** use the `Explore` subagent — don't burn main context on Grep/Glob across large trees.
- **Plan / architecture design:** use the `Plan` subagent for non-trivial implementation plans.
- **Code review:** `/review` slash command after non-trivial changes.
- **Compressed output for routine work:** `cavecrew-investigator` (locate), `cavecrew-builder` (1-2 file edit), `cavecrew-reviewer` (diff review). Per [docs/process/workflow.md](docs/process/workflow.md) "When to delegate" section.
- Avoid spawning subagents for single-line edits or trivial questions.

## Working style

- **Verify before claiming done.** Run `npm run verify` (or relevant subset) before saying "done". Show the green output.
- **Small commits, frequent commits.** One logical change per commit. Don't bundle.
- **Read before edit.** Use Read tool on a file before editing it.
- **No silent side effects.** If you change a config, say so in the response. If you install a dep, list it. If you rename a file, explain.
- **Ask, don't assume.** If a spec is ambiguous or a decision feels irreversible, surface it. Default to `AskUserQuestion` for choices the user genuinely owns.

## Memory + log discipline

- Persistent memory lives at `~/.claude/memory/<project>/`. The user keeps a memory file per project there.
- After each substantive session, the user expects a memory update (see `MEMORY.md` index in that dir for what already exists).
- For this repo's process log, append a dated entry to `~/.claude/memory/<project>/2026-08-04-session-N-<topic>.md` when something meaningful happens (decision, blocker, retrospective).

## Workflow rules

1. **Spec before code** for any feature touching > 3 files or any irreversible decision. See [docs/process/workflow.md](docs/process/workflow.md) for the canonical loop.
2. **ADR before stack change.** Don't switch DB, framework, or host without an ADR in `docs/decisions/`.
3. **Verify before done.** `npm run verify` green = claim done.
4. **No scope creep.** Don't add features the user didn't ask for in this turn. Note them as suggestions at the end instead.
5. **Log after ship.** Append a dated entry to [docs/process/implementation-log.md](docs/process/implementation-log.md) after each non-trivial batch (≥ 3 files or any decision).

## Things to NEVER do in this repo

- Add a light mode toggle. Site is dark-only.
- Add marketing copy, AUC-ROC stats to the public hero, "industry-leading", etc.
- Touch the old `darktheDE-portfolio/` repo (treat as archive).
- Add an AI agent context block to public surface (re-confirmed policy after 2026-07 refactor in old repo).
- Ship without `npm run verify` passing.
- Use raw hex values in components — always Tailwind tokens.

## When in doubt

Re-read `AGENTS.md`. Then re-read `docs/decisions/`. Then ask the user.