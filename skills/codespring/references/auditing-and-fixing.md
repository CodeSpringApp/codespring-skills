# Auditing & Fixing a Broken Codebase

The process CodeSpring uses when a user says *"my app is a mess"*. This file holds the **reasoning**, not just the steps, because it is also the knowledge FERB needs to run this workflow without a user invoking a skill.

Read this alongside `project-state.md` (**start here — how every skill detects where the project already is**), `analyze-codebase.md` (how to read a codebase), `mindmap-structure.md` (how the map is stored), `pitfalls.md` (CLI failure modes), and `task-workflow.md`.

> **It must not matter which skill the user runs.** Every skill in this pipeline opens with the state-detection block in `project-state.md`, reports where the project actually is, and does the right *next* thing rather than the thing its own name implies. An audit run against a project that already has a good map updates that map — it does not build a second one.

---

## 1. Two entry points, split by intent

There is one pipeline but two front doors, because users arrive with two different intents and they need different first moves.

| The user says | Intent | Skill | First move |
|---|---|---|---|
| "get my app into CodeSpring", "map my app" | *Understand what I have* | `cs-build-import-codebase` | Document what exists |
| "my app is a mess, diagnose it and plan the fix" | *Tell me what's wrong and what to do* | `cs-build-audit-codebase` | Diagnose, then hand off |

**Routing is two questions: is there code, and does it do the job?** The second one is **never** "do we trust the code?" — that phrasing is meaningless to the person answering. It is the five questions in `project-state.md`:

1. Does the app do what it actually needs to do?
2. Is it getting things wrong, or presenting made-up or unverifiable figures as fact?
3. Does the current architecture allow it to do what it needs to do?
4. Can we build on it scalably?
5. Can users use it without it breaking?

**All five yes → keep building on it** (import). **Any no → consider rebuilding that part, or all of it** — which starts with an audit, because the audit is what turns a "no" into a specific, sized list, and the verdict (§5) decides fix-or-rebuild. **"The code runs" is not the same as "the code does the job":** a vibe-coded app very often runs fine and still fails 1–3.

**Why split rather than one skill with a flag:** the audit is expensive (parallel sub-agents, running the app, hours of work) and the import is cheap. Code that does its job must not pay for an audit it doesn't need, and code that doesn't must not get a map of its own mess. Splitting by intent means the router asks two questions instead of interrogating the user.

**Split by intent, not by hierarchy.** There is no wrapper skill and no routing tree. Both doors lead to the same pipeline, and each door is state-aware enough to be entered by mistake: an import that smells a broken codebase offers the audit first, and an audit that finds an existing map keeps it. See `project-state.md`.

`cs-build-audit-codebase` does not build the map itself. It produces findings + a verdict and hands both to `cs-build-import-codebase`. One code path builds maps.

---

## 2. The pipeline

```
audit  ──►  verdict  ──►  map  ──►  tasks
(what's   (rebuild or   (the      (the gap between
 wrong)    fix in place)  target)   here and there)
```

1. **Audit** — run the app, fan out specialists, verify the headlines, audit the repo itself. Output: evidence-labelled findings + a plain-English `FINDINGS.md`.
2. **Verdict** — rebuild, or fix in place. Argued against an explicit table (§5). Default is fix in place.
3. **Map** — the corrected target feature map (§6). Same shape on both verdicts.
4. **Tasks** — the gap between the map and reality, one task per defect or per feature-to-build, each mapped to a core feature and carrying a severity (§7).

Stages 1–3 are **Understand** (they produce context). Stage 4 and PRDs are **Plan** (they produce instructions). The seam between them, and why a PRD is only as good as the note it reads, is in `project-state.md`.

Every stage is idempotent and re-runnable (§8), and every stage may be entered directly — check what already exists first and skip what is already done.

---

## 3. Auditing: how to actually find things

### Run the app. Do not only read it.
The single highest-yield step. In the real audit this workflow was built from, driving the live app in a browser found things static analysis missed and *disproved* things static analysis suspected:

