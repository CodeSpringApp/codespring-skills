---
name: codespring
description: >
  Project planning and management with CodeSpring. Use when the user wants to
  work with CodeSpring projects, tasks, PRDs, mindmaps, or analyze a codebase
  for project planning. Handles workspace selection, project linking, task
  management, and syncing findings to CodeSpring.
allowed-tools: Bash(codespring:*) Bash(npx @codespring/cli:*)
metadata:
  author: codespring
  version: "1.0"
---

# CodeSpring CLI

Manage project planning: workspaces, projects, tasks, PRDs, and mindmaps.

## Prerequisites

- **CLI installed**: `npm i -g @codespring/cli` or use `bunx @codespring/cli`
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
| `codespring projects [--org ID]` | List projects in a workspace |
| `codespring features` | List features for linked project |
| `codespring tasks [--status S] [--feature ID]` | List tasks with filters |
| `codespring task start <id>` | Mark task as in_progress |
| `codespring task done <id>` | Mark task as done |
| `codespring prds` | List PRDs by feature structure |
| `codespring prd <id>` | Get full PRD content |
| `codespring prd sync <id> --file <path>` | Update PRD from file |
| `codespring mindmap` | Get mindmap structure |
| `codespring mindmap tech-stack --add '<json>'` | Sync tech stack |
| `codespring mindmap features --add '<json>'` | Sync features |
| `codespring mindmap note <featureId> --text '...'` | Add feature notes |
| `codespring schema` | Data schema reference |
| `codespring node-types` | Mindmap node type reference |

## Output

All commands output JSON. Add `--pretty` for human-readable formatting.
Use `--help` on any command for full options.

## Agentic Task Workflow

```bash
# 1. Find available work
codespring tasks --status todo

# 2. Claim a task
codespring task start <task-id>

# 3. Do the work using your coding tools

# 4. Mark done
codespring task done <task-id>
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

## Detailed References

- [commands.md](references/commands.md) — Full CLI reference with all flags
- [task-workflow.md](references/task-workflow.md) — Agentic task execution patterns
- [analyze-codebase.md](references/analyze-codebase.md) — Codebase analysis checklist
- [mindmap-structure.md](references/mindmap-structure.md) — Mindmap data formats and node types
- [prd-management.md](references/prd-management.md) — PRD export and sync workflows
