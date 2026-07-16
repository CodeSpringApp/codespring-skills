---
name: cs-create-prd
description: >
  Specialist for creating CodeSpring PRDs. Interactive — it lists the user's
  core features, asks which one and whether to generate a Frontend, Backend, or
  Both PRD, then deep-dives the real code and generates the PRD(s) and attaches
  them to the feature's bridge on the canvas. Use when the user wants a PRD /
  spec for a feature, or wants to document a feature so they can design new ones
  without duplicating code. Triggers, "create a PRD", "make a frontend PRD",
  "make a backend PRD", "generate PRDs for this feature", "document this feature
  in CodeSpring", "spec out X so I can design new features".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(node:*) Bash(curl:*)
metadata:
  author: codespring
  version: "0.1"
---

# Create a PRD in CodeSpring

A PRD gives CodeSpring a full, accurate understanding of how a feature works, so new features build on what exists instead of duplicating backend, re-creating a shared API route, or reinventing the design system. This skill makes the **Frontend** and/or **Backend** PRD for a chosen feature.

Shared knowledge is in the `codespring` skill's references: `references/analyze-codebase.md`, `references/mindmap-structure.md`, `references/prd-management.md`, `references/pitfalls.md`.

## 0. Connect first
`codespring auth status` + `codespring status`. Use the LOCAL `.codespring/config.json` projectId; print it. If the codebase isn't in CodeSpring yet, run `cs-import-codebase` first.

## 1. Ask what to generate (interactive)
Show the user their **core features** (from `codespring features` / the mindmap `node-features` items), then ask:
1. **Which feature?** (one, several, or all)
2. **Frontend, Backend, or Both?**
Wait for their choice unless they already said.

## 2. Deep-dive the real code for that feature
Read the actual code (don't guess). Use `analyze-codebase.md`:
- **Backend PRD** → architecture & structure, what the code does, API routes (**flag shared ones**), data model, reusable server actions/services, security (authz, validation, secrets, RLS, webhook signatures), external services + env, infra gotchas, and a "reuse this, don't rebuild it" map.
- **Frontend PRD** → design tokens (colors, corner radius, spacing, typography, shadows), component/UI styles + states, layout/positioning/spacing, what's on the page, and a concrete navigation/interaction map ("click X on page Y → route → shows this → looks like this"), plus cross-feature links.

Write the findings into the feature's note first — the generator uses it as context:
```bash
codespring mindmap note <coreFeatureId> --title "How it works — <Feature>" --text "$(cat note.txt)"   # redirect output to /dev/null
```

## 3. Generate (see prd-management.md)
```
POST /prds/generate  { projectId, bridgeNodeId: "bridge-feature-<featureId>", prdType: "frontend" | "backend" }
```
Timeout ≥120s (a client abort still creates the record → duplicates). For "Both", make two calls.

## 4. Attach to the canvas (see mindmap-structure.md)
Add `prdBridge → prdFrontend/prdBackend` nodes and `PUT /mindmaps/project/<projectId>`. For a **core** feature `prdBridge.data.featureId = "node-features"`; for a **sub-feature** it's that feature's sub-feature group node id. `itemId` = the selected feature id. If a `prdBridge` already exists for the feature, add the new PRD node to it instead of creating a second bridge.

## 5. Dedupe if needed + verify
If timeouts created duplicates: checkpoint then delete extras (`prd-management.md`). Then verify (see `pitfalls.md`): PRD content is real; the canvas shows the `prdBridge` + PRD node(s) with valid `prdId`; and `node-features` still has the right core-feature count (re-parent any flattened sub-features). Give the user their project link.

## What good looks like
- The user picked a feature + FE/BE/Both and got exactly that, attached to the feature's bridge.
- The Backend PRD captures architecture, routes, security and a clear reuse map; the Frontend PRD captures the design system, layout, and the concrete navigation path — both grounded in the real code.
