# Skills status & tracker

Working tracker for the CodeSpring skill pack. `npx skills add CodeSpringApp/codespring-skills` installs **every** skill folder below in one go.

## Architecture

- **`codespring`** is the core CodeSpring skill — shared CodeSpring mechanics, CLI, and canonical references. It intentionally keeps its existing name and folder.
- Every other `cs-*` skill belongs to a lifecycle family and uses `cs-<family>-<outcome>`. This makes the package navigable without relying on unverified nested installer discovery.
- One skill owns one completed capability. Detailed subflows live in its `references/`, reusable outputs in `templates/`, and deterministic helpers in `scripts/`.

## Skills

| Skill | Family | Maturity | Version | Purpose |
|-------|--------|----------|---------|---------|
| `codespring` | core | needs-review | 1.0 | CodeSpring CLI and shared planning mechanics. |
| `cs-build-getting-started` | build | draft | 0.1 | Connect the agent, then route new projects or existing codebases into the build workflow. |
| `cs-build-import-codebase` | build | draft | 0.3 | Map a codebase into CodeSpring features, notes, and PRDs; independently audit the map against the code. |
| `cs-build-create-prd` | build | draft | 0.2 | Create a frontend, backend, or combined PRD from a real feature and codebase. |
| `cs-build-create-tasks` | build | draft | 0.2 | Turn a feature plan into numbered, prioritised, parallel-safe build tasks. |
| `cs-build-feature` | build | draft | 0.1 | Readiness-check and execute CodeSpring build tasks without breaking shared systems. |
| `cs-build-resync-codebase` | build | draft | 0.1 | Re-sync CodeSpring plans with the real code after building. |
| `cs-marketing-research` | marketing | draft | 0.1 | Research market demand, alternatives, positioning, and a defensible wedge before committing work. |
| `cs-marketing-website` | marketing | dogfooding | 0.1 | Build and maintain the page inventory, proof map, conversion paths, and founder-facing NOW/NEXT/LATER/BLOCKED website workboard. |
| `cs-marketing-seo` | marketing | dogfooding | 0.1 | Establish verified crawl/index health, query-led page priorities, honest discovery and a measurable SEO review loop. |

## References (inside `skills/codespring/references/`)

| Reference | Status | Notes |
|-----------|--------|-------|
| `commands.md` | current | Full CLI reference. |
| `task-workflow.md` | current | Kanban execution patterns. |
| `analyze-codebase.md` | updated | Dependency/stack detection, sidebar→core, sub-features, shared backend systems, frontend depth, and break-risk map. |
| `mindmap-structure.md` | updated | PRD bridge / frontend / backend node schema and handles. |
| `prd-management.md` | updated | PRD generation, attachment, dedupe, timeout caveat, and spec docs. |
| `pitfalls.md` | current | Wrong-project, flattened sub-features, duplicate PRDs, bridge metadata, and auth guardrails. |
| `codespring-docs.md` | current | Live web-app/documentation pointers. |

## Skill governance

Before adding or changing a skill, follow [`docs/skill-governance-sop.md`](docs/skill-governance-sop.md). It assigns a lifecycle family, prevents duplicate micro-skills, enforces the skill-size rule, and makes `AGENTS.md` the automatic routing rule for agents working in this repository.

## Productized operating model

The skills are being expanded into a dogfooded operating system for a software company: market decision → build planning → Ferb build → deployment/security/operations → offer → website → SEO/AEO → content, carousel, and eventually video production. See [`docs/skill-suite-vision.md`](docs/skill-suite-vision.md) for the lifecycle, quality rules, delivery-status language, and staged roadmap.

The first marketing capability is **`cs-marketing-website`**, which maintains the page inventory and a founder-facing **NOW / NEXT / LATER / BLOCKED** workboard. **`cs-marketing-seo`** is now dogfooding the technical baseline, query-to-content, discovery and measurement system; AEO/content operations follow as focused capabilities.

## Backlog / to revisit

- **`cs-marketing-seo`** — continue dogfooding setup, technical baseline, Search Console, page briefs, and measurement loop using the website workboard.
- **`cs-marketing-aeo-content`** — source-backed answer-led resource pages after the SEO foundation exists.
- **`cs-marketing-carousel`** — evidence-led carousel creation tied to an approved page/content brief.
- **`cs-release-production-readiness`** and **`cs-release-security-audit`** — deployment, production evidence, and security controls.
- **`cs-setup-github`** — repository setup and branch workflow.
- **Docs machine-readability** — consider a stable machine-readable docs endpoint once needed.
- **CLAUDE.md templates** — replace generic drafts with proven per-platform versions.
- **Promote mechanics into the CLI** so specialists can drop direct API workarounds.
