# CodeSpring + Ferb skills operating model

## Purpose

This repository is becoming a productized operating system for building and growing a software company with agents. The skills must document the repeatable work CodeSpring performs while running its own business, then let a Ferb customer follow the same workflow after buying the subscription.

The outcome is not a loose collection of prompts. A customer should be able to move from a market question to a secure, deployed, marketed application with clear next actions, proof of completion, and a durable operating record.

Ferb is the execution environment for building and operating the app. CodeSpring is the planning and product-management layer. Hermes and other compatible agents can run the reusable skills. Every skill must be useful internally first (dogfooded), then suitable for a customer with their own repository, analytics, credentials, and business context.

## Product principle

Ferb is positioned as a premium annual subscription (minimum $3,000/year). Its value must exceed a generic coding-agent subscription: it should coordinate the full operating workflow, preserve company context, provide trustworthy specialist playbooks, and make the founder's next best action obvious.

Do not design skills around tool usage alone. Design them around a completed business outcome, with:

- a clear trigger and intended user;
- required inputs and prerequisite checks;
- an ordered, auditable workflow;
- explicit approval boundaries for credentials, publication, spend, production changes, and customer-facing claims;
- verification evidence and precise status labels;
- an output that becomes useful context for the next skill.

## Skill-map architecture

Use lifecycle-family names for every new installable capability: `cs-<family>-<outcome>` (for example, `cs-marketing-seo` and `cs-build-feature`). The published installation surface remains flat in `skills/` until the exact default installer command has been smoke-tested against a nested package. This avoids discovering too late that a customer installation skipped a nested skill.

The source system is categorised from day one: `SKILLS.md` records family and maturity; [`docs/skill-governance-sop.md`](skill-governance-sop.md) is the mandatory routing and authoring SOP; and `AGENTS.md` makes it automatic for agents editing the repository. Use the core `codespring` skill for shared CodeSpring mechanics and references; specialist skills own one customer outcome and link to the shared core rather than duplicating it.

Use `docs/` for cross-cutting operating models, lifecycle maps, templates, acceptance criteria, and skill roadmaps. This preserves a small, discoverable installation surface while allowing a coherent marketing or operations system to span multiple specialist skills.

## Customer lifecycle and skill families

### 1. Discovery and market decision

**Outcome:** choose a credible customer, problem, wedge, and commercial angle before committing build effort.

- `cs-marketing-research` — competitors, substitutes, platform reality, demand evidence, positioning, and a build/adopt/do-not-build decision.
- Future: offer/customer research — interview synthesis, ICP selection, demand evidence, pricing hypotheses, and offer framing.

### 2. Product planning in CodeSpring

**Outcome:** a scoped build plan that a coding agent can safely execute.

- `cs-build-getting-started`
- `cs-build-import-codebase`
- `cs-build-create-prd`
- `cs-build-create-tasks`
- Future: positioning-to-PRD handoff and design/UX specification.

### 3. Build with Ferb

**Outcome:** an application is built in ordered, reviewable increments without losing product context or breaking shared systems.

- `cs-build-feature` — execution from readiness-checked CodeSpring tasks.
- Future: discrete Ferb build skills for repository setup, frontend, backend/data, integrations, migrations, testing, and code review. These must state ownership boundaries, commands, expected evidence, rollback constraints, and handoffs.

### 4. Deploy, secure, and operate

**Outcome:** a production-ready application with a verified release, known risks, and ownership of recurring operations.

- `cs-build-resync-codebase` — CodeSpring reflects the actual built state.
- Future: deployment readiness, security audit, observability, incident/release checks, backup/recovery, and cost/usage review.

Security and deployment skills must fail closed: identify the environment, authority, affected data, approval needed, and verification method before mutation. They must never convert an unverified local pass into a claim that production is secure or live.

### 4a. Build with CodeSpring Agents

**Outcome:** a published CodeSpring agent is connected to its application with the intended model route, capabilities and secure browser boundary, then proven by replay and UI smoke evidence.

- `cs-agent-setup` — environment and authentication, provider/model routing, immutable agent revision, skills/tools/MCP, scoped server and browser credentials, SDK/React integration, progressive generative UI, troubleshooting and an `AGENT_SETUP.md` verification receipt.
- Future agent-family skills should own genuinely separate outcomes such as a production channel deployment or recurring agent operations. Do not split individual MCPs, model providers or dashboard actions into top-level skills.

