# Mindmap Structure Reference

## Node Types

### Primary Node (`node-primary`)
Central project node. Fields: `title`, `description`, `githubUrl`.

### Secondary Nodes
Major category branches from primary:
- `node-features` — Features list (items array) — holds the **CORE features**
- `node-tech-stack` — Technology stack (items array, grid layout)
- `node-competitors` — Market competitors
- `node-audience` — Target audience
- **Sub-feature group nodes** — one per core feature; each holds that feature's sub-features. Its `data.parentFeatureId` = the core feature id.

Data structure for list nodes:
```json
{
  "title": "Features",
  "subtitle": "Core functionality",
  "handlePosition": "left",
  "layout": "list",
  "items": [
    { "id": "feature-auth", "title": "Authentication", "description": "User login" }
  ]
}
```

Sub-feature items carry `parentFeatureId`:
```json
{ "id": "feature-signup", "title": "Sign up", "description": "Email signup", "parentFeatureId": "feature-auth" }
```

### Bridge Nodes
Connector between a feature item and its detail nodes.
- ID pattern: `bridge-feature-{featureId}` (note the doubled `feature-feature` when a featureId already starts with `feature-`)
- Data: `{ featureId, count, isExpanded, handlePosition }`

### Tertiary Nodes
Detail nodes attached via a bridge:
- **Notes**: `notes-{featureId}` with `{ type: "notes", title, content }` — created by `codespring mindmap note`.
- **PRDs**: attached through a **PRD Bridge** (see below), not as a plain tertiary node.

## PRD Bridge & PRD Nodes

PRDs render on the canvas as a small sub-graph hanging off a feature's bridge:

```
feature bridge  →  prdBridge  →  prdFrontend
                            \→  prdBackend
```

### `prdBridge` node
- Type: `prdBridge`
- ID: `prdBridge-{bridgeNodeId}` (e.g. `prdBridge-bridge-feature-feature-123`)
- Data:
  - `title`: `"PRD Bridge"`
  - `itemId`: the **selected feature card id** (the core feature, or the sub-feature)
  - `featureId`: the **container node that holds that card** — this is the field the PRD generator uses to locate the feature:
    - For a **core feature** → `"node-features"`
    - For a **sub-feature** → that feature's **sub-feature group node id**
  - `isCollapsed`: `false`, `generatingType`: `null`, `handlePosition`: `"left"`
- **Common failure:** setting `featureId` to the feature card's own id gives *"Features node not found in mindmap"* on generation. It must point to the container node.

### `prdFrontend` / `prdBackend` nodes
- Type: `prdFrontend` or `prdBackend`
- ID: `prdFrontend-{unique}` / `prdBackend-{unique}`
- Data: `{ prdId: "<PRD record id>", title: "Frontend PRD" | "Backend PRD", isGenerating: false, handlePosition: "left" }`

## Edge / Handle Patterns

### Features → Bridge
```
source: "node-features"
target: "bridge-feature-{featureId}"
sourceHandle: "node-features-source-{featureId}"
targetHandle: "bridge-feature-{featureId}-target-{featureId}"
```

### Bridge → Notes
```
source: "bridge-feature-{featureId}"
target: "notes-{featureId}"
sourceHandle: "bridge-feature-{featureId}-source-notes"
targetHandle: "notes-{featureId}-target-notes"
```

### Bridge → PRD Bridge → PRD nodes
```
# feature bridge → prdBridge
source: "{bridgeNodeId}"       target: "prdBridge-{bridgeNodeId}"
sourceHandle: "{bridgeNodeId}-source-prd"
targetHandle: "prdBridge-{bridgeNodeId}-target-prd-bridge"

# prdBridge → prdFrontend / prdBackend
source: "prdBridge-{bridgeNodeId}"   target: "{prdNodeId}"
sourceHandle: "prdBridge-{bridgeNodeId}-source-prd-bridge"
targetHandle: "{prdNodeId}-target-prd"
```
All edges use `{ type: "default", className: "stroke-foreground", style: { strokeWidth: 2 } }`.

## Reading & Writing the Mindmap

- Read: `codespring mindmap` (or the raw record via the API `GET /mindmaps/project/{projectId}`).
- The CLI writes specific parts (`set-info`, `tech-stack`, `features`, `note`). Adding PRD/other nodes uses a direct API write: `PUT /mindmaps/project/{projectId}` with body `{ flowJson: { nodes, edges } }`. This **replaces the whole flowJson**, so fetch the current one, ADD your nodes/edges, and preserve everything else. See `prd-management.md`.

## Tech Stack Categories

Use these in the `description` field when syncing:
- **Frontend**: react, vue, svelte, next, angular, astro
- **Backend**: express, fastify, hono, nestjs, elysia
- **Database**: prisma, drizzle, mongoose, pg, redis
- **State**: zustand, redux, jotai, mobx, xstate
- **Styling**: tailwindcss, styled-components, emotion, sass
- **Testing**: jest, vitest, playwright, cypress
- **DevTools**: typescript, eslint, prettier, biome
- **Infrastructure**: vercel, docker, aws-sdk

## Sync Commands

```bash
# Tech stack (merge by default)
codespring mindmap tech-stack --add '[{"id":"tech-react","title":"React","description":"Frontend"}]'

# Features (append by default)
codespring mindmap features --add '[{"title":"Auth","description":"Login/signup"}]'

# Sub-features: create as features parented to a core feature
codespring feature create --parent <coreFeatureId> --title "Sign up" --description "Email signup"

# Feature notes (creates bridge + notes nodes automatically; ROOT feature ids only; overwrites the single note)
codespring mindmap note feature-auth --text "OAuth2 implementation notes..." --title "How it works — Auth"

# Replace mode (overwrites existing items)
codespring mindmap tech-stack --add '[...]' --replace
codespring mindmap features --add '[...]' --replace
```
