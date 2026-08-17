---
name: cs-build-audit-codebase
description: >
  Diagnose a broken or untrusted codebase and plan the fix. Runs the app for
  real, fans out parallel specialist sub-agents (security, database, core logic,
  frontend/UX, architecture), audits the git/CI/deploy setup, verifies the
  headline claims independently, then gives a plain-English findings list ranked
  by real-world cost, writes FINDINGS.md into the repo, and delivers a
  rebuild-or-fix-in-place verdict (fix in place wins by default, and having real
  users can veto a rebuild outright) before handing off to cs-build-import-codebase and
  creating the Kanban tasks. Works on any codebase in any language. Triggers,
  "my app is a mess", "audit my codebase", "what's wrong with my app", "diagnose
  this codebase", "should I rebuild or fix this", "find the bugs in my app",
  "review my whole app".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(git:*) Bash(gh:*) Bash(node:*) Bash(npm:*) Bash(python3:*) Bash(curl:*) Bash(grep:*) Bash(rg:*)
metadata:
  author: codespring
  version: "0.2"
---

# Audit a codebase and plan the fix

For when the user says *"my app is a mess — tell me what's wrong and what to do about it."* Diagnostic, language-agnostic, and evidence-based. It ends with a plain-English findings list, a `FINDINGS.md` in the repo, a **verdict** (rebuild or fix in place), and Kanban tasks.

