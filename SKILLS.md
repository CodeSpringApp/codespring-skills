# Skills status & tracker

**Looking for which skill to run? Read [`JOURNEYS.md`](JOURNEYS.md)** — the two journeys (idea → app, codebase → fixed app) and a one-line-each table. This file is the internal status tracker.

Working tracker for the CodeSpring skill pack. `npx skills add CodeSpringApp/codespring-skills` installs **every** skill folder below in one go.

## Architecture

- **`codespring`** is the core skill — the shared knowledge base (how CodeSpring works + the CLI), the canonical `references/`, and the `scripts/` that make the repeatable checks deterministic. It's the "brain." It intentionally keeps its existing name and folder.
- **Every other skill belongs to a lifecycle family** and is named `cs-<family>-<outcome>`. Families today: **build** (idea or codebase → shipped app), **marketing** (demand, offer, website), **seo**. The family prefix makes the package navigable without relying on unverified nested installer discovery.
- **One skill owns one completed capability.** Detailed subflows live in its `references/`, reusable outputs in `templates/`, deterministic helpers in `scripts/`. Family skills stay lean and point at the core skill's references (e.g. `references/mindmap-structure.md`) rather than duplicating them.

The build family chains:

```
getting-started ─┬─ plan-app ──────────┐
                 ├─ audit-codebase ─┐  │
                 └─ import-codebase ─┴──┴─► ui-mockup ─► create-prd ─► create-tasks ─► handoff ─► feature ─► resync-codebase
```

**Understand** (is there code, is it any good, what is it) → **Show** (a mockup the client can react to) → **Plan** (PRDs, tasks) → **Hand over** → **Build** → **resync**.

### Routing: two questions, not a decision tree

There is no wrapper skill. Entry is decided by two questions:

1. **Is there code?** No → plan from scratch. Yes → question 2.
2. **Does it do the job?** Asked as **five specific questions**, never as the meaningless *"do you trust the code?"*:
   1. Does the app do what it actually needs to do?
   2. Is it getting things wrong, or presenting made-up or unverifiable figures as fact?
   3. Does the current architecture allow it to do what it needs to do?
   4. Can we build on it scalably?
   5. Can users use it without it breaking?

   **All five yes → `cs-build-import-codebase`. Any no → `cs-build-audit-codebase`.** *"The code runs" is not the same as "the code does the job"* — a vibe-coded app often runs fine and still fails 1–3. Canonical wording: `codespring/references/project-state.md`.

### State-aware entry — every skill can be entered from anywhere

The user should never have to know which skill to run. **Every skill opens with the same state-detection block** (`project-state.md`, executed by `codespring/scripts/`), prints one line of state, and then does the right *next* thing rather than the thing its own name implies — an audit against a project that already has a good map updates that map instead of building a second one; an import that smells a broken codebase offers the audit first. The seam that matters: a PRD reads the note that Understand wrote, so a thin note produces a thin PRD.

### Checks are scripts; judgements are prose

Anything that must give the same answer every run is a script in `codespring/scripts/` (state detection, map validation, post-write verification) or `cs-build-audit-codebase/scripts/` (git/delivery reality). All read-only. Anything needing reasoning — *is this map good? fix or rebuild?* — stays prose in the SKILL.md and the references.

## Skills

| Skill | Family | Status | Version | Purpose |
|-------|--------|--------|---------|---------|
| `codespring` | core | needs-review | 1.1 | How CodeSpring works + full CLI. Holds the canonical references and the deterministic scripts. |
| `cs-build-getting-started` | build | draft | 0.4 | Connect, report state from the scripts, route on the five questions (import vs audit vs plan-from-scratch). |
| `cs-build-plan-app` | build | draft | 0.7 | **No code yet.** Idea or call recording → **what tool are they set on building in (asked first — it can invalidate the platform)**, job, walked journey, **every kind of user + the owner's admin surface**, platform call, inherited stack, the one hard part + prior art (licence-checked), **the systems checks (stale reference data, shared logic, whose database, freshness in the UI)**, v1 cut → gate → map + notes, then hands to `cs-build-ui-mockup`. The other entry door alongside import/audit. Owns the new-project-directory trap. |
| `cs-build-audit-codebase` | build | draft | 0.2 | Run the app, parallel specialists, git/delivery reality, self-audit of own claims, plain-English `FINDINGS.md`, rebuild-or-fix verdict with the has-users gate. |
| `cs-build-import-codebase` | build | draft | 0.5 | Map a repo → features/sub-features/notes; owns the map-quality ladder + node model; PRDs via `cs-build-create-prd`; findings-derived tasks. |
| `cs-build-ui-mockup` | build | draft | 0.1 | **Plan → clickable local mockup.** Token-driven design system with light/dark, one screen per core feature, a `/styleguide` page, then the review that catches order, hierarchy and incomplete choices — and writes corrections back into notes and tasks. Runs after the notes, before the PRDs. |
| `cs-build-create-prd` | build | draft | 0.2 | Interactive: pick a feature, FE/BE/both, deep-dive code (incl. shared backend contracts), generate + attach PRDs. |
| `cs-build-create-tasks` | build | draft | 0.2 | Feature → numbered, prioritised, parallel-safe Kanban tasks with reuse/don't-break notes. |
| `cs-build-handoff` | build | draft | 0.1 | **The plan is the product — this is the delivery.** Plain-English client pack: what we're building, the mockup, build order as phases, assumptions, open questions, what they owe, and what to do next. Runs after `cs-build-create-tasks`. |
| `cs-build-feature` | build | draft | 0.1 | Interactive build: readiness check → tasks → build (up to 5 sub-agents) with break-risk guards. |
| `cs-build-resync-codebase` | build | draft | 0.1 | Read-only-on-code staleness check; updates CodeSpring to match the built code. |
| `cs-marketing-research` | marketing | draft | 0.1 | Research market demand, alternatives, positioning, and a defensible wedge before committing work. |
| `cs-marketing-offer-creation` | marketing | draft | 0.2 | Customer-call offer briefs or Meta Ad Library teardowns: one buyer, specific result, real obstacle, claim ledger and clear front/back-end terms. Keeps ad observations separate from profit proof; hands approved copy to website work. Call-informed path reviewed against founder iteration, not yet independently forward-tested. |
| `cs-marketing-website` | marketing | dogfooding | 0.1 | Build and maintain the page inventory, proof map, conversion paths, and founder-facing NOW/NEXT/LATER/BLOCKED website workboard. |
| `cs-seo-website` | seo | dogfooding | 0.5 | CodeSpring SEO daily desk: targets evidence-gated review pages, uses founder-grounded plain-English tutorials with complete causal examples, supplies remote previews, then hands approved URLs into indexing verification. |