### 5. Offer, website, and acquisition

**Outcome:** the finished app has a clear offer, an indexable conversion path, a measurable content engine, and an ordered marketing backlog.

Create separate specialist skills rather than one oversized "SEO" skill:

- Future: `cs-offer-creation` — ICP, problem, promise, proof, packaging, pricing hypothesis, objections, landing-page brief, and conversion measurement.
- `cs-marketing-website` — information architecture, page inventory, purpose of every page, conversion paths, analytics, technical website baseline, and an explicit now/next/later workboard.
- Future: `cs-marketing-seo` — crawlability, metadata, canonicals, robots, sitemap, Search Console/analytics access, indexation baseline, keyword/query backlog, internal-link plan, and a measurement cadence.
- Future: `cs-marketing-aeo-content` — answer-engine-friendly source-backed pages, structured Q&A where genuinely useful, clear entity/product information, original evidence, and conversion paths. It must avoid empty "AEO hacks" or schema spam.
- Future: `cs-marketing-content` — Search Console-to-content loop, briefs, editorial calendar, quality gate, publish/review cycle, and status reporting.
- Future: `cs-carousel-production` — evidence-led carousels that link back to the relevant page and record assets, claims, platform status, and performance.
- Future: `cs-video-production` — later, only after a repeatable content and approval workflow exists.

The website foundation skill is the coordinator for founders who do not remember every page's purpose. It must maintain a page inventory with: URL/route, audience, job-to-be-done, primary CTA, owner, dependencies, lifecycle status, success metric, and next review date. Its output is a prioritised, dependency-aware workboard: **NOW**, **NEXT**, **LATER**, and **BLOCKED/AWAITING APPROVAL**.

SEO and AEO are complementary, not interchangeable. SEO earns discoverability through technically sound, useful pages aligned to search intent. AEO makes the same truthful source material easy to identify, quote, and navigate in answer engines. Both require original evidence, clear topical structure, accurate claims, internal links, and a real conversion path.

## Dogfooding loop

1. Run each proposed skill on CodeSpring/Ferb first.
2. Save the actual inputs, decisions, approval points, work performed, result, and verification evidence in the relevant product context.
3. Remove CodeSpring- or founder-specific assumptions and replace them with explicit inputs.
4. Add the proven workflow to this repository with a trigger, guardrails, acceptance checks, and handoffs.
5. Run it again on a fresh customer-shaped example before describing it as reusable.
6. Update the skill whenever a real execution exposes a missing prerequisite, unsafe assumption, stale command, or unclear output.

## Delivery and status language

Skills must distinguish planning from execution and never imply external completion without proof:

- **DRAFT** — proposed but not approved or executed.
- **READY** — prerequisites are present; execution may start.
- **IN PROGRESS** — work has started but required checks are incomplete.
- **AWAITING APPROVAL** — blocked on a human decision, credential, spend, publishing action, or production change.
- **QUEUED** — scheduled for a specific future run; not live.
- **SUBMITTED** — sent to a third party; not yet verified as live.
- **LIVE / VERIFIED** — public or production state independently checked, with URL, ID, timestamp, or test evidence.
- **BLOCKED** — cannot proceed; explain the concrete dependency and owner.

## Near-term roadmap

1. Preserve and review the existing CodeSpring-specific SEO prototype separately; it is on `feature/seo-website-operator` and is not currently merged into `main`.
2. Use `cs-marketing-website` first. It establishes the page inventory, site purpose, conversion paths, technical baseline, and the founder-facing NOW/NEXT/LATER operating board.
3. Build `cs-marketing-seo` from proven setup and technical-baseline work, generalised for customer sites rather than tied to CodeSpring's own repository or branch model.
4. Add `cs-marketing-aeo-content` and `cs-marketing-content` once the baseline and tracking access exist.
5. Connect offer creation and carousel production to the approved page and content briefs, so distribution promotes a clear offer rather than disconnected assets.
6. Add video only when there is a repeatable production, approval, publishing, and measurement loop.

## Definition of done for a reusable skill

A skill is ready to sell only when it has been dogfooded, produces a useful artifact, names its approval boundaries, checks its prerequisites, has a verification method, and states the exact handoff to the next skill. A skill that merely lists advice or tools is documentation, not an operating capability.
