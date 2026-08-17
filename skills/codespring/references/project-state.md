# Project State Detection — enter from anywhere

**The user should never have to know which skill to run.** They will invoke whichever one they remember, from whatever point they are actually at, and it must work. That is only possible if every skill starts by finding out where the project already is and then does the right *next* thing — not the thing its own name implies.

So: **every CodeSpring skill begins with the same state-detection block.** This file is that block. Skills point here rather than re-implementing it.

---

## The three stages, and the seam between them

| Stage | Produces | Artefacts | Skills |
|---|---|---|---|
| **Understand** | **context** — what is true now, and what it should be | audit findings, `FINDINGS.md`, core features + sub-features, one "how it works" note per core feature, tech stack | `cs-build-audit-codebase`, `cs-build-import-codebase` |
| **Plan** | **instructions** — what to build and in what order | PRDs (Frontend / Backend), numbered Kanban tasks with severities | `cs-build-create-prd`, `cs-build-create-tasks` |
| **Build** | **changed code** | commits, tasks moving to done | `cs-build-feature` |
| *(then)* | **truth again** | the map redrawn to match what was actually built | `cs-build-resync-codebase` |

**Where Understand ends and Plan begins — this is the seam people get wrong.** Understand writes *context*. Plan writes *instructions*. They connect in exactly one direction: **a PRD reads the note that Understand wrote.** The PRD generator uses the feature's note as its context, so a Backend PRD for a calculation engine belongs to Plan — but it is only any good if Understand wrote a real note first. A thin note produces a thin PRD, which produces vague tasks, which produces the wrong code. If a note is thin, go back and fix the note; do not compensate in the PRD.

The practical rule: **never generate a PRD or a task for a feature that has no note.** Write the note first, always.

---

## The detection block

Run this at the start of every skill, before any write. It is cheap.

**Run it as the script, not by hand** — the summary must be identical every run, and a hand count is exactly where the core-feature number goes wrong:

```bash
bash codespring/scripts/fetch-project.sh --out /tmp/cs-state   # read-only snapshot; prints the projectId
node codespring/scripts/state.mjs        /tmp/cs-state         # the summary line + every boolean and count below
node codespring/scripts/check-map.mjs    /tmp/cs-state         # what is already wrong with the map, before you add to it
```

What that reads, if you ever need it by hand:

```bash
cat .codespring/config.json 2>/dev/null      # LOCAL project id — the only one to trust. Print it.
codespring auth status                       # also refreshes an expired token
codespring status                            # linked? which project?
codespring mindmap --json                    # project info, tech stack, node-features items, notes, PRD bridges
codespring features                          # core features (root) + sub-features, with ids and titles
codespring prds                              # PRDs per feature
codespring tasks --json                      # tasks in ALL states, not just todo
ls FINDINGS.md 2>/dev/null                   # has an audit already been written up?
```

Reduce the output to six booleans and two counts:

| Signal | How to read it |
|---|---|
| `linked` | local `.codespring/config.json` exists and has a `projectId` |
| `coreFeatures` | count of `node-features.items` in the mindmap |
| `subFeatures` | count of features with a `parentFeatureId` |
| `notes` | count of `notes-*` nodes — should equal `coreFeatures` |
| `prds` | count of PRD records |
| `tasks` | count of tasks in **all** states |
| `audited` | `FINDINGS.md` exists in the repo, or a note/task references an audit |
| `stack` | `node-tech-stack` has items |

**Print the summary to the user in one line before doing anything else**, e.g.
`Project "PIA App (clean)" — 6 core features, 25 sub-features, 6 notes, 0 PRDs, 0 tasks. Audit: not yet.`

That single line is what makes entering from the wrong place harmless: the user immediately sees where they are, and you immediately know what to skip.

---

## Branch on what you found

| What exists | Where the project is | The single next step |
|---|---|---|
| Not linked | Nothing | Link it. Existing project → `codespring projects` + `codespring init --project <id> --force`. New → create it **in the web app** if it must live in a team workspace (see `pitfalls.md`), then link. |
| Linked, no features | Understand not started | Run the **five questions** below. All five yes → `cs-build-import-codebase`. Any no → `cs-build-audit-codebase`. No code yet → plan from scratch. |
| Features, no notes | Skeleton map only | Write the "how it works" note per core feature. Do not generate PRDs yet. |
| Features + notes, no PRDs, no tasks | **Understand done, Plan not started** | If not `audited` and the user came in wanting fixes → audit, then tasks. Otherwise → PRDs (`cs-build-create-prd`) then tasks (`cs-build-create-tasks`). |
| Features + notes + PRDs, no tasks | Plan half done | `cs-build-create-tasks`. |
| Tasks in `todo` | Ready to build | `cs-build-feature`. |
| Tasks mostly `done`, code has moved | Built | `cs-build-resync-codebase`. |
| `audited` but no tasks | Audit done, nothing actionable yet | Turn the findings into tasks. Re-read `FINDINGS.md` first; do not re-audit. |

**Always name exactly one next step.** Not a menu. If two are genuinely equal, pick one and say why.

---

## The five questions — is this code worth building on?

**Never ask "do you trust the code?"** or "is it working well, or is it a mess?" Those mean nothing to the person answering, and the answer changes with their mood. Ask these five, in this order, and get an answer to each:

1. **Does the app do what it actually needs to do?**
2. **Is it getting things wrong, or presenting made-up or unverifiable figures as fact?**
3. **Does the current architecture allow it to do what it needs to do?**
4. **Can we build on it scalably?**
5. **Can users use it without it breaking?**