**Read first:** the `codespring` skill's `references/project-state.md` (enter-from-anywhere, the five questions), `references/auditing-and-fixing.md` (**the reasoning behind every step here**), `references/analyze-codebase.md`, `references/pitfalls.md`. Then this skill's `references/specialist-briefs.md` (copy-ready sub-agent briefs) and `references/plain-english-writeup.md` (the deliverable's structure and voice).

**Scripts** — run these instead of doing the equivalent by hand; a check must give the same answer every time. `scripts/check-repo.sh` (this skill: git/delivery reality) and the `codespring` skill's `scripts/fetch-project.sh` + `state.mjs` + `check-map.mjs` (state detection and map verification). All read-only. Judgement calls stay prose.

**Script paths below are relative to this skill's own folder**, and the skills install side by side — so `../codespring/scripts/…` reaches the core skill's scripts. Resolve them once at the start (`SKILL_DIR=$(dirname <this file>)`) and use absolute paths after that, because your working directory will be the user's repo.

**Language- and stack-agnostic.** Every named specific in this skill and its references — a rate table, a report, a state code — is a **labelled worked example** from the audit this was generalised from, never an assumption about the codebase in front of you. Translate the pattern; do not look for the example.

**Guardrails:** read-only on the target codebase, with exactly one exception — `FINDINGS.md` at the repo root, written only after asking, never committed. Live probing of the user's own running app and own services is fine and must be non-destructive.

## 0. Detect where the project already is
Run the state-detection **scripts** — same answer every run, no hand-counting (the `codespring` skill's `scripts/`, installed alongside this one):

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state   # read-only snapshot; prints the projectId
node ../codespring/scripts/state.mjs       /tmp/cs-state          # the one-line summary + booleans and counts
node ../codespring/scripts/check-map.mjs   /tmp/cs-state          # the machine-checkable map faults
```

Print the one-line summary to the user. **This decides what you skip.**

- Not linked → link first (or tell the user to create the project in the web app if it must live in a team workspace — `pitfalls.md`).
- **A map already exists → judge it before you keep it** (the ladder below). Either way, do not create features, do not "build the target map", do not run `mindmap features` here. Print the existing core features and their ids, then audit.
- `FINDINGS.md` already present → read it. You are updating an audit, not starting one.
- Tasks already exist → note the highest task number; you will continue the sequence, not restart it.

Always read `projectId` from the **local** `.codespring/config.json` and print it before any write.

### 0a. Is the existing map any good? — the ladder
*"A map exists → keep it"* is too blunt. An unusable map poisons every note, PRD and task built on it. Full version, including the CLI commands: `cs-build-import-codebase/references/target-map.md`.

1. **Does a map exist?** No → it gets built later, by `cs-build-import-codebase` (§10). Not here.
2. **Is it good?** `check-map.mjs` (above) settles the count, duplicate titles, flattened sub-features and missing notes. **You** judge the rest: are the core features **4–8** and each one something a user would recognise as a **sidebar item**; are sub-features things a user **does**, not sections of an output document or groups of form fields; are card descriptions one sentence with the depth in the notes. A map can pass every automated check and still be incomprehensible.
3. **Good → keep it.** Update the notes, add the tasks. **Never recreate it.**
4. **Fixable** (mostly right, a few strays) → **fix in place and say what you changed:** `codespring feature update <subId> --parent <coreId>` to re-parent, `codespring feature delete <dupId> --yes` to remove a duplicate, `codespring feature update <id> --title "..."` to rename.
5. **Not fixable** (so wrong it is confusing — wildly too many core features, output sections standing in as features, no coherent structure) → **do not try to salvage it.** Explain plainly why, and recommend a **new CodeSpring project** with a clean map; the old one **stays as history**. **Get explicit confirmation before creating a second project — never silently.**

⚠️ **Two projects for one app is confusing later**, so it must be a deliberate, explained choice — and the user must be told **which project is now authoritative**. The real case: a 13-core-feature import was unusable, a second project with a clean 6-feature map replaced it, and both still exist. There is no `project delete`, so this is permanent. If you arrive and find two projects for one app, establish which is authoritative before writing anything.

## 1. Scope the audit with the user (short)
Confirm: the repo path, how to start the app, what the app is *for*, whether there is an incumbent product it replaces, and anything already known to be broken. Ask what they most want answered — the real audit was shaped by three of the owner's own questions ("is it wrong in different areas?", "how is it reading the database?", "why do some reports look better?") and each produced a headline finding.

Three more questions, because each one changes what the findings mean (§2):
- **Does the app have real users or paying customers?** This can veto a rebuild on its own (§9) — ask it now, not at verdict time.
- **Is anyone else working in this repo right now?**
- **Is the app feature-complete, or still being built?**

State the posture up front: **the job is making what already works work properly, not adding features.** See `auditing-and-fixing.md` §4a.

## 2. Recon + the repo/delivery audit (do this yourself, first)
It caveats everything else, so it comes before the fan-out. Commands in `specialist-briefs.md` §6. Establish:
- **Is the local clone behind the remote?** `git fetch`, then compare local `HEAD` with `origin/<branch>`. If behind, **say so and offer to update before auditing** — auditing a stale clone produces findings that may already be fixed. (The real audit ran two merges behind production.)
- Is the **server-side source even in the repo**, or does it live only in a hosting dashboard? If the latter, that is a critical, total-loss finding — give the exact backup commands.
- Branch/PR structure; **is deploy gated on any automated check** or does merging ship to production; any CI at all; `.gitignore` adequacy; secrets in history (report the negative result too); is there a staging environment or does every session talk to production.
- Fix the stack description now so the sub-agents don't each re-derive it.

### 2a. The codebase is a moving target — run the script first
```bash
bash scripts/check-repo.sh --repo <abs repo path> [--paths <suspect files…>]
```
Read-only (`git fetch` touches remote-tracking refs only). It prints the commit the findings will apply to, how far behind the remote you are and which files those unseen commits touch, every remote branch with its date and author, recent authors, whether the working tree is dirty, and whether any automated check exists. Exit code 2 means the clone is behind.

**Worked example of what this catches, from a real audit:** 12 remote branches, the owner committing directly to `main`, a helper working in parallel, and the audited clone **3 commits behind** — with the newest commits touching the exact file under audit.

Then:
- **If behind: say how many commits, and offer to update before auditing.** One line, no lecture. **Never audit a stale clone silently** — findings from old code may already be fixed.
- **Enumerate the remote branches and report what is in flight**, so you do not write findings against work that has already been superseded.
- **Record the exact commit SHA in `FINDINGS.md`**, in the header beside the review dates. The findings are a snapshot of that commit and nothing else.
- **Anyone else working in the repo right now?** Ask. If yes, recommend a **dedicated branch** for the fixes and say plainly that merge conflicts will need managing.
- **Feature-complete, or still being built?** If still being built, the map may be missing planned modules the code does not yet contain, so **ask the owner what is planned but not yet built before finalising the feature list.** Real failure: an audit concluded four pages were a separate product because nothing linked to them — they were unfinished modules of the same product (§6a, rule 5).
- If the remote moves during the audit, re-check the specific findings you are about to ship rather than re-running everything.

**Assume no git knowledge and do not lecture the owner about it.** Non-technical owners commonly do not understand branches and will commit straight to `main` while an audit or a rebuild is in flight. State what you are doing and why in one line — *"I'll work on a branch called `fixes` so your own commits to main don't collide with mine"* — and never assume a clean linear history or that `main` is protected.

## 3. Run the app and drive it
**The highest-yield step. Do not skip it and do not substitute reading the code.** Start or serve the app, drive the main journeys, watch the console and the network panel, try empty/zero/negative/absurd/wrong-case inputs, and find where data is actually stored.

In the real audit this found a cleared input that froze the report on stale numbers, proved the core calculation made zero network requests (which reframed the whole audit), and *disproved* a suspected auth bypass that was really a labelled sample mode. Running it prevents false accusations as often as it finds bugs.

## 4. Fan out parallel specialists
Launch them **in one message, concurrently**, each read-only, each with a fully self-contained brief and no sight of the others. Independence is the evidence. Briefs in `references/specialist-briefs.md`:

**security/auth · database/schema · core business logic · frontend/UX/dead controls · architecture/scalability**

Add domains the app warrants — an incumbent/competitor comparison, a user-journey-and-failure map, a data-provenance pass. Every finding must carry a `file:line` or a reproducing command, plus an evidence label: **CONFIRMED** (ran it / read the exact line), **INFERRED** (deduced, not executed), **UNVERIFIED** (suspected, say what would check it). Unlabelled, uncited findings are dropped.

While they run, keep driving the app. You are the sixth agent and the one who resolves disagreements.

## 5. Hunt the specific defect categories
Named in `auditing-and-fixing.md` §4 — hunt these deliberately rather than hoping to notice them:
- **Stale hardcoded reference data** — rates/prices/thresholds as literals in source, with nothing noticing when they expire.
- **Duplicated logic that has drifted** — build a duplication register; check whether the copies agree *today* and whether they ever didn't; check which copy the main entry point actually loads.
- **Silent failure paths** — an error becoming a zero, an empty object, a stale screen, or a success message. *A missing value and a failure must never look the same.*
- **Data that lives only in a browser** — or only on one machine, with no backup and no warning.
- **Unverifiable currency/accuracy claims** — anything the software asserts that it cannot check.

## 6. Verify the headlines yourself
Do not relay a sub-agent's biggest number. Reproduce it independently — a second method (extract the logic into a scratch harness) and/or the live app. In the real audit both agreed to the cent, which is what made the headline dollar figure safe to show a client; say so in the write-up when they do. Reconcile contradictions between specialists; a later, better-informed pass beats an earlier one — record the correction rather than shipping both.

### 6a. Then audit yourself — this is where the errors actually came from
The CONFIRMED / INFERRED / UNVERIFIED labels only govern **sub-agent output**. In the real audit **nothing checked the orchestrator's own summarising, and that is where every error entered.** Full worked examples in `auditing-and-fixing.md` §3a. The four rules:

1. **State the scope of every measurement in the same sentence as the number.** *"45 bytes across 3 keys"* was measured on one page; the app used 15 keys product-wide.
2. **Before repeating a sub-agent's headline claim, re-run the one command that proves it.** *"The tax tables have drifted between the two engine copies"* was written when a `diff` showed the rate tables byte-identical and a different function drifted — it sent the reader to the wrong file.
3. **When claiming an app does something better, state what it does NOT do in the same breath.** Calling the app "ahead" of the incumbent hid the fact that it had solved only the easy half of that feature.
4. **Every term of art gets explained in the sentence it appears in, or is replaced.** *"Versioned rate tables stamped onto the saved file"* → *"when you save a report, also save which year's tax rates it used, so fixing a rate later doesn't change what a client was already shown."*
5. **Concluding that part of the codebase is out of scope.** Four pages were called "a separate product" because nothing linked to them and they loaded a different script. The evidence was real; the conclusion was wrong — `git log` showed those files untouched since the initial import while their siblings changed weekly, and the owner had already said he still had to work out that part's workflow. They were **unfinished modules of the same product**. **Rule: before concluding that part of a codebase is out of scope, check its git history and ask the owner.** Unreferenced code may be unfinished rather than foreign: `git log --format="%ad %s" -- <path>` per file is cheap and decisive, and `scripts/check-repo.sh --paths <files>` does it for a list.

**Required step, before writing anything in §8: list your headline claims and name the specific evidence for each one** — the command, the `file:line`, or the screen you drove. **Anything you cannot point at gets dropped or labelled unverified.** Write the list out; it is the only check on your own work rather than a sub-agent's.

## 7. Sort everything into the three buckets
**Rule, not a suggestion** (`auditing-and-fixing.md` §4a). The audit's default posture is **fix, don't extend** — the goal is usually getting something live, not making it richer.
1. **Problems** — broken or wrong now. *This is the job*, and the only bucket that becomes tasks.
2. **Could add later** — real gaps, deliberately parked. Written up in their own section, **never in the task list**.
3. **Not worth adding** — with the reason, so the question is closed.

A feature suggestion may never enter the task list, including "while we're in there". "This is missing" is bucket 2; "this exists and gives a wrong answer" is bucket 1.

### 7a. Where future ideas go — there is nowhere else yet
CodeSpring has features, notes, PRDs and Kanban tasks. **It has no home for "things we might build later"**, and those must never become tasks: **a task list implies committed work**, so a parked idea on the board either gets built by accident or makes the board untrustworthy.

**Interim convention — use it every time:** future ideas live in **`FINDINGS.md` in the repo**, in two explicitly titled sections, one line each **with a reason**:
- **"Could add later — deliberately not doing now"** — the reason it is parked, plus whether it is worth doing later.
- **"Not worth adding"** — the reason the question is closed, so it stops coming up.

Nothing in either section becomes a task, a feature on the map, or a PRD. Say the posture out loud once in the document. **Report this to the user as a product gap for FERB** — there is no first-class ideas surface that is visibly *not* a commitment.

## 8. Write the plain-English findings
Full structure and voice in `references/plain-english-writeup.md`. Non-negotiables:
- **Roughly third-grade reading level.** Short bullets, one concrete example per problem.
- **Ranked by real-world consequence** — dollar impact or client-trust impact — hardest-hitting first.
- **No file paths, no line numbers, no jargon** in the user-facing text. Every finding readable by someone who does not know what a database migration is; any term of art explained in the same sentence. (*"Versioned rate tables stamped onto the saved file"* failed this test. *"When you save a report, also save which year's tax rates it used, so fixing a rate later doesn't change what a client was already shown"* passes.)
- **Say what is good**, and mark it as not-to-break.
- **Two explicitly titled sections for future ideas** (§7a): *"Could add later — deliberately not doing now"* and *"Not worth adding"*, one line and one reason each.
- **Name the commit** the audit was based on in the header, with the review dates — findings are a snapshot (§2a).
- **Close with what you did not verify**, and what would verify it.

Ask, then write `FINDINGS.md` at the repo root. If it exists, update in place and preserve anything the user edited. **Never commit it.** The quality bar, and the structure section by section, is in `references/plain-english-writeup.md`.

## 9. The verdict — rebuild or fix in place
**Fix in place is the default. A rebuild has to be argued for.** State it plainly, to the user and to yourself: **rebuilding the whole architecture of an app is a large, risky job and is the wrong answer for most codebases.** It suits small apps with little irreplaceable logic — a tiny static-HTML app is a fair rebuild candidate; almost nothing else is. Warn yourself against over-recommending one: users in distress ask for a rewrite, and agreeing is the easy move, not the right one. A long defect list is *not* evidence for a rebuild.

### The gate — ask this before the table, because it can veto a rebuild on its own
**Does the app have real users or paying customers?**

- **If yes → fix in place is strongly preferred, regardless of how bad the code is.** A rebuild means a migration, a cutover, and a period where both versions exist — risk a live business may not be able to absorb.
- **If a rebuild is genuinely unavoidable *with* live users**, it needs a **parallel-running plan**: the old app stays live, the new one is built alongside it, with an explicit cutover and a rollback. The user must understand and accept that before work starts.
- **Say the trap out loud:** that usually means a second repo or a long-lived branch, and **multiple versions of an app across repos gets confusing fast**. **Default to a branch in the same repo**; use a separate repo only if the stack changes so completely that one repo cannot hold both.
- "No users yet" does not argue *for* a rebuild. It only removes the veto and lets the table decide.

| Signal | Points to REBUILD | Points to FIX IN PLACE |
|---|---|---|
| **Can the current architecture host what the app needs to do?** | No — what is missing is structural (no server, no accounts, nowhere to put the data) and cannot be added where it is | Yes — what is missing can be added inside what already exists |
| **How much irreplaceable domain logic is there?** | Small and isolatable — you can lift it out cleanly and carry it across | Large or diffuse — the valuable knowledge is spread through the whole app and cannot be lifted |
| **How big is the total surface area?** | Small — few pages, routes and screens; rewriting is a known quantity | Large — many routes, migrations, integrations; a rewrite is an open-ended bet |
| **Do tests or CI exist to protect a refactor?** | Irrelevant — you are replacing the code, not refactoring it | Helps a lot — a suite that catches regressions makes fixing in place safe and cheap |

Read it whole, not as a score. **Rebuild needs the gate to be clear *and* the first row to say "No".** If the architecture can host what's needed, fix in place regardless of how ugly the code is — ugly is not the same as wrong-shaped.

Worked both ways from the real case: a static-HTML app with no backend in the repo, no accounts, records in one browser, no live customers yet, ~8,800 lines total and only ~470 lines of irreplaceable domain logic → **rebuild** (and port those 470 lines deliberately). A Next.js app with real authentication, 133 migrations, ~142 authorization policies and hundreds of routes, with serious security problems → **fix in place, never rebuild**, because every one of those problems is fixable where it stands.

Deliver: the recommendation, **the answer to the gate**, the two or three signals that decided it, the honest cost of following it, and on a rebuild **which parts get ported rather than rewritten** plus the parallel-running and rollback plan if the app is live. Also name the highest-value work that is worth doing *either way* — in the real case, backing up the backend that was not in version control and writing the first test suite, neither of which needed the rebuild.

## 10. Hand off to the map
Call **`cs-build-import-codebase`**, passing the findings, the verdict, and **which rung of the ladder the existing map landed on** (§0a). It builds the **corrected target map** — what the app *should* look like — on either verdict, and it keeps or repairs an existing map rather than duplicating it. Do not build the map here; one code path builds maps.

## 11. Create the Kanban tasks
Task writing happens **inside `cs-build-import-codebase` §7**, because that is where the feature ids exist — don't re-implement it here. Your job is to hand it a clean input and check the result.

Hand over, per finding: the **bucket-1 findings only**, each with its severity (Critical → `urgent`, High → `high`, Medium → `medium`, Low → `low`), its evidence label, its file reference, and which core feature it belongs to. Bucket 2 and bucket 3 stay in the write-up and **must not appear in the task list**.

Then confirm the shape is right for the verdict:
- **Rebuild** → build-to-spec tasks **plus a distinct set of "mistakes to avoid" tasks** carrying forward the specific defects found, so they are not reintroduced. That second set is the whole reason for auditing first — if it is missing, the handoff failed.
- **Fix in place** → one task per defect, where it lives, **with the file reference in the description** (the user-facing text has none; the task needs it because an agent has to act on it).

An **UNVERIFIED** finding becomes an investigation task that keeps its label — never a confident fix task.

## 12. Verify, then report
**Run the check, don't eyeball it** (`auditing-and-fixing.md` §9):

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-verify
node ../codespring/scripts/check-map.mjs   /tmp/cs-verify --expect-core <the count you intended>
```

It asserts the core-feature count, no flattened sub-features, no duplicate features or PRDs, one note per core feature, and every task linked to a feature with a severity. A non-zero exit is a real failure — fix it before reporting. Then report the diff plainly — created N, updated N, skipped N — and give the project link `https://v2.codespring.app/project/<projectId>`.

## What good looks like
- The app was actually run, and at least one finding exists that reading the code could not have produced.
- Every finding cites a `file:line` or a command and is labelled CONFIRMED / INFERRED / UNVERIFIED; the headline numbers were independently reproduced.
- **Your own headline claims were listed with their evidence before you wrote them**, every measurement states its scope, and no claim is stronger than what a sub-agent actually found.
- The clone was compared to the remote **before** auditing, the commit the findings are based on is named, and the user was asked who else is in the repo and whether the app is finished.
- The git/CI/deploy setup was audited, and the user knows whether their backend is backed up and whether anything gates their deploys.
- The user-facing findings are plain, ranked by what they cost, contain no file paths, and say what is good as clearly as what is broken — including what a "better than the competitor" feature still does not do.
- Problems, could-add-later and not-worth-adding are separated; the task list contains only problems, and the future ideas are in the two named `FINDINGS.md` sections.
- The users gate was asked and answered, a verdict was given with its reasons, and "fix in place" was the answer unless the app has no users *and* the architecture genuinely couldn't host what's needed.
- Nothing in CodeSpring was duplicated — an existing map was kept, or repaired in place, and a second project was only ever created with explicit confirmation.