- A form field cleared to empty threw an exception, the recompute aborted, and the report **kept displaying the previous numbers** with no error. Unreadable from the source; obvious in 10 seconds live.
- The network panel proved the core calculation made **zero network requests** — which answered "how does it read the database?" with "it doesn't", and reframed the whole audit.
- A "type anything to sign in" screen looked like an auth bypass in the code. Driving it showed a clearly labelled sample mode. **Running it prevented a false accusation.**

So: start the app (or serve it), drive the main journeys, watch the console and the network panel, try empty and absurd inputs, and inspect where data is actually stored.

### Fan out parallel specialists by domain
Spawn independent sub-agents, one per domain, each read-only, each with a self-contained brief. Do not let them see each other's work — agreement between two independent methods is your strongest evidence.

Standard domains: **security/auth**, **database/schema**, **core business logic**, **frontend/UX/dead controls**, **architecture/scalability**. Add domains the app clearly needs (a competitor comparison, a user-journey map, a data-provenance pass).

Every finding must carry (a) a `file:line` reference or the exact command that reproduces it, and (b) an evidence label:

- **CONFIRMED** — the agent ran it or read the exact line. Say what it ran.
- **INFERRED** — deduced from code that was read, not executed. Say what the inference is.
- **UNVERIFIED** — suspected, could not be checked. Say what would check it.

Findings without a citation and a label do not go in the report. Ranking by consequence is impossible when confidence is unknown, and a confident wrong claim about someone's app destroys the audit's credibility.

### Verify the headline claims yourself
Do not relay a sub-agent's biggest number without independently reproducing it. In the real audit the orchestrator re-ran the core logic in a second, unrelated way (extracted into a scratch script) and separately in the live browser; both agreed to the cent, which is what made the headline dollar figure safe to put in front of a client. Where two methods agree, say so in the report.

Also check for **contradictions between specialists** and resolve them before writing. A later, better-informed pass corrected an earlier one's table-ownership claim in the real audit; the corrected version is what shipped.

### Audit the repo and delivery setup, not just the code
Routinely skipped and routinely where the worst risk is:

- **Is the local clone behind the remote?** `git fetch --all`, then compare `HEAD` with the upstream. Check this **first**, not last, report **how many commits behind**, and **offer to update before auditing** — findings from a stale clone may already be fixed. `cs-build-audit-codebase/scripts/check-repo.sh` does the whole check deterministically.
- **What else is in flight?** Enumerate the remote branches with their dates and authors, so you do not write findings against work that has already been superseded.
- **Is anyone else working in this repo right now?** Ask. If yes, the findings are a **snapshot at a named commit**: record the commit SHA in `FINDINGS.md` and recommend a **dedicated branch** for the fixes, saying plainly that merge conflicts will need managing.
- **Assume the owner does not know git, and do not lecture them about it.** Non-technical owners commonly commit straight to `main` while an audit or rebuild is in flight. **Never assume a clean linear history, and never assume `main` is protected.** State what you are doing and why in one line and move on.
  *Worked example: 12 remote branches, the owner committing directly to `main`, a helper working in parallel, and the audited clone 3 commits behind — with the newest commits touching the exact file under audit.*
- **Is the app feature-complete, or still being built?** Ask this too, because it changes what "missing" means. If it is still being built, the map may be missing planned modules that the code does not contain yet, so **ask the owner what is planned but not yet built before finalising the feature list.** Real failure: an audit concluded that four pages were a separate product because nothing linked to them — they were unfinished modules of the same product.
- **Is the whole backend even in the repo?** In the real case the entire server (13 endpoints, all SQL, the only definition of five tables) existed **only** inside a hosting dashboard — not in git, not on the machine. That is a total-loss risk and it was invisible from the code.
- **Branch and PR structure** — is there a default branch, are branches short-lived, is work reviewed?
- **CI** — does any automated check exist? Is deploy **gated** on it, or does merging ship straight to production? Auto-deploy with no test gate is the mechanism by which the real app shipped wrong tax law to production for nine days.
- **Secrets in history** — scan for committed keys/tokens (`git log -p -S` for the obvious markers). Report the negative result too; "no privileged key was ever committed" is one of the most valuable things you can tell someone.
- **Is there a staging environment?** If credentials are string literals, every preview and local session is talking to the production database.
- **`.gitignore` adequacy** — fix this *before* telling anyone to commit their backend.