**All five yes → keep building on it** (`cs-build-import-codebase`). **Any no → consider rebuilding that part, or all of it** — start with `cs-build-audit-codebase`, because a "no" tells you *which* part is not fit for purpose, and the verdict (`auditing-and-fixing.md` §5, including the has-users gate) decides whether that part gets fixed where it stands or rebuilt. A "no" is never on its own an instruction to rewrite the app.

**The distinction that matters: "the code runs" is not the same as "the code does the job."** A vibe-coded app very often runs fine — no crashes, no errors in the console — and still fails questions 1, 2 and 3. Running is the cheapest of the five properties to have and the one users notice least.

> **Worked example (illustrative only — not an assumption about the codebase in front of you).** A calculator that technically works: every button responds, nothing throws. It silently reports **$0 in government charges** when a location code is entered in the wrong case, and it has no accounts, no server and no database of its own. It runs fine. It fails **1** (it cannot do the job for a second user or a second device), **2** (it prints a confident zero and claims official figures) and **3** (there is nowhere to put durable, shared data).

Where the answers are guesses rather than knowledge — the user often does not know — run the quick health smell test below and answer questions 2, 4 and 5 from evidence instead.

### Two things the counts alone won't tell you

- **An existing map is not automatically a good map.** Before building anything on top of one, judge it against the **map-quality ladder** in `cs-build-import-codebase/references/target-map.md`: does it exist → is it good → is it fixable → is it beyond fixing. A map with 13 core features that read like a table of contents is worse than no map, because every note, PRD and task inherits the confusion. Fix it in place where you can; recommend a second project only when it is genuinely unsalvageable, and only with the user's explicit confirmation.
- **There may be more than one project for the same app.** `codespring projects` can show two, because an unusable map was once replaced by a clean one rather than repaired. If so, **establish which project is authoritative before writing anything** and tell the user which one you are using. There is no `project delete`, so both will stay.

---

## Worked example — the case this was designed against

`PIA App (clean)`: **6 core features, 25 sub-features, 6 notes, 0 PRDs, 0 tasks.** The user runs `cs-build-audit-codebase`.

Correct behaviour:

1. Detect: `coreFeatures = 6`, `notes = 6`, `tasks = 0`, `prds = 0`. Understand is essentially done, and the map passes the quality ladder — 6 core features, all sidebar-level, sub-features are verbs, a note each, no duplicates, nothing flattened.
2. **Do not create features.** Do not "build the target map" — it already exists. Print the six titles and the ids and move on.
3. Run the audit on the code.
4. **Update** the existing notes only where the audit adds something the note did not know (a defect, a silent failure path, a stale data set). Read each note first; preserve what is still true.
5. Create the Kanban tasks from the findings, each linked to one of the **existing** six feature ids.
6. Verify: still 6 core features, still 25 sub-features correctly parented, notes still 6.

The failure mode this exists to prevent: producing a **second** set of features, so the project ends up with 12 core features and a map nobody trusts. `codespring mindmap features --replace` appends rather than replaces (`pitfalls.md`), so that mistake is one command away and is tedious to undo.

Note the project's name — *"(clean)"*. It is the **second** CodeSpring project for that app: the first import produced 13 confusing core features, and the map was replaced rather than repaired. That is why the ladder exists, why a second project needs explicit confirmation, and why any session that finds two projects for one app must say which one is authoritative before it writes.

---

## Quick health smell test

Used when the user doesn't know whether their app is "healthy" or "a mess", and by `cs-build-import-codebase` to decide whether to offer an audit before importing. Two minutes, read-only, no sub-agents:

```bash
git fetch --quiet; git rev-list --left-right --count HEAD...@{u}   # is the local clone behind the remote?
ls -a .github/workflows 2>/dev/null                 # any CI?
# tests present at all? (adapt to stack)
grep -rEl '(^|[^a-z])(test|spec)\.' --include='*' -m1 . 2>/dev/null | head
# swallowed errors
grep -rEn 'catch *\([^)]*\) *\{ *\}|catch *\{ *\}|except *:? *pass' . | head -20
# secrets in shipped source
grep -rEn 'eyJ[A-Za-z0-9_-]{20,}|sk_live_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY' . | head
# browser-only storage
grep -rEn 'localStorage|indexedDB|sessionStorage' . | wc -l
# duplicated logic: the same distinctive constant or function name in more than one file
```

Six smells, any two of which mean "offer the audit":

1. No tests and no CI — nothing protects a change.
2. Deploy is not gated — merge ships straight to production.
3. The local clone is behind the remote — you would be auditing the wrong code.
4. Swallowed errors — silent failure paths.
5. Credentials in shipped source.
6. Records that live only in a browser, or reference data (rates, prices, thresholds) hardcoded in source.

Report the count plainly — *"I found 4 of the 6 things that usually mean an app needs diagnosing before mapping. Want me to audit first?"* — and let the user decide. Never audit without being asked; never import a mess silently either.

---

## Idempotency and verification

Both are non-negotiable on every run and are specified once in `auditing-and-fixing.md` §8 (idempotency: match on title, re-parent strays, never re-create, never regenerate a PRD unasked) and §9 (verification: core-feature count, no flattened sub-features, no duplicates, notes present, tasks linked). Every skill applies both.

**A check is a script; a judgement is prose.** The verification above is `codespring/scripts/check-map.mjs` — run it and read the exit code rather than re-deriving the counts in prose. What stays a judgement, and stays in prose: whether the map is *good*, whether a core feature is really a sidebar item, and whether to fix or rebuild.
