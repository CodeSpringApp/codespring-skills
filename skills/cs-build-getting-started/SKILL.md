---
name: cs-build-getting-started
description: >
  The CodeSpring entry point. Connects the agent to the user's CodeSpring
  account, then routes them to the right journey — design a new project from
  scratch, or import an existing codebase. Use at the very start of working
  with CodeSpring, when the user is unsure where to begin, or right after
  installing the CodeSpring skills. Triggers, "get started with CodeSpring",
  "set up CodeSpring", "connect CodeSpring", "I just installed the CodeSpring
  skills", "what can I do with CodeSpring", "where do I start".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*)
metadata:
  author: codespring
  version: "0.1"
---

# Getting started with CodeSpring

This skill gets the agent connected to CodeSpring and points the user at the right next step. Keep it short and friendly — the goal is to remove setup friction, then hand off to a focused skill.

See the `codespring` skill for how CodeSpring works and the full CLI. See `references/pitfalls.md` for guardrails.

## Step 1 — Connect (always do this first)

1. **CLI installed?** If `codespring` is missing, tell the user: `npm i -g @codespring-app/cli`.
2. **Authenticated?** Run `codespring auth status`. If not authenticated / expired, ask them to run `codespring auth login` (browser) and wait for confirmation. (Running the command also refreshes an expired token.)
3. **Project linked?** Run `codespring status`.
   - Linked → note the project name and continue.
   - Not linked → either link an existing project (`codespring projects` → `codespring init --project <id> --force`) or, if they're starting new, create one (`codespring project create --name "..."` → `codespring init --project <id> --force`).
   - Always rely on the LOCAL `.codespring/config.json` for which project is active.

Report back plainly: "Connected to CodeSpring as <workspace>, project <name>."

## Step 2 — Pick the journey

Ask the user what they want to do, and route:

1. **Design a new project from scratch** (they have an idea, not much code yet)
   → Plan it conversationally: capture the app's purpose, then propose core features (sidebar-level) and sub-features, and sync them to the mindmap (`codespring mindmap set-info`, `mindmap tech-stack`, `mindmap features`, `feature create --parent`, `mindmap note`). When features are agreed, offer to generate PRDs with **`cs-build-create-prd`**.

2. **Import an existing codebase** (they already have an app)
   → Hand off to **`cs-build-import-codebase`**, which reads the real code, builds the feature map, and generates Frontend/Backend PRDs.

3. **Build from an existing CodeSpring plan** (they already have features/PRDs and want to code)
   → Read the plan (`codespring features`, `codespring prds`, `codespring tasks --status todo`) and work the tasks in order (see the `codespring` skill's `task-workflow.md`). Optionally generate a task list first with **`cs-build-create-tasks`**.

If they're unsure, recommend: new idea → journey 1; existing repo → journey 2.

## What good looks like
- The agent is authenticated and pointed at the correct (local) project before doing anything.
- The user is handed to exactly one focused skill for their situation, not given a wall of options.