---

## 3a. Where audit errors actually come from

The CONFIRMED / INFERRED / UNVERIFIED labels in §3 apply to **sub-agent output**. In the audit this workflow was generalised from, **nothing checked the orchestrator's own summarising — and that is where every error entered.** The specialists were careful; the write-up that compressed them was not. Label the sub-agents, then audit yourself against the rules below.

Each one is a real mistake that reached the page. The specifics come from one audit of one app and are **labelled worked examples, not assumptions about the codebase in front of you** — the rule is the part that generalises.

1. **Measuring one thing and claiming something broader.**
   What happened: browser storage was measured on a single page — 45 bytes across 3 keys — and the write-up stated it as a fact about the whole app, which actually used 15 keys product-wide.
   **Rule: state the scope of every measurement in the same sentence as the number.** *"45 bytes across 3 keys on the report page"* is true; *"45 bytes across 3 keys"* is not.

2. **Compressing a sub-agent's finding into something stronger than it said.**
   What happened: the write-up said *"the tax tables have drifted between the two engine copies."* A mechanical diff showed the rate tables were **byte-identical** — a different function had drifted. The claim sent the reader to the wrong file to fix the wrong thing.
   **Rule: before repeating a sub-agent's headline claim, re-run the one command that proves it.** One `diff` would have caught this.

3. **Overstating an advantage.**
   What happened: the app was called "ahead" of the incumbent product on a feature when it had solved only the easy half of it — one property in one state, not land added up across a portfolio, which was the exact part the incumbent said was too hard.
   **Rule: when claiming an app does something better, state what it does NOT do in the same breath.** "Better" with no boundary is a claim the owner will repeat to a customer.

4. **Jargon that meant nothing to the reader.**
   What happened: *"versioned rate tables stamped onto the saved file."* The person it was written for could not act on it.
   **Rule: every term of art gets explained in the sentence it appears in, or is replaced.** The plain rewrite: *"when you save a report, also save which year's tax rates it used, so fixing a rate later doesn't change what a client was already shown."*

5. **Concluding that part of the codebase was out of scope.**
   What happened: four pages were called "a separate product" because nothing linked to them and they loaded a different script. The evidence was real, the conclusion was wrong. `git log` showed those files untouched since the initial import while everything around them changed weekly, and the owner had separately said he still had to work out the workflow for that part of the app — *"there is about 5-6 pages to it."* They were **unfinished modules of the same product**, not a different product.
   **Rule: before concluding that part of a codebase is out of scope, check its git history and ask the owner.** Code that nothing references may be unfinished rather than foreign. `git log --format="%ad %s" -- <path>` per file is cheap and decisive: **a file untouched since the initial import while its siblings change weekly is a strong signal of "not finished yet", not "not part of this."**

### The check that catches all five

**Before writing the findings, list your headline claims and name the specific evidence for each one** — the command you ran, the `file:line` you read, or the screen you drove. **Anything you cannot point at gets dropped, or goes in labelled as unverified.** Write the list out deliberately; it takes minutes, and it is the only step that inspects the orchestrator's own work rather than a sub-agent's.

---

## 4. Defect categories worth hunting

These recur across languages and stacks. Hunt them explicitly rather than hoping to notice them.

### Stale hardcoded reference data
Rates, prices, tax tables, fee schedules, thresholds, feature lists — anything with an expiry date — typed as literals into shipped source. The mechanism costs a deploy to update. The real cost is that **nothing notices when it expires**, and the output usually keeps asserting the data is current.
*Real case: eight jurisdictions' tax tables as literals in a web page, plus a printed claim that they were "current for FY2026-27", with nothing checking the date.*
Fix pattern: move to versioned records with `effective_from` / `effective_to`, ask "which value applied on the date of this event", surface a staleness warning when today is past the range, and stamp the version onto anything published.

