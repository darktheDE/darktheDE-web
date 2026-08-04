# Feature Specs

One Markdown file per non-trivial feature. Written **before** implementation.

## When to write one

- New route or new page.
- New component used in 2+ places.
- New data model / schema.
- Anything that touches > 3 files.
- Anything you'd want to think twice about.

When in doubt: **write the spec**. A 10-minute spec saves a 2-hour refactor.

## When NOT to write one

- Typo fix.
- Copy tweak.
- Single-component styling change.
- 1-2 file refactor with no behavior change.

Just ship it. Don't ceremony-fy.

## Format

`NNN-<slug>.md` where `NNN` is a 3-digit zero-padded sequence. Use `docs/specs/templates/feature.md` as the starting point.

## Lifecycle

1. **Draft** — being written, requirements still firming up.
2. **Active** — approved, implementation in progress.
3. **Done** — feature shipped, verification step passed.
4. **Cancelled** — decided not to do, kept for history.

Move between states by updating the Status field at the top.

## Index

| # | Title | Status |
|---|---|---|
| [001](001-portfolio-rebuild.md) | Portfolio + Blog rebuild from scratch | Active |
