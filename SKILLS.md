# Skills status & tracker

Working tracker for the CodeSpring skill pack. `npx skills add CodeSpringApp/codespring-skills` installs **every** skill folder below in one go.

## Architecture

- **`codespring`** is the core skill — the shared knowledge base (how CodeSpring works + the CLI) plus the canonical `references/`. It's the "brain."
- **`cs-*`** skills are task specialists (playbooks) that build on that knowledge. They stay lean and point at the core skill's references (e.g. `references/mindmap-structure.md`) rather than duplicating them. They also chain: getting-started → import-codebase → create-prd → create-tasks → build-feature → resync-codebase.

## Skills

| Skill | Kind | Status | Version | Purpose |
|-------|------|--------|---------|---------|
| `codespring` | core | needs-review | 1.0 | How CodeSpring works + full CLI. Holds the canonical references. |
| `cs-getting-started` | specialist | draft | 0.1 | Connect the agent, then route: new-from-scratch vs import. |
| `cs-import-codebase` | specialist | draft | 0.3 | Map a repo → features/sub-features/notes; PRDs via `cs-create-prd`; then an independent read-only audit. |
| `cs-create-prd` | specialist | draft | 0.2 | Interactive: pick a feature, FE/BE/both, deep-dive code (incl. shared backend contracts), generate + attach PRDs. |
| `cs-create-tasks` | specialist | draft | 0.2 | Feature → numbered, prioritized, parallel-safe Kanban tasks with reuse/don't-break notes. |
| `cs-build-feature` | specialist | draft | 0.1 | Interactive build: readiness check → tasks → build (up to 5 sub-agents) with break-risk guards. |
| `cs-resync-codebase` | specialist | draft | 0.1 | Read-only-on-code staleness check; updates CodeSpring to match the built code. |
| `cs-market-research` | specialist | draft | 0.1 | Research an idea, identify the real wedge, and sync only the justified plan to CodeSpring. |
| `cs-website-foundation` | marketing | draft | 0.1 | Page inventory, proof map and a founder-facing NOW/NEXT/LATER/BLOCKED website workboard. |

## References (inside `skills/codespring/references/`)

| Reference | Status | Notes |
|-----------|--------|-------|
| `commands.md` | current | Full CLI reference. |
| `task-workflow.md` | current | Kanban execution patterns. |
| `analyze-codebase.md` | updated | Kept dependency/stack detection; ADDED sidebar→core, sub-features, backend depth (shared systems: payments/credits/refunds, jobs/cron, S3/storage, auth/RLS, env vars, render pipelines), frontend depth (design tokens, navigation), dependency/break-risk map. |
| `mindmap-structure.md` | updated | ADDED PRD bridge / prdFrontend / prdBackend node schema, handles, `featureId = node-features` rule. |
| `prd-management.md` | updated | ADDED PRD generation (`/prds/generate`), attach-to-canvas, dedupe (checkpoint), timeout caveat, spec-docs note. |
| `pitfalls.md` | new | Wrong-project, sub-feature flattening, duplicate PRDs, bridge metadata, notes-are-root-only, flowJson full-replace, auth, spec-docs. |
| `codespring-docs.md` | new | Pointers to the web app + live docs (generate PRD on the canvas, Kanban, install, journeys) so skills can guide users; fetch live docs for exact UI. |

## Other assets

- `claude-templates/` — agnostic `CLAUDE.md` starters by app type (web / iOS / macOS). Copy to a project root and fill placeholders. **TODO:** reconcile with real, battle-tested versions (currently generic v0.1).

## What "needs update" means here
Track staleness here. When the CLI adds a real `prd generate`/`prd create` command (today it's an API workaround), update `prd-management.md` + the specialists and drop the direct-API steps. Same when sub-feature notes, spec-documents, or task-linking to sub-features become first-class.

## Productized operating model

The skills are being expanded from CodeSpring planning into a dogfooded, end-to-end operating system for software companies: market decision → product planning → Ferb build → deploy/security/operations → offer → website foundation → SEO/AEO → content, carousel, and eventually video production. See [`docs/skill-suite-vision.md`](docs/skill-suite-vision.md) for the customer lifecycle, quality/approval rules, delivery-status language, and staged roadmap.

The first marketing capability should be **`cs-website-foundation`**, which maintains the site/page inventory and a founder-facing **NOW / NEXT / LATER / BLOCKED** workboard. It should be followed by general-purpose `cs-seo-setup`, then `cs-aeo-content` and `cs-content-operations`; avoid an oversized catch-all SEO skill.

## Backlog / to revisit
- **`cs-setup-github`** — teach the branch workflow (main / dev / feature branches) and repo setup so users get everything configured. (Requested; deferred as potentially complex.)
- **`cs-describe-feature`** / **`cs-visualize`** — interactive new-feature design; auto-map from a repo (both listed "upcoming" on the docs page).
- **Docs machine-readability** — `codespring-docs.md` + live WebFetch cover this for now; consider a stable machine-readable docs endpoint so skills don't guess UI.
- **CLAUDE.md templates** — replace the agnostic drafts with proven per-platform versions (strip anything project/person/branch-specific first).
- **Verify sub-feature task linking** — confirm `task create --feature <subFeatureId>` attaches to the sub-feature; update `cs-create-tasks` accordingly.
- **Promote mechanics into the CLI** so specialists can drop the direct-API steps.
