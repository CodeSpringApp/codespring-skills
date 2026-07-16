---
name: cs-create-tasks
description: >
  Turn CodeSpring PRDs/features into an actionable task list on the Kanban
  board. Reads a feature's PRD(s), breaks the work into ordered, right-sized
  tasks, and creates them linked to the feature. Use when the user has PRDs and
  wants a build plan / task list, or asks "what should I build first". Triggers,
  "create tasks", "make a task list", "break this PRD into tasks", "generate a
  build plan", "turn my PRD into tasks", "what do I build first".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*)
metadata:
  author: codespring
  version: "0.1"
---

# Create a task list from PRDs

Turn the plan into a Kanban task list the user (or the agent) can work through. See the `codespring` skill's `references/task-workflow.md` and `references/prd-management.md`.

## 0. Connect first
`codespring auth status` + `codespring status` (use the LOCAL project config).

## 1. Pick the scope
List features and their PRDs:
```bash
codespring features
codespring prds
```
Ask the user which feature(s) to plan tasks for (or "all"). If a feature has PRDs, read them for the real work:
```bash
codespring prd <prd-id>
```

## 2. Break down into tasks
From each PRD/feature, derive ordered, right-sized tasks (a task = one deliverable a person can finish and verify, not a whole feature). Order them so foundations come first (data model / API before UI that depends on it). Assign priorities.

Prefer backend/data tasks before the frontend that consumes them; call out any task that touches a **shared API route** (from the Backend PRD) so it isn't duplicated.

## 3. Create the tasks
```bash
codespring task create --title "Add users table + migration" --priority high --feature <featureId> --estimate "2h"
codespring task create --title "POST /api/login endpoint (auth + validation)" --priority high --feature <featureId>
codespring task create --title "Login form UI + client validation" --priority medium --feature <featureId>
```
Link every task to its feature with `--feature <featureId>`. Keep titles specific and verifiable.

## 4. Confirm
List what you created and the suggested order:
```bash
codespring tasks --status todo --feature <featureId>
```
Tell the user they can now work them (or ask the agent to) via the `todo → in_progress → done` flow in `task-workflow.md`.

## What good looks like
- Each feature has a short, ordered set of concrete tasks linked to it, foundations first.
- Shared/backend work is sequenced before dependent UI, and shared routes are flagged so nothing is built twice.
