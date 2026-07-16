# Pitfalls & Guardrails

Hard-won failure modes when driving CodeSpring from an agent. Check these on every run.

## 1. Wrong project
The linked project lives in the **local** `<cwd>/.codespring/config.json`. The **global** `~/.codespring/config.json` points at whatever project was last used somewhere else. Any script that reads the global config will silently write to the WRONG project.
- Always read `projectId` from the local config (or hardcode the intended one) and **print it before any write**.
- Symptom of getting it wrong: API writes "succeed" but nothing changes in the project you're looking at, or a "bridge/feature not found" error because the ids belong to a different project.

## 2. Sub-features flattened into core features
After PRD generation and/or creating a checkpoint, sub-features' `parentFeatureId` can reset to `null`, which **promotes every sub-feature into the core features list** (`node-features` balloons while the sub-feature groups still exist). This shows up as "suddenly there are way too many core features."
- **Detect:** fetch the mindmap and assert `node-features.items.length === <the real number of core features>`.
- **Fix:** re-parent each stray sub-feature: `codespring feature update <subFeatureId> --parent <coreFeatureId>`. Keep a stored subId→coreId map so you can re-run this quickly.
- Re-check this after every PRD-generation batch and checkpoint.

## 3. Duplicate PRDs from client timeouts
`POST /prds/generate` streams for ~20–30s. A client-side abort does NOT stop the server — it finishes and creates the record anyway. A short HTTP timeout + retry therefore creates **duplicates**.
- Use a timeout ≥ 120s.
- If duplicates happen: create a checkpoint (`POST /projects/<id>/checkpoints`) then `DELETE /prds/<id>` the extras, keeping the most complete per (feature, prdType). Group by the PRD `name` field, not the unreliable `featureName`.

## 4. PRD bridge metadata
`prdBridge.data.featureId` must point to the **container** node, not the feature card:
- core feature → `"node-features"`
- sub-feature → that feature's sub-feature group node id

`prdBridge.data.itemId` is the selected feature card id. Getting `featureId` wrong yields *"Features node not found in mindmap"* at generation time.

## 5. Notes are one-per-feature and root-only
`codespring mindmap note <featureId>` accepts only **root (core) feature ids** and **overwrites** the single note node for that feature. Sub-features cannot get a note via the CLI (only via direct `flowJson` editing). Put sub-feature detail and cross-feature links inside the parent core feature's note.

## 6. `PUT /mindmaps/project/<id>` replaces everything
The flowJson PUT is a full replace. Always fetch the current flowJson, ADD your nodes/edges, and preserve the rest. After writing, re-verify pitfall #2.

## 7. Auth / connection
Every skill should start by checking `codespring auth status` (this also refreshes an expired OAuth token) and `codespring status` (project link). If not ready, direct the user to `codespring auth login` / `codespring init` and stop.

## 8. Spec / research / planning documents
Not reachable from the agent token (endpoints 404 / 401). These are web-app-only for now — do not promise to create them from the CLI.
