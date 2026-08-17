---
name: codespring
description: >
  Project planning and management with CodeSpring. Use when the user wants to
  work with CodeSpring projects, tasks, PRDs, mindmaps, or analyze a codebase
  for project planning. Handles workspace selection, project linking, task
  management, and syncing findings to CodeSpring.
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(node:*)
metadata:
  author: codespring
  version: "1.1"
---

# CodeSpring CLI

Manage project planning: workspaces, projects, tasks, PRDs, and mindmaps.

## Prerequisites

- **CLI installed**: `npm i -g @codespring-app/cli` or use `npx @codespring-app/cli`
- **Authenticated**: Run `codespring auth status` to check. Login with `codespring auth login`.
- **Project linked**: Check for `.codespring/config.json` or run `codespring init`.

## Quick Start

```bash
# 1. Check auth
codespring auth status

# 2. Link project (interactive — picks workspace → project → writes config)
codespring init

# 3. Start working
codespring tasks --status todo
```

## Core Commands

| Command | Purpose |
|---------|---------|
| `codespring workspaces` | List available workspaces |
| `codespring projects [--org ID]` | List projects |
| `codespring project create --name <n>` | Create a new project |
| `codespring features` | List features for linked project |
| `codespring feature create --title <t>` | Create a feature |
| `codespring tasks [--status S] [--feature ID]` | List tasks with filters |
| `codespring task create --title <t> [--priority P]` | Create a task |
| `codespring task start <id>` | Mark task as in_progress |
| `codespring task done <id>` | Mark task as done |
| `codespring task update <id> --status <s>` | Update task fields |
| `codespring prds` | List PRDs by feature |
| `codespring prd <id>` | Get full PRD content |
| `codespring prd sync <id> --file <path>` | Update PRD from file |
| `codespring mindmap` | Get mindmap structure |
| `codespring mindmap set-info --title <t>` | Update project info node |
| `codespring mindmap tech-stack --add '<json>'` | Sync tech stack |
| `codespring mindmap features --add '<json>'` | Sync features |
| `codespring mindmap note <featureId> --text '...'` | Add feature notes |
| `codespring schema` | Data schema reference |
| `codespring node-types` | Mindmap node type reference |

**Note:** Task IDs can be UUIDs or row numbers (e.g., `task start 1` picks the first task from the list).

## Output

All commands default to markdown in terminals, JSON when piped.
Add `--json` to force JSON, `--pretty` for formatted JSON, `--md` for markdown.

## Agentic Task Workflow

```bash
# 1. Find available work
codespring tasks --status todo

# 2. Claim a task (UUID or row number)
codespring task start 1

# 3. Do the work using your coding tools

# 4. Mark done
codespring task done 1

# Or create a new task
codespring task create --title "Fix login bug" --priority high
```

## Syncing Codebase Analysis

After analyzing a codebase, sync findings:

```bash
# Sync detected technologies
codespring mindmap tech-stack --add '[{"id":"tech-react","title":"React","description":"Frontend"}]'

# Sync discovered features
codespring mindmap features --add '[{"title":"Authentication","description":"User login/signup"}]'

# Add analysis notes to a feature
codespring mindmap note feature-auth --text "Uses OAuth2 with PKCE flow..."
```

## Generating PRDs

The CLI reads and syncs PRDs; it does not yet generate them. PRD generation and attaching PRD nodes to the canvas is a direct API call the CodeSpring app uses — see [prd-management.md](references/prd-management.md) and [mindmap-structure.md](references/mindmap-structure.md). The `cs-build-create-prd` skill wraps this end-to-end.

## Scripts — run the checks, don't eyeball them

**A check is a script; a judgement is prose.** Anything that must give the same answer every run lives in `scripts/`, read-only, writing nothing to the project or the repo:

```bash
bash scripts/fetch-project.sh --out /tmp/cs-state   # snapshot the linked project's JSON; prints the projectId
node scripts/state.mjs        /tmp/cs-state         # the one-line state summary + booleans and counts
node scripts/check-map.mjs    /tmp/cs-state [--expect-core N]   # map quality + post-write verification
```