### Duplicated logic that has drifted
The same function, table, or constant existing in two or more places. It is only a smell until it drifts — then it is a correctness bug that no single file review can see.
*Real case: the calculation engine existed twice; the copy the secondary pages used stayed a financial year behind for nine days, so the same property produced different government charges on different pages. Nobody noticed because there were no tests.*
Look for: copy-pasted modules, a "shared" file the main entry point never actually imports, constants defined more than once, and design tokens forked across stylesheets. Build a **duplication register**: what, how many copies, has it drifted, which copy is authoritative.

### Silent failure paths
An error that becomes a zero, an empty object, a stale screen, or a success message. The worst class of bug because the user cannot tell it happened.
Signatures to grep for: empty catch blocks, `catch → return {}`, `catch → return 0`, promise rejections swallowed with a no-op, a truthiness check treating an error object as success, a lookup miss returning a default instead of "not found", and a save path that reports success without checking the result.
*Real cases: a network blip wrote eight zeros into a market-data section and saved them, so "median price $0" read as real data; a failed disk write of a client record was swallowed, so the user believed it saved; a cleared input froze the report on the previous numbers, which then exported to PDF.*
Rule to state in the report: **a missing value and a failure must never look the same.**

### Data that lives only in a browser (or only on one machine)
Records in `localStorage` / `IndexedDB` / a desktop file with no server copy. Survives a refresh, survives nothing else — a new browser, a second device, or clearing site data loses everything with no warning and no backup, and two colleagues can never see the same records.
*Real case: every client file — names, incomes, property details — existed in one browser profile on one laptop.*
Also flag the inverse where it is a genuine asset: if the core computation never touches the network, that is a real privacy property worth stating out loud rather than accidentally destroying.

### Unverifiable currency or accuracy claims
Any place the software *asserts* something it cannot check: "rates current for FY2026-27", "live data", "verified", a timestamp that is really a build constant, a source attribution read from a string typed next to the numbers. These are the findings that cost client trust rather than dollars, and they are usually one line.
*Real case: a report named the government source and the financial year beside figures that nothing validated, including for an unrecognised jurisdiction where every charge came out as zero.*

### Also worth a pass
Numbers presented as precise that are actually unexamined assumptions (an auto-estimate whose "estimated" hint disappears when the mode changes is the nastiest version); controls that do nothing; pages nothing links to; validation that does not exist (no required fields, no bounds — a decimal separator read as a thousands separator silently divides a figure by a thousand); records generated from an empty form that look complete; and dead code paths calling endpoints that were never implemented.

---

## 4a. Scope discipline — three buckets, never blurred

**The default posture of an audit is fix, not extend.** The user's words, and they are a rule rather than a preference: *"I want to avoid adding loads of features now. We just need to get what's currently working, working better."*

Every observation the audit makes goes into exactly one of three buckets, and the buckets are reported separately and labelled:

| Bucket | What goes in it | Where it ends up |
|---|---|---|
| **1. Problems** | What is broken, wrong, or silently lying right now. **This is the job.** | The findings write-up **and** the Kanban tasks |
| **2. Could add later** | Real gaps and good ideas, deliberately **not** being built now | The findings write-up, in its own clearly-titled section. **Never in the task list.** |
| **3. Not worth adding** | Suggestions that should stop coming up, **with the reason** | The findings write-up, one line each, so the question is closed |

Rules, not suggestions:

- **A feature suggestion may never enter the task list.** If it is not fixing something that is broken, it is bucket 2 or bucket 3. No exceptions, including "while we're in there".
- **Bucket 3 needs a reason.** "Not worth adding" without a why is just an opinion and it will be raised again next month. In the real audit: *don't build an integration to fetch tax rates automatically — no free authoritative feed exists, and scraping eight government websites would be more fragile than a maintained table plus an annual review.* That closed the question permanently.
- **Say bucket 2 out loud rather than silently dropping it.** A gap the audit noticed and consciously parked is reassuring. A gap the audit apparently missed is not.
- **Watch the boundary case:** "this feature is missing" is bucket 2, but "this feature exists and produces a wrong answer" is bucket 1. Missing capital-gains modelling would be bucket 2; capital gains being understated by $337,000 by code that already runs is bucket 1.
- When the user asks for something from bucket 2 anyway, that is their call — but it becomes its own piece of work with its own tasks, not a passenger on the fix list.