## References (inside `skills/codespring/references/`)

| Reference | Status | Purpose |
|-----------|--------|---------|
| `project-state.md` | new | **Start here.** The state-detection block so any skill can be entered from anywhere; the five questions that decide whether code is worth building on; Understand → Plan → Build and the seam between them; two-projects-for-one-app; the quick health smell test. |
| `auditing-and-fixing.md` | new | The reasoning behind the whole audit pipeline: audit → verdict → map → tasks; where audit errors actually come from (the orchestrator's own summarising); the moving-target/git reality; the rebuild-vs-fix table **and the has-users gate**; defect categories; the three buckets and where future ideas live; idempotency + verification; FERB edge cases. |
| `commands.md` | current | Full CLI reference. |
| `task-workflow.md` | current | Kanban execution patterns. |
| `analyze-codebase.md` | updated | Kept dependency/stack detection; ADDED sidebar→core, sub-features, backend depth (shared systems: payments/credits/refunds, jobs/cron, S3/storage, auth/RLS, env vars, render pipelines), frontend depth (design tokens, navigation), dependency/break-risk map. |
| `mindmap-structure.md` | updated | ADDED PRD bridge / prdFrontend / prdBackend node schema, handles, `featureId = node-features` rule. |
| `prd-management.md` | updated | ADDED PRD generation (`/prds/generate`), attach-to-canvas, dedupe (checkpoint), timeout caveat, spec-docs note. |
| `pitfalls.md` | new | Wrong-project, sub-feature flattening, duplicate PRDs, bridge metadata, notes-are-root-only, flowJson full-replace, auth, spec-docs, `features --replace` appends, no project delete/move. |
| `codespring-docs.md` | new | Pointers to the web app + live docs (generate PRD on the canvas, Kanban, install, journeys) so skills can guide users; fetch live docs for exact UI. |

### Skill-local references

| Reference | Skill | Purpose |
|-----------|-------|---------|
| `specialist-briefs.md` | `cs-build-audit-codebase` | Copy-ready, self-contained briefs for the parallel audit fan-out (security, database, core logic, frontend/UX, architecture) plus the repo/delivery commands the orchestrator runs itself. |
| `plain-english-writeup.md` | `cs-build-audit-codebase` | The `FINDINGS.md` deliverable: voice rules (third-grade reading level, no file paths, no jargon), the section-by-section structure, the two future-ideas sections, and the quality bar. |
| `target-map.md` | `cs-build-import-codebase` | The map rules: the **node model** (features node → card → bridge → note card / PRD bridge), the one-sentence-card rule, the **map-quality ladder** and the two-projects trap, the corrected-target decision, and how to keep the feature set to 4–8. **Shared — `cs-build-plan-app` uses it too.** |
| `elicitation.md` | `cs-build-plan-app` | Getting the real app out of a person's head and out of a recording: extract-don't-summarise, keep their numbers and phrasing, the walk-the-screens script, sidebar-first, questions that work and don't, handling "I saw it on Instagram", dictation vs substitution. |
| `platform-choice.md` | `cs-build-plan-app` | Mac vs web vs mobile decided on **capability**; **the constraint that overrules it — what the owner can actually build in and maintain** (AI web-builders cannot emit native apps); why iOS is almost never a v1; the three different things people mean by "offline"; and the consequences to state out loud — signing/notarization, distribution, updates, payment, the privacy angle. |
| `hard-part-first.md` | `cs-build-plan-app` | Every app has one hard thing — name it, search prior art (platform-native first), **check the licence** (the worked pose-estimation example where the top two search results were both commercially unusable) plus the permissive-vs-copyleft table that dissolves the "can I sell with Apache-2.0?" fear, make it task #1 as a spike with a written pass/fail threshold, design the fallback, **make feedback show progress not judgement**, and the extra rules when the client is a licensed professional. |
| `data-and-shape.md` | `cs-build-plan-app` | The five systems questions nobody asks for, each phrased as a question to ask in the Think phase: **reference data that goes stale**; **shared logic across products**; **every actor** (the customer's customer, the owner, the near-universal admin surface, plans/tiers, permissions enforced in the database and on the server); **whose database this lives in**; and **freshness/provenance in the interface**. |
| `v1-scope.md` | `cs-build-plan-app` | One loop whole; cut breadth not depth; **doing features vs tracking features** (the most common way an idea-plan goes wrong); the revenue gate; when the real cost is content rather than code; naming the cuts. |
| `design-system.md` | `cs-build-ui-mockup` | **Build before any screen.** Semantic colour tokens, light/dark from day one, one spacing scale, a radius scale with stated relationships (nested corners step down), type scale and line height, components with every state, navigation patterns, motion budget, and how to make the brand swappable — plus the `/styleguide` page. |
| `review-method.md` | `cs-build-ui-mockup` | Why a written plan cannot express a focal point; what to build (real copy, plausible data, responsive controls); how to run the review **without narrating**; the table of what mockups reliably catch and prose never does; feeding corrections back as note reasons and task blocks; expect two rounds. |

## Scripts

| Script | Skill | Purpose |
|--------|-------|---------|
| `scripts/fetch-project.sh` | `codespring` | Read-only snapshot of the linked project (mindmap, features, PRDs, tasks) into a disposable directory; prints the projectId from the **local** config. |
| `scripts/state.mjs` | `codespring` | The state-detection summary line + booleans and counts, identical every run. |
| `scripts/check-map.mjs` | `codespring` | The machine-checkable half of map quality and post-write verification: core-feature count, duplicate titles, flattened sub-features, missing notes, duplicate PRDs, unlinked tasks. Exit 1 = failure, 2 = warnings. |
| `scripts/parse.mjs` | `codespring` | Shape-tolerant readers for the CLI's JSON (shared by the two above). |
| `scripts/check-repo.sh` | `cs-build-audit-codebase` | Git/delivery reality: the commit the findings apply to, how far behind the remote, what's in flight on other branches, dirty tree, whether any check gates deploy, and per-path history to tell "unreferenced" from "unfinished". |

## Skill governance

Before adding or changing a skill, follow [`docs/skill-governance-sop.md`](docs/skill-governance-sop.md). It assigns a lifecycle family, prevents duplicate micro-skills, enforces the skill-size rule, and makes `AGENTS.md` the automatic routing rule for agents working in this repository.

## Productized operating model

The skills are being expanded into a dogfooded operating system for a software company: market decision → build planning → Ferb build → deployment/security/operations → offer → website → SEO/AEO → content, carousel, and eventually video production. See [`docs/skill-suite-vision.md`](docs/skill-suite-vision.md) for the lifecycle, quality rules, delivery-status language, and staged roadmap.

## Backlog / to revisit

- **A home for future ideas.** CodeSpring has features, notes, PRDs and tasks but **no surface for "things we might build later"**, and they must never be written as tasks (a task list implies committed work). Interim convention: two named sections in the repo's `FINDINGS.md`. Product gap — worth solving in CodeSpring/FERB.
- **Two projects for one app.** There is no `project delete` and no way to merge or move a project, so a map that had to be replaced rather than repaired leaves two projects behind forever. Needs either archive/delete, or a way to reset a project's map.
- **`cs-marketing-aeo-content`** — source-backed answer-led resource pages after the SEO foundation exists.
- **`cs-marketing-carousel`** — evidence-led carousel creation tied to an approved page/content brief.
- **`cs-release-production-readiness`** and **`cs-release-security-audit`** — deployment, production evidence, and security controls.
- **`cs-setup-github`** — teach the branch workflow (main / dev / feature branches) and repo setup so users get everything configured. Now more clearly needed: non-technical owners commit straight to `main` while an audit or rebuild is in flight.
- **`cs-describe-feature`** / **`cs-visualize`** — interactive new-feature design; auto-map from a repo (both listed "upcoming" on the docs page).
- **Docs machine-readability** — `codespring-docs.md` + live WebFetch cover this for now; consider a stable machine-readable docs endpoint so skills don't guess UI.
- **CLAUDE.md templates** — replace the agnostic drafts with proven per-platform versions (strip anything project/person/branch-specific first).
- **Verify sub-feature task linking** — confirm `task create --feature <subFeatureId>` attaches to the sub-feature; update `cs-build-create-tasks` accordingly.
- **Pin the CLI's JSON envelope.** `scripts/parse.mjs` is deliberately shape-tolerant because the JSON shape isn't documented; once it is, tighten the parsers and drop the fallbacks.
- **Promote mechanics into the CLI** so specialists can drop the direct-API steps.
