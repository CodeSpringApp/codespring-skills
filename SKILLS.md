# Skills status & tracker

Working tracker for the CodeSpring skill pack. `npx skills add CodeSpringApp/codespring-skills` installs **every** skill folder below in one go.

## Architecture

- **`codespring`** is the core skill — the shared knowledge base (how CodeSpring works + the CLI) plus the canonical `references/`. It's the "brain."
- **`cs-*`** skills are task specialists (playbooks) that build on that knowledge. They stay lean and point at the core skill's references (e.g. `references/mindmap-structure.md`) rather than duplicating them.

## Skills

| Skill | Kind | Status | Version | Purpose |
|-------|------|--------|---------|---------|
| `codespring` | core | needs-review | 1.0 | How CodeSpring works + full CLI. Holds the canonical references. |
| `cs-getting-started` | specialist | draft | 0.1 | Connect the agent, then route: new-from-scratch vs import. |
| `cs-import-codebase` | specialist | draft | 0.2 | Map an existing repo → features/sub-features/notes + FE/BE PRDs. |
| `cs-create-prd` | specialist | draft | 0.1 | Interactive: pick a feature, FE/BE/both, deep-dive code, generate + attach PRDs. |
| `cs-create-tasks` | specialist | draft | 0.1 | Turn PRDs/features into an ordered Kanban task list. |

## References (inside `skills/codespring/references/`)

| Reference | Status | Notes |
|-----------|--------|-------|
| `commands.md` | current | Full CLI reference. |
| `task-workflow.md` | current | Kanban execution patterns. |
| `analyze-codebase.md` | updated | Kept dependency/stack detection; ADDED sidebar→core features, sub-features, backend depth (shared routes, security, infra), frontend depth (design tokens, navigation). |
| `mindmap-structure.md` | updated | ADDED PRD bridge / prdFrontend / prdBackend node schema, handles, and `featureId = node-features` rule. |
| `prd-management.md` | updated | ADDED PRD generation (`/prds/generate`), attach-to-canvas, dedupe (checkpoint), timeout caveat, spec-docs note. |
| `pitfalls.md` | new | Wrong-project, sub-feature flattening, duplicate PRDs, PRD-bridge metadata, notes-are-root-only, flowJson full-replace, auth, spec-docs. |

## What "needs update" means here
Use this file to track staleness. When the CLI adds a real `prd generate` command (today it's an API workaround), update `prd-management.md` + the specialists and drop the API notes. Same when sub-feature notes or spec-documents become CLI-accessible.

## Backlog / ideas
- `cs-describe-feature` — interactive design of a brand-new feature (docs list this as upcoming).
- `cs-visualize` — auto-generate the full map from a repo with minimal prompting (docs list this as upcoming).
- Promote canonical mechanics into the CLI so the specialists can drop the direct-API steps.