### Where do future ideas actually live? — a real gap, with an interim convention

CodeSpring has features, notes, PRDs and Kanban tasks. **It has no home for "things we might build later."** And those ideas must never be written as tasks: **a task list implies committed work**, so a parked idea sitting in Kanban will either get built by accident or make the board untrustworthy.

**Interim convention, use it every time:** future ideas live in **`FINDINGS.md` in the repo**, in two explicitly titled sections, each entry one line with a reason:

- **"Could add later — deliberately not doing now"** (bucket 2) — the reason is *why it is parked*, plus whether it is worth doing later.
- **"Not worth adding"** (bucket 3) — the reason is *why the question is closed*, so it stops coming back.

Nothing in either section becomes a task, a feature on the map, or a PRD. If the user later commits to one, it starts its own piece of work and moves out of the section.

**Record this as a product gap for FERB:** there is no first-class "ideas" or "backlog" surface in CodeSpring that is visibly *not* a commitment. Until there is, the two `FINDINGS.md` sections are the answer and FERB should read and write them rather than inventing tasks.

## 4b. Plain language — a hard rule, not a style note

**Every finding must be readable by someone who does not know what a database migration is.** Any term of art must be explained in the same sentence it appears in, or not used.

This is a rule because it has already failed in practice. The phrase *"versioned rate tables stamped onto the saved file"* was written and meant nothing to the person it was written for. The plain version says the same thing:

> *"When you save a report, also save which year's tax rates it used — so that fixing a rate later doesn't change what a client was already shown."*

Note what the good version does: it names the action ("when you save a report"), the thing to save ("which year's tax rates it used"), and — the part that actually persuades — **the consequence of not doing it** ("fixing a rate later changes what a client was already shown"). No jargon, and it is *more* specific than the technical phrasing, not less.

Apply the same test to everything: *idempotent*, *RLS*, *IDOR*, *migration*, *ORM*, *schema drift*, *silent failure path*, *hydration*, *denormalised*. Either explain it inline or find the plain sentence. Full voice rules and structure for the deliverable live in `cs-build-audit-codebase/references/plain-english-writeup.md`.

## 5. The verdict: rebuild or fix in place

### Fix in place is the default. A rebuild has to be argued for.
Say this plainly, to yourself and to the user: **rebuilding the whole architecture of an app is a large, risky job and is the wrong answer for most codebases.** It suits small apps with little irreplaceable logic — a tiny static-HTML app is a fair rebuild candidate; almost nothing else is.

Users in distress ask for a rewrite, and an agent that agrees is doing the easy thing, not the right thing. A rebuild throws away every undocumented decision that is currently keeping the app working, restarts the bug count from zero, and delivers nothing until it is finished. Recommend it only when the gate and the table below actually point there, and say plainly which signals drove the call.

### The gate: does the app have real users or paying customers?

**Ask this before reading the table, because it can veto a rebuild on its own.**

- **If yes — fix in place is strongly preferred, regardless of how bad the code is.** A rebuild means a migration, a cutover, and a period where both versions exist. That is risk a live business may not be able to absorb, and no amount of ugly code outweighs it.
- **If a rebuild is genuinely unavoidable *with* live users**, it needs a **parallel-running plan**: the old app stays live, the new one is built alongside it, and there is an explicit cutover with a rollback. The user must understand and accept that before any work starts.
- **Name the trap out loud:** parallel running usually means a second repo or a long-lived branch, and **multiple versions of an app across repos gets confusing fast** — nobody remembers which one is live. **Default to a branch in the same repo.** Use a separate repo only when the stack changes so completely that one repo genuinely cannot hold both.

A "no users yet" answer does not argue *for* a rebuild — it just removes the veto and lets the table decide.

