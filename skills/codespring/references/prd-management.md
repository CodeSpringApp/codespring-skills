# PRD Management

## Listing PRDs

```bash
# List PRDs grouped by feature (tree view)
codespring prds
```

Returns PRDs organized by feature with: id, name, featureName, prdType.

> Caveat: when reading a single PRD's detail, the `featureName` field can be unreliable. To group PRDs by feature, key off the PRD `name` (e.g. `"Frontend PRD: Dashboard"` / `"Backend PRD: Dashboard"`).

## Getting PRD Content

```bash
# Get full PRD with markdown content
codespring prd <prd-id>
```

Returns:
- `id`, `name`, `projectId`, `projectName`
- `featureName`, `featureSlug`, `prdSlug`
- `content` — Full markdown content
- `suggestedPath` — e.g., `.codespring/PRDs/{feature-slug}/{prd-slug}.md`
- `createdAt`, `updatedAt`

## Syncing PRD Content

Update a PRD's content from a local file:

```bash
# From file
codespring prd sync <prd-id> --file ./path/to/prd.md

# From stdin (pipe from another command)
cat generated-prd.md | codespring prd sync <prd-id> --stdin

# Optionally update the name too
codespring prd sync <prd-id> --file ./prd.md --name "Updated PRD Title"
```

## PRD Types

- **frontend** — UI/UX specs: design tokens, component styles, layout, navigation/interaction
- **backend** — API endpoints, business logic, data model, security, infra
- **database** — Schema design, migrations, data models

## Generating PRDs (API)

The CLI reads and syncs PRDs but does not yet have a `create`/`generate` command. Generation is a direct API call the CodeSpring app uses. Authenticate first (`codespring auth status` refreshes an expired token), then call the API base `https://server.codespring.app/api` with `Authorization: Bearer <accessToken>` (or `x-api-key: <apiKey>`) read from `~/.codespring/credentials.json`. Use the `projectId` from the **local** `.codespring/config.json`.

```
POST /prds/generate
body: { "projectId": "<uuid>", "bridgeNodeId": "bridge-feature-<featureId>", "prdType": "frontend" | "backend" | "database" }
```

Notes:
- It **streams (SSE)** and takes ~20–30s. Use an HTTP timeout **≥ 120s**. A client-side abort does NOT stop the server — it still creates the record — so a short timeout + retry produces **duplicate PRD records**.
- Generation reads the feature's **note** as context (`relatedNotes`), so writing a strong "how it works" note first (`codespring mindmap note`) directly improves PRD quality.
- It creates the PRD **record** but does NOT add a node to the mindmap. See "Attaching a PRD to the canvas".

## Attaching a PRD to the canvas

A generated PRD will not appear until you add nodes to the mindmap `flowJson` and PUT it back. Build the `prdBridge → prdFrontend/prdBackend` sub-graph (full node/edge schema in `mindmap-structure.md`), then:

```
PUT /mindmaps/project/<projectId>
body: { "flowJson": { "nodes": [...], "edges": [...] } }
```

This **replaces the whole flowJson** — fetch current, ADD your nodes/edges, keep everything else. Key correctness point: `prdBridge.data.featureId` must be the **container** node (`"node-features"` for a core feature, or the sub-feature group node id for a sub-feature), and `itemId` the selected feature card id.

## Deduplicating PRDs

If timeouts caused duplicates, delete the extras. `DELETE /prds/<id>` requires an active checkpoint:

```
POST /projects/<projectId>/checkpoints   body: { "message": "..." }
DELETE /prds/<id>
```

Keep the most complete PRD per (feature, prdType); group by the PRD `name` field.

## Export Workflow

To export all PRDs to local files:

```bash
# 1. List PRDs to get IDs and suggested paths
codespring prds

# 2. For each PRD, get content and write to suggested path
codespring prd <id>
# Extract content field and write to suggestedPath
```

## Spec / research / planning documents

These are currently **web-app only** — there is no CLI/API endpoint accessible to the agent token for creating spec, research, or planning documents. Do them in the CodeSpring web app.
