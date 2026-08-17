---
name: cs-build-import-codebase
description: >
  Get an existing app into CodeSpring as a visual feature map — a small set of
  core features (sidebar-level) with nested sub-features and a "how it works"
  note each — then PRDs (via cs-build-create-prd) and Kanban tasks. Takes an
  OPTIONAL audit + verdict: with no audit it documents what exists; with an audit
  it builds the corrected target map (what the app should be) and generates fix or
  rebuild tasks from the findings. Detects an existing map, judges whether it is
  any good, and keeps or repairs it instead of duplicating it — and offers to
  audit first if the codebase looks broken.
  Triggers, "import my codebase into CodeSpring", "map my existing app", "reverse
  engineer my app into features", "bring this project into CodeSpring",
  "visualize my code in CodeSpring".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(git:*) Bash(node:*) Bash(curl:*) Bash(grep:*) Bash(rg:*)
metadata:
  author: codespring
  version: "0.5"
---

# Import a codebase into CodeSpring

Turn a real repo into an accurate CodeSpring model: **core features → sub-features → notes → PRDs → tasks**. Reads code and git; writes only to CodeSpring — never modifies the codebase.

Shared knowledge, read it: `codespring` skill `references/project-state.md` (enter-from-anywhere, the five questions), `references/auditing-and-fixing.md` (audit → verdict → map → tasks, and why the map shows the target), `references/analyze-codebase.md`, `references/mindmap-structure.md` (the exact node/edge schema), `references/prd-management.md`, `references/pitfalls.md`. Then this skill's `references/target-map.md` (**the map rules — the node model, the corrected target, and how to keep it small**).

**Language- and stack-agnostic.** Any named specific here or in the references is a **labelled worked example**, never an assumption about the repo in front of you.

**Script paths are relative to this skill's own folder**; the skills install side by side, so `../codespring/scripts/…` reaches the core skill's scripts. Resolve them to absolute paths once at the start — your working directory will be the user's repo.