### The decision table

| Signal | Points to REBUILD | Points to FIX IN PLACE |
|---|---|---|
| **Can the current architecture host what the app needs to do?** | No — what is missing is structural (no server, no accounts, nowhere to put the data) and cannot be added where it is | Yes — what is missing can be added inside what already exists |
| **How much irreplaceable domain logic is there?** | Small and isolatable — you can lift it out cleanly and carry it across | Large or diffuse — the valuable knowledge is spread through the whole app and cannot be lifted |
| **How big is the total surface area?** | Small — few pages, routes and screens; rewriting is a known quantity | Large — many routes, migrations, integrations; a rewrite is an open-ended bet |
| **Do tests or CI exist to protect a refactor?** | Irrelevant — you are replacing the code, not refactoring it | Helps a lot — a suite that catches regressions makes fixing in place safe and cheap |

Read it as a whole, not a score. **Rebuild needs the gate to be clear *and* the first row to say "No".** If the architecture can host what's needed, the answer is fix in place regardless of how ugly the code is — ugly is not the same as wrong-shaped.

### Worked both ways, from the real case

**Rebuild — a static-HTML app.** No backend in the repo, no accounts, no database of its own; user records lived in one browser. ~8,800 lines total across 17 pages, of which only ~470 lines were irreplaceable domain logic (verified reference tables and one calculation pipeline) that could be lifted out in a day. Zero tests, zero CI. **No live customers depending on it yet**, so the gate was clear. Architecture row = **No** (there was nowhere to put durable, shared, authenticated data), surface = small, precious logic = small and isolatable. → **Rebuild**, and the plan led with "port these 470 lines deliberately, rewrite everything else".

**Fix in place — a Next.js app.** Real authentication, 133 tables, 133 migrations, ~142 authorization policies, hundreds of routes and server actions. It had genuine, serious problems: signed agreements in a public bucket, endpoints failing open when a secret was unset, schema drift with ~38 undocumented production tables. Architecture row = **Yes** (every one of those is fixable where it stands), surface = large, precious logic = enormous and diffuse. → **Fix in place, never rebuild.** The problems were serious *and* the answer was still not a rewrite. Say that explicitly — a long defect list is not evidence for a rebuild.

### What the verdict must contain
The recommendation, **the answer to the users gate**, the two or three signals that decided it, an honest statement of the cost of the recommendation, and — if rebuild — **which specific parts get ported deliberately rather than rewritten** plus the parallel-running and rollback plan if the app is live. Also name the highest-value work that is worth doing *whichever* way the verdict goes; in the real case that was backing up the backend that was not in version control, and writing the first test suite — neither of which needed the rebuild to happen.

---

## 6. Why the map always shows the corrected target

**Settled decision: the mindmap always shows the corrected target — what the app *should* be — never the current messy structure annotated with warnings.** This holds on both verdicts and it is deliberate.

Rationale to keep on record:

- **The map means one thing.** A user, or FERB, reading a CodeSpring map never has to ask "is this the real structure or the intended one?" It is always the intended one.
- **The Kanban always means the same thing:** the gap between here and there. Every task closes a distance between the map and reality. That is true for a rebuild (build this feature) and for a fix in place (make this feature actually work).
- **One drawing model.** No second node type for "broken", no warning badges, no annotation layer to maintain, and nothing extra to keep in sync when a task is finished.

Accepted cost: **the map does not mirror the repository until the tasks are done.** That is real and must be disclosed to the user in one sentence. It is arguably a feature — the map shows people where they are going, which is what a non-expert needs to see. It is also why `cs-build-resync-codebase` exists: once the work is done, resync brings the map back to describing reality, and from then on the two agree.

Where an audit finding has no home in the target map (a defect in a feature the target does not have, e.g. dead code being deleted), it becomes a task without a new feature — attach it to the closest core feature, or to a core feature named for the cleanup work. Do not invent a feature just to host a defect.

