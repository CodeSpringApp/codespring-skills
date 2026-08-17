# Building the map — the node model, the corrected target, and how to keep it small

Applies to any codebase in any language. The named examples (a report's sections, a form's field-groups, a 13-feature first attempt) are **labelled worked examples** from real runs, not assumptions about the repo in front of you.

Two inputs, one output shape.

| Input | What the map shows |
|---|---|
| **No audit** | What exists — the app documented as it is today |
| **An audit + a verdict** | **The corrected target** — what the app *should* look like, simplified into core features a non-expert recognises |

## The settled decision

**The mindmap always shows the corrected target. It never shows the messy current structure annotated with warnings.** True on a rebuild verdict and true on a fix-in-place verdict.

Recorded rationale:

- **The map means one thing.** Nobody reading a CodeSpring map — user or agent — has to ask "is this the real structure or the intended one?" It is always the intended one.
- **The Kanban always means the same thing:** the gap between here and there. Every task closes a distance between the map and reality, whether that task builds a feature or fixes one.
- **One drawing model.** No second node type for "broken", no warning badges, no annotation layer, and nothing extra to unwind when a task is finished.

Accepted cost: **the map does not mirror the repository until the tasks are done.** Disclose that to the user in one sentence. It is arguably a feature — the map shows people where they are going, which is what a non-expert needs to see — and `cs-build-resync-codebase` is what brings the two back into agreement afterwards.

**A fix-in-place target map looks almost identical to the current app.** The difference lives in the notes (what each feature *should* do, including the corrections) and in the tasks (what is wrong today). Do not skip the corrected-target step just because the verdict was fix in place.

Where a finding has no home in the target map — dead code being deleted, a page being removed — it becomes a task without a new feature. Attach it to the nearest core feature, or to a core feature named for the cleanup. **Never invent a feature just to host a defect.**

---

## Is the existing map any good? — the ladder

*"A map already exists → keep it"* is too blunt. An import can produce a map that is genuinely unusable, and keeping it means every note, PRD and task afterwards inherits the confusion. Walk the ladder, in order, and say out loud which rung you landed on.

**1. Does a map exist?** No → build it (the rest of this file).

**2. Is it good?** Judge it against these tests, not against your own taste:

- **Core features are 4–8**, and each one is something a user would recognise as a **sidebar item**.
- **Sub-features are things a user *does*** — verbs — not sections of an output document and not groups of form fields.
- **Every core feature has a note**, and the **card descriptions are one sentence** with the depth in the note (below).
- **No duplicates** — no two features share a title.
- **No sub-features flattened to top level** (`pitfalls.md` §2).

Run the machine-checkable half rather than counting by hand — it is identical every time:

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state
node ../codespring/scripts/check-map.mjs /tmp/cs-state            # add --expect-core N once you know the number
```

It settles the count, duplicate titles, flattened sub-features, missing notes, duplicate PRDs and unlinked tasks. **The judgement calls stay yours:** whether a core feature is really a sidebar item, whether a sub-feature is a verb, and whether the whole thing is comprehensible. A map can pass every check and still be wrong.

**3. Good → keep it.** Update the notes, add the tasks. **Never recreate it.** Print the core features and their ids and move on.

**4. Fixable** — mostly right, a few strays → **fix it in place, and say what you changed:**

```bash
codespring feature update <subId> --parent <coreId>     # re-parent a stray sub-feature
codespring feature delete <dupId> --yes                 # remove a duplicate (cascades)
codespring feature update <id> --title "..."            # rename to something a user would recognise
```

**5. Not fixable** — so wrong that it is confusing: wildly too many core features, sections of an output document standing in as features, no coherent structure → **do not try to salvage it.** Explain plainly *why* it cannot be fixed (say which tests it fails and how many features would have to change), and recommend a **new CodeSpring project with a clean map**, telling the user the old project **stays as history**. **Get explicit confirmation before creating a second project — never silently.**

### Warning: two projects for one app

This is a real case, not a hypothetical. An import produced a **13-core-feature** map that the owner could not use; the fix was a **second** CodeSpring project with a clean **6-feature** map. **Both still exist.**

- **Two projects for one app gets confusing later** — links, notes, PRDs and tasks split across two places, and nobody remembers which is current.
- So it must be a **deliberate, explained choice**, never a quiet workaround for a map you did not want to fix.
- **Tell the user which project is now authoritative**, in those words, and record it in the new project's info/description so the next session does not have to guess.
- On entry, if you find two projects for one app, establish which is authoritative **before writing anything** (`project-state.md`).
- There is no `project delete` and no way to move a project between workspaces, so a second project is permanent. Name it so the difference is obvious.

---

## How a map is stored — the node model

The same shape for every project, whatever the codebase. Exact node ids, edge handles and JSON live in `mindmap-structure.md`; this is the model you need in your head before you write anything.

- **Core features are items on one node.** The features node holds an array of items, and each item **is** a core feature card — a `title` and a one-sentence `description`. There is no separate node per core feature.
- **Each core feature gets a sub-feature group node.** One node per core feature, holding that feature's sub-feature cards and pointing back at its core feature (`parentFeatureId`). That parent link is the whole difference between a sub-feature and an extra core feature, and it is the thing that breaks (`pitfalls.md` §2).
- **Detail attaches through a bridge.** A feature card connects to a **bridge node**; the bridge connects to the detail cards — the **note card** (one per core feature) and, later, a PRD bridge carrying the Frontend and Backend PRD cards. Nothing detailed hangs off a feature card directly.

```
features node ──(card)──► bridge ──► note card
                             └────► PRD bridge ──► Frontend PRD / Backend PRD