## 0. Detect where the project already is
Run the state-detection **scripts** rather than counting by hand (the `codespring` skill's `scripts/`, installed alongside this one):

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state   # read-only snapshot; prints the projectId
node ../codespring/scripts/state.mjs       /tmp/cs-state          # summary line + booleans and counts
node ../codespring/scripts/check-map.mjs   /tmp/cs-state          # machine-checkable map faults, before you add to them
```

Read `projectId` from the **local** `.codespring/config.json` and print it before any write.

**Branch on what exists — do not assume you are starting from nothing:**
- **A map already exists** → you are **updating**, not importing. Print the existing core features and ids, then **run the map-quality ladder** (below). Match on title; never re-create; re-parent strays. Skip straight to whatever is actually missing (notes → PRDs → tasks).
- Not linked → link. If the project must live in a team workspace, the user creates it in the **web app** first (there is no CLI way to place or move a project — `pitfalls.md`).
- Tasks exist → note the highest number and continue the sequence.
- **Two projects already exist for this one app** → establish **which is authoritative** before writing anything, and say so to the user.

### 0a. The map-quality ladder — an existing map is not automatically a good map
*"A map exists → keep it"* is too blunt; an unusable map poisons every note, PRD and task built on it. Full version with the CLI commands and the two-projects warning: `references/target-map.md`.

1. **Does a map exist?** No → build it (§2–§4).
2. **Is it good?** `check-map.mjs` settles the count, duplicate titles, flattened sub-features and missing notes. **You** judge the rest: core features **4–8**, each one something a user would recognise as a **sidebar item**; sub-features are things a user **does**, not sections of an output document or groups of form fields; card descriptions one sentence with the depth in the note card. A map can pass every check and still be incomprehensible.
3. **Good → keep it.** Update notes, add tasks. **Never recreate it.**
4. **Fixable** (mostly right, a few strays) → **fix in place and say what you changed:** `codespring feature update <subId> --parent <coreId>`, `codespring feature delete <dupId> --yes`, `codespring feature update <id> --title "..."`.
5. **Not fixable** (wildly too many core features, output sections standing in as features, no coherent structure) → **do not salvage it.** Explain why plainly, recommend a **new CodeSpring project** with a clean map, and say the old one **stays as history**. **Get explicit confirmation before creating a second project — never silently.** Two projects for one app is confusing later, so it must be a deliberate, explained choice, and the user must be told **which project is now authoritative**. (Real case: a 13-core-feature import was unusable; a second project with a clean 6-feature map replaced it; both still exist, and there is no `project delete`.)

## 1. Do you have an audit?
This is the one input that changes the output.

| | Behaviour |
|---|---|
| **No audit** | Document **what exists** — the app as it is today. |
| **Audit + verdict** | Build the **corrected target map** — what the app *should* look like, simplified into core features a non-expert recognises. |

**If there's no audit, ask the five questions** (`project-state.md`) before importing — does the app do what it needs to do; is it getting things wrong or presenting unverifiable figures as fact; does the architecture allow what it needs to do; can it be built on scalably; can users use it without it breaking. **Any no → offer the audit first.** Do not ask "do you trust the code", and do not accept "it works" as five yeses — **"the code runs" is not the same as "the code does the job."**

**Then run the quick health smell test** (`project-state.md`), because the user often cannot answer questions 2, 4 and 5 from knowledge. Six smells: no tests/CI, ungated deploy, local clone behind the remote, swallowed errors, credentials in shipped source, browser-only records or hardcoded reference data. **Two or more → stop and offer the audit**, plainly: *"I found 4 of the 6 things that usually mean an app needs diagnosing before mapping. Want me to run `cs-build-audit-codebase` first?"* Do not silently import a mess — a map of a broken app is a map nobody should trust. If they decline, import what exists and say the map documents today's behaviour, faults included.

## 2. Analyse the code
Follow `analyze-codebase.md`: frontend map (routes, components, what the user sees, navigation) and backend map (API routes and which features share them, data model, security, shared systems — payments/credits, jobs/cron, storage, auth, env vars — and infra). Set the real tech stack. Read files; don't guess. On the audit path you already have most of this — reuse the findings rather than re-deriving them.

## 3. Decide the features — smallest recognisable set
Rules and the worked failure in `references/target-map.md`. The short version:

- **Core feature** = a sidebar/nav-level thing the user would point at. **Aim for 4–8.** The first real run produced **13 confusing** core features; after redirection, **6 clean** ones. Push hard toward the smallest set.
- **Sub-feature** = something the user **does**. A verb. *Save a client. Compare two properties. Export the PDF.*
- **The mistake not to repeat: do not turn report/page sections or form field-groups into sub-features.** A report section is part of one feature's output; a form field-group is part of one feature's input. Twelve report sections are one feature plus a good note, not twelve features.
- **Card descriptions stay to one short sentence. ALL detailed information goes into the note card attached to that feature via its bridge — never into the card description.** The node model (features node → card → bridge → note card, and bridge → PRD bridge → PRDs) is in `references/target-map.md`; the exact schema is in `mindmap-structure.md`. The first real run failed on exactly this: long descriptions on the cards *and* output sections promoted to sub-features, giving 13 unusable core features.
- **Notes are root-feature-only** via the CLI, so sub-feature detail goes in the parent core feature's note (`pitfalls.md` §5).

On the audit path, add a feature the current app lacks **only** where a bucket-1 fix has nowhere else to live (durable storage for records that exist only in a browser; sign-in where there is none). A bucket-2 "could add later" idea never becomes a feature (`auditing-and-fixing.md` §4a).

**Ask whether the app is feature-complete or still being built.** If it is still being built, **ask what is planned but not yet built before finalising the list** — missing code is not proof a feature is missing, and pages nothing links to may be unfinished modules rather than dead ends or a separate product.

**Read the list back to the user and ask them to cut it before you write anything.**

## 4. Write the map (CLI)
```bash
codespring mindmap set-info --title "..." --description "..." --github "<repo url>"
codespring mindmap tech-stack --replace --add '[{"id":"tech-...","title":"...","description":"Frontend"}, ...]'
codespring mindmap features --add '[{"title":"Dashboard","description":"..."}, ...]'   # CORE features; keep the returned ids
codespring feature create --parent <coreId> --title "..." --description "..."           # sub-features
codespring mindmap note <coreId> --title "How it works — X" --text "$(cat note.txt)"    # one per core feature; redirect output to /dev/null
```

**Idempotency (`auditing-and-fixing.md` §8):** diff by title first and only add what is missing. **`codespring mindmap features --replace` does NOT replace — it appends and creates duplicates.** If duplicates happen, recover with `codespring feature delete <id> --yes`, which does work and cascades.

**The note per core feature** carries the depth from `analyze-codebase.md` §8–9 and, on the audit path, three things: what the feature *should* do, how it works today, and what is wrong with it today (severity + file reference; on a rebuild, the "do not reintroduce this" constraints). The PRD generator reads this note as its context, so a thin note produces a thin PRD. When updating an existing note, read it first and keep what is still true.

## 5. Say what the map is
One sentence to the user, because it prevents a real misunderstanding: **the map shows the corrected target, not the current structure — so it won't mirror the repo until the tasks are done, and the Kanban is the gap between the two.** Rationale in `references/target-map.md`; this is deliberate and applies on both verdicts.

## 6. PRDs — via `cs-build-create-prd`
Do not re-implement PRD mechanics. For each core feature use **`cs-build-create-prd`** (Both frontend + backend); it captures the shared backend contracts and attaches the PRD bridge nodes correctly. Mind its ≥120s timeout and dedupe rules. **Never regenerate a PRD that already exists** unless asked — read it, say it exists, offer to refresh it. And never generate a PRD for a feature with no note.

## 7. Tasks — the two paths differ, and this is the important part
Only **bucket 1 (real problems)** becomes tasks. Every task: linked to exactly one core feature, carrying a severity (Critical → `urgent`, High → `high`, Medium → `medium`, Low → `low`), one-sentence title, detail in the description, continuing the existing numbering.

**Future ideas have nowhere to live in CodeSpring, and they must not become tasks** — a task list implies committed work. Buckets 2 and 3 go in `FINDINGS.md` in the repo, in two explicitly titled sections with a one-line reason each: *"Could add later — deliberately not doing now"* and *"Not worth adding"*. Never on the map, never in Kanban, never as a PRD (`auditing-and-fixing.md` §4a — it is a known product gap for FERB).

**Verdict = REBUILD → two distinct sets.**
1. **Build-to-spec tasks** — one per feature/sub-feature, foundations first.
2. **"Mistakes to avoid" tasks** — one per significant defect found in the original, carried forward as an explicit do-not-reintroduce constraint with the concrete example. **This second set is the entire reason for auditing before importing** — without it a rebuild recreates the same silent failures, the same hardcoded tables and the same duplicated logic, because nothing in the new plan says not to. Write them as verifiable constraints:
   - *"Reference data lives in dated records, not as values typed into the code. It must be impossible to change a rate by editing the app."*
   - *"When a lookup finds nothing, say so. No code path may put a zero or a blank where an error happened."*
   - *"There is exactly one copy of the calculation logic, and everything imports that copy."*
   - *"When a report is published, save the inputs, the results, and which year's rates produced them — so fixing a rate later doesn't change what a client was already shown."*
   - *"Who someone is never comes from the request body. Identifiers in a request are targets, and ownership is checked before use."*

**Verdict = FIX IN PLACE → one set.** One task per defect, at the place it lives, **with the file reference in the description** (the user-facing findings have no paths; the task needs one because an agent has to act on it). Sequence: silent failures first, then wrong outputs, then structural work, then polish — or the audit's own suggested fix order.

**No audit** → tasks come from the PRDs, not from findings. Hand off to **`cs-build-create-tasks`** for that; it owns PRD-derived task lists. This skill only writes the findings-derived tasks, because it is the only place the findings exist.

An **UNVERIFIED** finding becomes an investigation task keeping its label — never a confident fix task.

## 8. Verify (`pitfalls.md`, `auditing-and-fixing.md` §9)
**Run the check, don't eyeball it:**

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-verify
node ../codespring/scripts/check-map.mjs   /tmp/cs-verify --expect-core <the count you intended>
```

- `node-features.items.length` equals the intended core-feature count — **and no sub-features have been flattened to top level.** Re-parent any stray with `codespring feature update <subId> --parent <coreId>`; keep a sub→core map so re-runs are one command.
- No duplicate features (by title) and no duplicate PRDs (by feature + type).
- One note per core feature. Every task linked to a feature with a severity.
- A non-zero exit is a real failure: fix it before reporting. Then report the diff: created N, updated N, skipped N. Give the project link `https://v2.codespring.app/project/<projectId>`.

## 9. Optional independent audit of the map (no-audit path only)
On the audit path, skip this — you already have one. Otherwise spawn a **background sub-agent** with a FULLY SELF-CONTAINED brief and **no context from the import work**, so the comparison is unbiased:

> You are an independent auditor. Read-only: do not modify the codebase or the CodeSpring map.
> 1. **Inventory the whole codebase** — every route, page, table + enum, external provider, webhook, cron/job, and the shared backend contracts (payments/credits/refunds, job pipelines, storage conventions, auth, env vars).
> 2. **Read everything documented in CodeSpring** — every feature's notes and PRDs (via the `codespring` CLI).
> 3. **Compare critically and report**, prioritising **shared backend gaps and conflict risks** (the riskiest part of adding a new feature). Flag anything in the code that's undocumented, anything that could break or duplicate a shared system, and anything documented but missing critical backend detail — each **rated by severity** with exact file/route/table references, plus a shortlist of what to add to CodeSpring.

Report when it finishes and offer to fold the shortlist into the notes/PRDs, or hand off to `cs-build-resync-codebase`.

## What good looks like
- The map holds the **smallest** set of core features a non-expert would recognise — not report sections, not form field-groups.
- With an audit, the map is the **corrected target** and the user has been told so in one sentence; without one, it honestly documents what exists.
- Nothing was duplicated: an existing map was judged against the ladder and then kept or repaired in place, features were matched on title, strays were re-parented, existing PRDs were left alone.
- A second CodeSpring project was only ever created with **explicit confirmation**, with the reason explained and the authoritative project named.
- Future ideas are in the two named `FINDINGS.md` sections, not on the map and not in Kanban.
- Every core feature has a real "how it works" note, and every PRD was generated from one.
- On a rebuild, a distinct set of "mistakes to avoid" tasks exists so the original's defects cannot come back. On a fix in place, every defect has a task where it actually lives.
