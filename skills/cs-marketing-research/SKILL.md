---
name: cs-marketing-research
description: >
  Research a product idea before committing it to a CodeSpring build plan. Finds
  direct competitors, open-source projects, substitutes, and relevant platform
  capabilities; separates commodity features from a defensible wedge; then
  records an evidence-backed recommendation and creates only the scoped feature
  and tasks worth building. Use when the user asks whether an idea already
  exists, requests market or competitor research, asks what would make a
  product unique, or wants to validate an idea before creating a PRD or tasks.
---

# Market research for CodeSpring ideas

## Overview

Turn a vague product idea into a decision: do not build, use or integrate an
existing solution, or pursue a focused wedge. Treat research as a planning
gate, not as a way to justify building a duplicate.

## 1. Frame the job to be done

- Restate the desired outcome, target user, platform, and constraints.
- Identify the smallest complete workflow, including the moment the user gets
  value. Do not research a feature list before identifying that workflow.
- Name the unproven assumptions that change the decision, such as whether an
  API exists, whether an existing tool automates the workflow, and whether the
  requested platform matters.

## 2. Research the market and technical reality

- Search for direct products, open-source repositories, platform-native
  features, and adjacent substitutes. Prefer primary sources: product docs,
  source repositories, release notes, and source code.
- For each serious alternative, record: intended user, exact overlapping
  workflow, interaction model, maturity signals, license or pricing, and
  meaningful gaps. Verify claimed capabilities from the source; do not rely on
  search snippets alone.
- Check relevant platform and API documentation before proposing automation.
  Flag unsupported, brittle, credential-scraping, or GUI-injection approaches.
- Do not call an idea unique merely because its UI, programming language, or
  name differs. It is only a wedge when it changes the outcome, audience,
  distribution, or integration surface.

## 3. Make a recommendation

Choose one outcome and state it plainly:

- **Do not build:** an existing solution directly satisfies the job.
- **Adopt or integrate:** use an existing tool and build only the missing
  integration or workflow layer.
- **Build a wedge:** define one narrow user, outcome, and capability that the
  alternatives do not offer.

For a build recommendation, give a one-sentence positioning statement, MVP
boundary, non-goals, risks, and the evidence behind the choice. Avoid a generic
feature comparison dump.

## 4. Sync the decision to CodeSpring

- Read project context, relevant features, mindmap, PRDs, and existing tasks
  before changing CodeSpring. Reuse a suitable existing feature where possible.
- Add an evidence-backed mindmap note with research date, sources, decision,
  alternatives considered, and explicitly rejected scope.
- Create or update a feature only when the recommendation is to build a wedge
  or an integration. Do not create a feature for a commodity clone.
- Create a small dependency-linked task list only after the MVP boundary is
  clear. Each task must state what it may touch, what it must not touch, and
  how to verify it. Use existing CodeSpring task conventions.
- If the recommendation is adoption, create a single evaluation or integration
  task rather than pretending a new application needs to be built.

## Output

Return a short research memo with:

- Decision and confidence.
- Direct alternatives and exact overlap.
- Proposed wedge or reason not to build.
- MVP, non-goals, and top risks.
- CodeSpring changes made, including task order.