`check-map.mjs` settles the core-feature count, duplicate titles, sub-features flattened to top level, missing notes, duplicate PRDs and unlinked tasks; exit 1 = a real failure, 2 = warnings only. Whether the map is *good* — sidebar-level features, verbs for sub-features, one-sentence card descriptions — stays a judgement and stays in prose. `cs-build-audit-codebase/scripts/check-repo.sh` does the same for the git/delivery reality.

## Detailed References

- [project-state.md](references/project-state.md) — **Start here.** State detection so any skill can be entered from anywhere; **the five questions that decide whether code is worth building on**; the Understand → Plan → Build stages and the seam between them; the map-quality caveat and the two-projects case; the quick health smell test
- [auditing-and-fixing.md](references/auditing-and-fixing.md) — The audit → verdict → map → tasks pipeline; where audit errors actually come from (the orchestrator's own summarising); the moving-target/git reality; why the map shows the target; the rebuild-vs-fix decision table **and the has-users gate**; the defect categories worth hunting; scope discipline (problems / could-add-later / not-worth-adding) and where future ideas live; plain-language rules; idempotency + verification; FERB edge cases
- [commands.md](references/commands.md) — Full CLI reference with all flags
- [task-workflow.md](references/task-workflow.md) — Agentic task execution patterns
- [analyze-codebase.md](references/analyze-codebase.md) — Codebase analysis checklist (stack detection + deep feature/backend/frontend passes; choosing the smallest core-feature set)
- [mindmap-structure.md](references/mindmap-structure.md) — Mindmap data formats and node types (incl. PRD bridge nodes)
- [prd-management.md](references/prd-management.md) — PRD read/sync + generate/attach/dedupe
- [pitfalls.md](references/pitfalls.md) — Failure modes & guardrails (not checking what exists, wrong-project, flattening, duplicate PRDs, `features --replace` appending, no project delete/move)

## Related skills

This `codespring` skill is the shared knowledge base (how CodeSpring works + the CLI). The task-specific skills build on it. **Every one of them detects the project's real state on entry** (`project-state.md`), so it does not matter which the user invokes:

- `cs-build-getting-started` — connect, report where the project actually is, and name the single next step. Routes on two questions: **is there code**, and **does it do the job** (the five questions in `project-state.md` — never "do we trust it").
- `cs-build-plan-app` — no code yet, just an idea or a call recording. Interviews or mines the source, picks the platform on capability, proves the one hard part, cuts to a sellable v1, then writes the map and notes.
- `cs-build-audit-codebase` — diagnose a codebase that isn't doing its job (run it, parallel specialists, git/CI audit), write a plain-English `FINDINGS.md`, and give a rebuild-or-fix-in-place verdict.
- `cs-build-import-codebase` — map a repo into CodeSpring. With an audit it builds the corrected target map and findings-derived tasks; without one it documents what exists. Owns the map-quality ladder and the node model.
- `cs-build-ui-mockup` — a throwaway clickable mockup and style guide from the notes, reviewed with the client, corrections fed back into the plan. **Before the PRDs**, for anything with a user interface.
- `cs-build-create-prd` — generate a Frontend/Backend PRD for a chosen feature (the single source of truth for PRD creation).
- `cs-build-create-tasks` — turn a feature's PRDs into a numbered, parallel-safe task list.
- `cs-build-handoff` — turn the finished plan into the pack a paying client actually receives.
- `cs-build-feature` — interactive build orchestrator (readiness checks → up to 5 sub-agents → break-risk guards).
- `cs-build-resync-codebase` — keep CodeSpring in sync with the built code (read-only on code). This is what makes a target map describe reality again once the tasks are done.

See `references/codespring-docs.md` for guiding users through web-app-only steps, and `claude-templates/` (repo root) for per-platform `CLAUDE.md` starters.