**An existing map is not automatically a good map.** "A map already exists → keep it" is too blunt: an import can produce a map that is genuinely unusable. Judge it against the **map-quality ladder** in `cs-build-import-codebase/references/target-map.md` — exists? good? fixable? — and only recommend a second CodeSpring project when the map is beyond fixing, with the user's explicit confirmation. Two projects for one app is confusing later, so it has to be a deliberate, explained choice.

---

## 7. How findings become tasks

**Only bucket 1 becomes tasks** (§4a). Bucket 2 and bucket 3 stay in the write-up. If the task list contains something that isn't fixing a real defect, it is in the wrong place.

Every task, on either path: mapped to exactly one core feature, carrying a severity, one sentence of title, detail in the description.

### If the verdict is REBUILD — two distinct sets
1. **Build-to-spec tasks.** One per feature/sub-feature in the target map: build it to the spec in the note and PRDs. Ordered foundations-first.
2. **Mistakes-to-avoid tasks.** One per significant defect found in the original, carried forward as an explicit "do not reintroduce this" instruction with the concrete example from the audit.

**The second set is the entire reason for auditing before importing.** Without it, a rebuild recreates the same silent failure paths, the same hardcoded tables and the same duplicated logic, because nothing in the new plan says not to. Write them as verifiable constraints, not vibes:

- *"Reference data must be date-scoped records, not literals in source. It must be impossible to update a rate by editing application code."*
- *"A lookup failure must return an explicit not-found. No code path may substitute zero or an empty object for an error."*
- *"There is exactly one copy of the calculation logic and both the client and the server import it."*
- *"Every published document stores the inputs, the results, and the version of the reference data that produced them."*
- *"Identity for authorization never comes from the request body. Body identifiers are targets, ownership-checked before use."*

Where the audit produced a good test list, attach it here — a mistakes-to-avoid task with a failing test named in it is the strongest form of this.

### If the verdict is FIX IN PLACE — one set
One task per defect, at the place it lives, **with the file reference in the description** (the user-facing findings text has no file paths; the task description does, because an agent has to act on it). Sequence by consequence and by dependency: guard the silent failures first, then the wrong outputs, then the structural work, then polish. If the audit produced a suggested fix order, use it.

### Severity
Map audit severity straight onto task priority: Critical → `urgent`, High → `high`, Medium → `medium`, Low → `low`. Do not soften it. A finding that puts a wrong number in front of a paying customer is urgent even if it is a one-line fix.

---

## 8. Idempotency — required on every run

Every skill in this pipeline must assume it is the *second* time it has run. **Check what exists, then update or skip. Never blindly overwrite and never duplicate.**

**A check is a script; a judgement is prose.** Anything that must produce the same answer every run belongs in `codespring/scripts/`, not in a paragraph an agent can skim: state detection, the map's machine-checkable properties, and the post-write verification are all scripts. What stays prose is what needs reasoning — *is this map good? is this a sidebar item? fix or rebuild?* Never move a judgement into a script, and never leave a count in prose.

Before writing anything:

```bash
bash  codespring/scripts/fetch-project.sh --out /tmp/cs-state   # read-only snapshot; prints the projectId
node  codespring/scripts/state.mjs        /tmp/cs-state         # the summary line + booleans and counts
node  codespring/scripts/check-map.mjs    /tmp/cs-state         # what is already wrong, before you add to it
```

What that reads, if you need it by hand: `codespring status` (the LOCAL project — print the projectId), `codespring mindmap` (nodes, features, notes, PRD bridges), `codespring features` (core + sub-features with ids), `codespring tasks` (**all** states), `codespring prds` (PRDs per feature).

Then:

- **Match on title** (case-insensitive, trimmed) before creating anything. An existing feature with that title is *the* feature — reuse its id, never create a second.
- **Re-parent strays** rather than recreating them. A sub-feature that has been flattened to top level gets `feature update <id> --parent <coreId>`, not a delete-and-recreate.
- **Never re-create an existing feature.** `codespring mindmap features --replace` does not replace — it appends (see `pitfalls.md`). Treat feature creation as add-only and diff first.
- **Never regenerate an existing PRD unless asked.** Read it, report that it exists, and offer to refresh it.
- **Never duplicate a task.** Match on the numbered title prefix and the feature id; continue the existing numbering rather than restarting.
- **Update notes in place.** `codespring mindmap note` overwrites the single note for a feature, which is the desired behaviour — but read the existing note first and preserve anything still true.

