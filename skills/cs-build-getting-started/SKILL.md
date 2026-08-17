---
name: cs-build-getting-started
description: >
  The CodeSpring entry point. Connects the agent to the user's CodeSpring
  account, reports where the project actually is (map? notes? PRDs? tasks?), and
  names the single next step — audit an app that isn't doing its job, import one
  that is, plan a new one from scratch, or carry on from wherever the project
  already got to. Routes on two questions: is there code, and does it do the job
  (five specific checks, not "do you trust it").
  Safe to run at any point, not just the beginning. Use when the user is unsure
  where to begin or what to do next, or right after installing the CodeSpring
  skills. Triggers, "get started with CodeSpring", "set up CodeSpring", "connect
  CodeSpring", "I just installed the CodeSpring skills", "what can I do with
  CodeSpring", "where do I start", "what should I do next".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(node:*) Bash(git:*) Bash(grep:*) Bash(rg:*)
metadata:
  author: codespring
  version: "0.4"
---

# Getting started with CodeSpring

Connect, say where the project is, name **one** next step. Keep it short — then hand off.

Uses the `codespring` skill's `references/project-state.md` (state detection, the five questions, the three stages), `references/pitfalls.md`, and its `scripts/` (deterministic state detection).

## Step 1 — Connect
1. **CLI installed?** If `codespring` is missing: `npm i -g @codespring-app/cli`.
2. **Authenticated?** `codespring auth status`. If not, ask them to run `codespring auth login` and wait. (Running it also refreshes an expired token.)
3. **Project linked?** `codespring status`.
   - Linked → note the name and continue.
   - Not linked → link an existing project (`codespring projects` → `codespring init --project <id> --force`), or create one. **If it must live in a team workspace, they create it in the web app first** — `project create` ignores `--org` and there is no way to move or delete a project from the CLI (`pitfalls.md`).
   - Always trust the **local** `.codespring/config.json` for which project is active, and print the projectId.

## Step 2 — Say where the project is
Run the state-detection **scripts** rather than eyeballing the CLI output — the summary must be identical every run. They live in the `codespring` skill, which installs alongside this one, so the path is relative to this skill's folder; resolve it to an absolute path first, because your working directory will be the user's repo.

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state   # read-only snapshot; prints the projectId
node ../codespring/scripts/state.mjs /tmp/cs-state                # the one-line summary + the counts
```

Then report it in one line:

> Connected as *workspace*, project *name* — 6 core features, 25 sub-features, 6 notes, 0 PRDs, 0 tasks. Audit: not yet.

That line is the whole point of this skill. It tells the user what they already have, so they stop guessing which skill to run.

## Step 3 — Name the single next step
Use the branch table in `project-state.md`. **One recommendation, not a menu.** If the project already has a map, notes, PRDs or tasks, the next step comes from that table — don't restart from the beginning.

If the project is empty, there are only two questions: **is there code?** and, if there is, **does it do the job?** The second one is the five-question diagnostic in `project-state.md` — ask it, do not ask "do you trust it":

1. Does the app do what it actually needs to do?
2. Is it getting things wrong, or presenting made-up or unverifiable figures as fact?
3. Does the current architecture allow it to do what it needs to do?
4. Can we build on it scalably?
5. Can users use it without it breaking?

| Answer | Next step |
|---|---|
| **Any of the five is a no** | **`cs-build-audit-codebase`** — diagnose it, get a plain-English list of what's wrong ranked by what it costs, and a rebuild-or-fix verdict (having real users can veto a rebuild on its own). It then builds the map and the tasks. |
| **All five yes** | **`cs-build-import-codebase`** — map the real code into core features with notes and PRDs. (It will offer the audit anyway if the code smells broken.) |
| **There's no code yet — it's an idea** | **`cs-build-plan-app`** — the no-code-yet counterpart to import. Interviews them (or mines a call recording), walks the screens, picks the platform on capability, finds the one hard part and real prior art for it, cuts to a sellable v1, then **reads the whole plan back for a yes before writing anything**. It writes the map and notes itself, then hands to `cs-build-create-prd`. |

**"The code runs" is not the same as "the code does the job."** A vibe-coded app often runs fine and still fails questions 1–3, so do not accept "it works" as five yeses. If the user can't answer from knowledge — most can't — run the quick health smell test in `project-state.md` and answer from evidence: *"4 of the 6 things that usually mean an app needs diagnosing"*, then let them choose.

It does not matter if they picked "wrong". Every skill detects the real state on entry and does the right next thing.

## The rest of the journey
Once there's a map with notes: **`cs-build-ui-mockup`** → **`cs-build-create-prd`** → **`cs-build-create-tasks`** → **`cs-build-feature`** → **`cs-build-resync-codebase`**.

**`cs-build-ui-mockup` comes before the PRDs, and it is not optional for anything with a user interface.** It builds a throwaway clickable mockup from the notes and runs the review that catches what a written plan cannot express — screen order, hierarchy, position, and choices that turn out to be incomplete. A PRD generated from a plan nobody has looked at just encodes the misunderstanding in more detail. Understand produces context (the map + notes); Plan produces instructions (PRDs + tasks); a PRD is only as good as the note it reads (`project-state.md`).

## What good looks like
- Authenticated and pointed at the correct **local** project before anything else — and if two projects exist for one app, the user was told which one is authoritative (`project-state.md`).
- The user is told where their project actually is, in one line, from the script's output rather than a hand count.
- Routing came from the **five questions**, not from "do you trust it" — and "it works" was not accepted as five yeses.
- Exactly one next step is named, and it fits the state the project is really in — not a wall of options.
