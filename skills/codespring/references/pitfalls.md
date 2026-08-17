# Pitfalls & Guardrails

Hard-won failure modes when driving CodeSpring from an agent. Check these on every run.

## 0. Not checking what already exists (the most common one)
Every skill must open with the state-detection block in `project-state.md` and then **update or skip, never blindly overwrite or duplicate**. Match on title before creating anything, re-parent strays instead of recreating them, never re-create an existing feature, never regenerate an existing PRD without being asked, never restart task numbering. A skill invoked from "the wrong place" must still do the right next thing. Rules in `auditing-and-fixing.md` §8.

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

## 9. `mindmap features --replace` does NOT replace — it appends
`codespring mindmap features --add '[...]' --replace` **appends the items and creates duplicates.** Despite the flag name, nothing is removed. Running an import twice this way doubles the core-feature list.
- **Treat feature creation as add-only.** Read `codespring features` first, diff by title (case-insensitive, trimmed), and add only what is missing.
- **Recovery:** `codespring feature delete <id> --yes` does work, and it cascades (the feature's sub-features, bridge, note and PRD nodes go with it). Delete the duplicates, keep the originals whose ids are referenced by existing tasks/PRDs.
- The same caution does not apply to `tech-stack --replace`, which does replace, or to `mindmap note`, which correctly overwrites the single note for a feature.

## 10. No `project delete`, and no way to move a project
- **There is no `project delete` command.** A project created by mistake stays. Name it carefully.
- **`project create` ignores `--org`** and stamps `organizationId: null`, so it always lands in the personal workspace. There is no CLI way to move a project between workspaces or organisations afterwards.
- **Therefore:** if the project must live in a team/organisation workspace, tell the user to **create it in the web app first**, then `codespring projects` → `codespring init --project <id> --force` to link. Do this before writing anything; a full map in the wrong workspace cannot be relocated and has to be rebuilt.
- Do not burn time looking for a flag or an API for this. It isn't there.
