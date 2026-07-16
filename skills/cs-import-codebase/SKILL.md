---
name: cs-import-codebase
description: >
  Import an existing codebase into CodeSpring as a visual feature map — core
  features (sidebar/nav pages) with nested sub-features, a "how it works" note
  per feature, and generated Frontend + Backend PRDs attached as bridge nodes —
  so CodeSpring understands the app and the user can design new features without
  duplicating what exists. Triggers, "import my codebase into CodeSpring", "map
  my existing app", "reverse engineer my app into features", "bring this project
  into CodeSpring", "visualize my code in CodeSpring".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(node:*) Bash(curl:*)
metadata:
  author: codespring
  version: "0.2"
---

# Import an existing codebase into CodeSpring

Turn a real repo into an accurate CodeSpring model: **core features → sub-features → notes → PRDs**, grounded in the code. This drives the CLI + API directly so the map lands in the user's account automatically.

Shared knowledge lives in the `codespring` skill's references — read them rather than re-deriving:
`references/analyze-codebase.md`, `references/mindmap-structure.md`, `references/prd-management.md`, `references/pitfalls.md`.

## 0. Connect first
`codespring auth status` (login if needed) and `codespring status` (link if needed). Use the projectId from the LOCAL `.codespring/config.json`, never the global one, and print it before writing. (See `pitfalls.md`.)

## 1. Definitions
- **Core feature** = highest-level unit, almost always a sidebar/nav item = a page. Read the sidebar/nav component first.
- **Sub-feature** = a capability nested under a core feature.
Card descriptions stay one sentence; depth goes in the note + PRDs.

## 2. Analyze the code (be accurate)
Follow `analyze-codebase.md`. Build a frontend map (routes, components, what the user sees, navigation) and a backend map (API routes + which features share them, data model, security, services, infra). Set the real tech stack. Read files; don't guess.

## 3. Build the map (CLI)
```bash
codespring mindmap set-info --title "..." --description "..." --github "<repo url>"
codespring mindmap tech-stack --replace --add '[{"id":"tech-...","title":"...","description":"Frontend"}, ...]'
codespring mindmap features --add '[{"title":"Dashboard","description":"..."}, ...]'   # CORE features; keep the returned ids
codespring feature create --parent <coreId> --title "..." --description "..."           # sub-features
codespring mindmap note <coreId> --title "How it works — X" --text "$(cat note.txt)"    # one note per core feature; redirect output to /dev/null
```
Write each core feature's note using the depth from `analyze-codebase.md` §8–9 — it becomes the PRD generator's context.

## 4. Generate + attach PRDs
Per `prd-management.md`: `POST /prds/generate { projectId, bridgeNodeId: "bridge-feature-<coreId>", prdType }` (timeout ≥120s), then attach the `prdBridge → prdFrontend/prdBackend` nodes (schema in `mindmap-structure.md`; remember `prdBridge.data.featureId = "node-features"` for core features) and `PUT /mindmaps/project/<projectId>`. Dedupe via checkpoint + delete if timeouts created duplicates.

> For a single feature, or to control frontend/backend/both interactively, use `cs-create-prd`.

## 5. Verify (see pitfalls.md)
- `node-features.items.length` still equals the real core-feature count (re-parent any flattened sub-features).
- Each targeted feature has real PRD content and a `prdBridge` with `prdFrontend`/`prdBackend` carrying a valid `prdId`.
- Give the user their project link: `https://v2.codespring.app/project/<projectId>`.

## What good looks like
CodeSpring holds an accurate map of the real app — right core features, nested sub-features, honest notes, and FE/BE PRDs on each feature — so new features can be designed without duplicating existing backend or shared routes.