Report the diff to the user: created N, updated N, skipped N (already correct).

## 9. Verification after every write

**Run the script — it asserts all of this and exits non-zero on a real failure:**

```bash
bash codespring/scripts/fetch-project.sh --out /tmp/cs-verify
node codespring/scripts/check-map.mjs    /tmp/cs-verify --expect-core <the number you intended>
```

Assert, do not assume:

1. **Core-feature count** — fetch the mindmap and check `node-features.items.length` equals the number of core features you intended. Anything higher means sub-features were flattened.
2. **No flattened sub-features** — every sub-feature still carries the right `parentFeatureId`. Re-parent any stray (`pitfalls.md` §2). Keep a stored sub→core map so this is a one-liner on re-runs.
3. **No duplicates** — no two features share a title; no two PRDs share a `(feature, prdType)`.
4. **Notes present** — one "how it works" note per core feature.
5. **Tasks linked** — every task has a `--feature` id and a severity.

Then give the user the project link: `https://v2.codespring.app/project/<projectId>`.

---

## 10. FERB edge cases

Things FERB must handle deliberately, not discover:

1. **The map is the target, not the repo.** Until the tasks are done, a feature on the map may not exist in the code, and code that exists may not be on the map. FERB must not "correct" the map toward the messy reality, and must not tell the user a feature exists because it is on the map. The Kanban is the source of truth for what is actually built.
2. **After the tasks are done, resync.** `cs-build-resync-codebase` is what closes the loop and makes the map describe reality again. Prompt for it when a feature's tasks all reach done.
3. **A fix-in-place map still shows the target.** Its features look almost identical to the current app's — the difference is in the notes (what it *should* do) and in the tasks (what is wrong today). Do not skip the corrected-target step just because the verdict was fix in place.
4. **Findings text and task text differ on purpose.** The user-facing findings are plain English with no file paths; the task descriptions carry file references because an agent has to act on them. Never paste task text into a client-facing document.
5. **Evidence labels survive the handoff.** An UNVERIFIED finding must not become a confident task. Turn it into an investigation task ("check whether X — here is what would confirm it") and keep the label.
6. **The audit may be stale, and the codebase may be a moving target.** If the audit ran against a clone behind the remote, or a while ago, say so before acting on it and re-check the specific findings being worked. If the owner is still adding features to the same repo, the findings are a snapshot at a named commit (§3) — hold the SHA and re-check before acting.
7. **An existing map is not automatically a good map.** Run the map-quality ladder (`cs-build-import-codebase/references/target-map.md`) before trusting one. Never create a second CodeSpring project for the same app without explicit confirmation, and if there are already two, establish **which one is authoritative** before writing anything.
8. **There is no home for future ideas, and they must not become tasks.** Parked ideas live in the two named `FINDINGS.md` sections (§4a). A task list implies committed work; putting a "maybe later" idea on the board makes the whole board untrustworthy. This is a known product gap.
9. **Ask what is planned but not yet built.** On an app that is still being built, code missing for a mapped feature may just be unfinished, and pages nothing links to may be unfinished modules rather than dead ends or a separate product. Check the file's git history before concluding otherwise (§3a, rule 5).
10. **Routing is the five questions, never "do we trust it."** `project-state.md`. And "the code runs" is not the same as "the code does the job."
11. **Project placement is manual.** There is no CLI way to create a project in a specific workspace/organisation, and no way to move or delete one afterwards. If the project must live in a team workspace, the user creates it in the web app **first**, then links to it. See `pitfalls.md`.
12. **A rebuild verdict does not delete anything.** The old code stays until the new thing is proven. Any rebuild plan must include a rollback and an explicit point of no return. With live users it also needs a parallel-running plan and, by default, a branch in the same repo rather than a second one (§5).