```

### Where detail goes — the rule

> **Card descriptions stay to one short sentence. ALL detailed information goes into a note card attached to that feature via a bridge — never into the card description.**

Cards are read at a glance on a canvas, so a paragraph on a card hides the structure the map exists to show. The note card has no practical length limit, and it is the **note** — not the card — that the PRD generator reads as its context (`project-state.md`).

**Notes are root-feature-only through the CLI** (`pitfalls.md` §5): `codespring mindmap note <coreFeatureId>` overwrites that core feature's single note, and a sub-feature cannot have one. So **sub-feature detail belongs in the parent core feature's note** — which is one more reason not to invent sub-features to hold detail.

### The real failure this prevents

First attempt on a real app: long descriptions written onto the cards **and** the report's own sections and the form's field-groups promoted into sub-features → **13 core features, unusable**, and the owner said so plainly. Second attempt: **6 core features**, one-sentence descriptions, every piece of depth in the notes → usable. Same codebase, same information, different placement.

---

## The smallest set of core features that a user would recognise

The first run on the real app produced **13 core features** and the user found them confusing. After redirection it produced **6**, which were right. Push hard toward the smallest set.

**Test for a core feature:** would this be a sidebar item? Would the user point at it and say "that's a thing my app does"? If the answer needs explaining, it is not a core feature.

**Test for a sub-feature:** is it something the user **does**? A verb. *Save a client. Compare two properties. Export the PDF. Enrol someone.*

### The specific mistake that was made — do not repeat it

**Sub-features are not sections of an output document, and they are not groups of form fields.**

The first run turned the report's own sections into sub-features ("Government costs", "Tax benefits", "Market intelligence", "Glossary", "How to read these figures") and turned form field-groups into sub-features ("Location", "Loan details", "Property details"). Both are wrong:

- **A report section is not a feature.** It is part of the output of one feature. Twelve report sections do not make twelve features — they make one feature called "the report", and the sections are detail that belongs in that feature's note.
- **A form field-group is not a feature.** It is part of the input to one feature. "Location" is not something a user does; *analysing a property* is, and Location is one panel of it.

Symptoms you have made this mistake: core features that read like a table of contents; sub-features that are nouns rather than verbs; more than about 8 core features on an app with 6 screens; two sub-features that a user could not tell apart.

### Practical shape

- **Core features: aim for 4–8.** Above 8, argue for each one. Above 10, you have almost certainly split an output document or a form.
- **Sub-features: the actions inside that feature.** A handful each, not twenty.
- Depth goes in the **note**, not in more features. If detail is being lost, the note is too thin — enrich it rather than adding features.
- **Card descriptions stay one sentence.** Always.

### Building the target list from an audit

1. Start from what the app is *for* — the two or three jobs a user comes to do.
2. Take the real navigation as the candidate list (`analyze-codebase.md` §6), then **collapse**: merge screens that are one job split across pages, and drop pages that the target does not have (dead ends, orphans, internal galleries shipping to production).
3. Add features the target genuinely needs and the current app lacks **only where the audit put them in bucket 1** — a *fix* that has no home in the current structure (durable storage for records that currently live in one browser, an accounts/sign-in feature where there is none). A bucket-2 "could add later" idea **never** becomes a feature on the map; it lives in the *"Could add later — deliberately not doing now"* section of `FINDINGS.md` (`auditing-and-fixing.md` §4a).
   **On an app that is still being built, ask what is planned but not yet built before you finalise the list.** Code that is missing is not proof a feature is missing, and pages nothing links to may be unfinished modules rather than dead ends.
4. Name them the way the user talks, not the way the code is organised.
5. Read the list back to the user and ask them to cut it before you write anything.

---

## Writing the notes

One "how it works" note per core feature. On the audit path each note says three things:

1. **What this feature should do** — the target behaviour, plainly.
2. **How it works today** — the real structure, files, routes and data, at the depth in `analyze-codebase.md` §8–9. The PRD generator reads this note as its context, so thin notes produce thin PRDs (`project-state.md`).
3. **What is wrong with it today** — the audit findings that belong to this feature, each with its severity and its file reference, and, on a rebuild, the "do not reintroduce this" constraints.

Notes are **root-feature only** and there is one per feature, which the CLI overwrites (`pitfalls.md` §5). Put sub-feature detail and cross-feature links inside the parent's note. When updating an existing note, **read it first and preserve what is still true.**

---

## CLI reality check before you write

- `codespring mindmap features --replace` **does not replace — it appends**, creating duplicates. Treat feature creation as add-only, diff by title first. Recovery is `codespring feature delete <id> --yes`, which does work and cascades.
- There is **no `project delete`**, and no way to move a project between workspaces or organisations from the CLI — `project create` ignores `--org` and stamps `organizationId: null`. If the project must live in a team workspace, the user creates it **in the web app first**, then you link to it.
- Always read `projectId` from the **local** `.codespring/config.json` and print it before any write.

Full details and the rest of the failure modes: `pitfalls.md`.
