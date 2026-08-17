---
name: cs-build-plan-app
description: >
  Turn an idea into a CodeSpring plan — from a sales-call recording, a transcript,
  a voice note, or someone just talking at you about what they want. Interviews
  the person (or mines the recording) for the job the app does, walks the screens
  with them, picks the platform from what the app actually needs to do, finds the
  one technically hard part and names a real solution for it (including existing
  open-source prior art), cuts to a v1 that can be sold, then writes the map —
  core features, sub-features, notes — and hands off to cs-build-create-prd and
  cs-build-create-tasks. The no-code-yet counterpart to cs-build-import-codebase.
  Triggers, "plan my app", "generate a plan", "turn this recording into a plan",
  "I have an idea for an app", "design my app in CodeSpring", "map out this idea",
  "I've got a client call recording, make the plan", "plan from scratch".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(node:*) Bash(git:*) Bash(grep:*) Bash(rg:*) WebSearch WebFetch
metadata:
  author: codespring
  version: "0.7"
---

# Plan an app from an idea

There is no code yet. Produce the same artefact `cs-build-import-codebase` produces — **core features → sub-features → notes → PRDs → tasks** — but derived from a person instead of a repo.

**Two phases with a gate between them:**

| | | |
|---|---|---|
| **A. Think** (§1–§6) | Conversational, nothing is written | the job, the journey, every kind of user, the platform call, the hard part and what solves it, the systems checks, the v1 cut |
| **GATE** | **Read the plan back and get an explicit yes** | §6a |
| **B. Write** (§7) | CodeSpring gets touched | the map and the notes |
| **C. Show** (§7a) | Hand off to `cs-build-ui-mockup` | the cheapest possible disagreement — corrections come back into the notes |
| **D. Instruct** (§8–§9) | Only once the mockup is agreed | PRDs, then tasks |

**Never write to CodeSpring during phase A.** A map is expensive to unpick and it makes people feel committed to a plan they were still arguing with. Phase A is meant to be argued with.

This is the **no-code-yet counterpart to `cs-build-import-codebase`** and it deliberately does its own writing rather than handing over — that skill's engine is *reading a repo*, and there is no repo. What the two share is the destination, and that is already factored out: the node model and map rules in `cs-build-import-codebase/references/target-map.md`, the schema in `mindmap-structure.md`, the CLI in `commands.md`. Use those; do not re-derive them and do not fork them.

Shared knowledge, read it: `codespring` skill `references/project-state.md` (enter-from-anywhere, the three stages), `references/mindmap-structure.md` (the exact node/edge schema), `references/prd-management.md`, `references/pitfalls.md`. **And `cs-build-import-codebase/references/target-map.md` — the node model, the one-sentence-card rule and the 4–8 core feature ceiling are identical here; do not restate or re-derive them.**

Then this skill's own references, which cover what is different about planning from nothing:

| Reference | Read it when |
|---|---|
| `references/elicitation.md` | Always. Getting the real app out of a person's head, and out of a recording. |
| `references/platform-choice.md` | Before you name a stack. Mac vs web vs iOS decided by capability — **and the constraint that can overrule it: what the owner can actually build in and maintain.** Plus what each choice costs. |
| `references/hard-part-first.md` | Always. Every app has one genuinely hard bit; find it, find the prior art, prove it. |
| `references/data-and-shape.md` | Always, and the actor question **before the feature list is final**. The five systems checks nobody asks for: figures someone else publishes and how they get updated, logic shared across products, every kind of user and the owner's admin surface, whose database this lives in, and showing how current the data is. |
| `references/v1-scope.md` | Before you write the map. Cutting to one loop, and the revenue gate. |

---

## The difference that governs everything

**Importing a codebase has ground truth. Planning an idea does not.**

With a repo you can be wrong and find out — you read the file. With an idea, a confident plan that does not match what is in the person's head reads exactly like a good one, right up until they see it built. Every rule below exists to fight that.

The second thing, and it is the harder one:

> **They do not know what they don't know, and they do not know what they need.**

Non-technical people describe apps in terms of what they have seen. They will ask for the thing they saw on Instagram. Your job is not to transcribe their request and it is not to substitute your own product taste for theirs — it is to get at **the job they are trying to do**, then bring the technical judgement they cannot bring: what is possible, what is expensive, what already exists, and what the hard part really is. They own the *what*. You own the *how*, and you own telling them when the *what* is going to cost more than they think.

**Never let a planning session end with only their words in it.** If the plan contains nothing they could not have written themselves, you have taken dictation, not planned.

---

## 0. Detect where the project already is

Same entry as every other skill in the pack — you may not be starting from nothing even when the *code* is nothing.

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state   # read-only snapshot; prints the projectId
node ../codespring/scripts/state.mjs       /tmp/cs-state          # summary line + booleans and counts
node ../codespring/scripts/check-map.mjs   /tmp/cs-state          # map faults, before you add to them
```

Read `projectId` from the **local** `.codespring/config.json` and print it before any write.

- **A map already exists** → you are extending a plan, not starting one. Run the map-quality ladder in `target-map.md`, match on title, never re-create.
- **Code exists after all** → wrong skill. Route to `cs-build-import-codebase` (or `cs-build-audit-codebase` if it fails any of the five questions in `project-state.md`). A half-built prototype from Lovable/Base44/v0 **is** code, even if the user calls it "just a mockup" — go and look before you accept "there's nothing there yet."
- Not linked → link. Team workspace projects must be created in the **web app** first (`pitfalls.md`).

### ⚠️ Give the new project its own directory — the trap unique to this skill

Every other skill in the pack runs inside the repo it is mapping. **You have no repo**, so there is no natural home — and the directory you happen to be standing in is very often the parent folder of the user's *other* projects, which already has a `.codespring/config.json` pointing at one of them.

**Running `codespring init` there silently repoints that config at your new project**, and the next session on the sibling project writes into the wrong place. Real case: a planning run started in a folder whose config pointed at a live Mac app project; creating the new project in a fresh subfolder was the only thing that prevented hijacking it.

```bash
codespring status                       # ALWAYS run first — whose project is this directory linked to?
mkdir -p "<AppName>" && cd "<AppName>"  # a new directory for the new project, even with no code in it
codespring project create --name "..." --description "..."
codespring init --project <newId> --force
codespring status                       # confirm the new id
cat ../.codespring/config.json          # confirm the PARENT's link is untouched
```

That folder becomes the repo later, so this is not throwaway scaffolding. **Never `init` into a directory that is already linked to something else**, and never assume an empty-looking folder is unlinked — check.

## 1. Get the raw material in

The input is whatever exists: a call recording or transcript, a voice note, a Loom, screenshots of apps they like, a rambling paragraph, or a live conversation.

**Read all of it before asking a single question.** Turning up to an interview with questions the recording already answered is the fastest way to lose a non-technical person's confidence.

**Extract, do not summarise.** Pull out, in their own words:
- who it is for and what that person is trying to get done
- every screen, button, moment or behaviour they described
- every constraint they stated (platform, offline, price, deadline, audience age, accessibility)
- every reference app or screenshot, and specifically **what they liked about it**
- anything they said twice — repetition marks what actually matters to them
- anything they rejected, and why

**Keep their phrasing.** *"Five minutes is the floor, anything less isn't worth the time"* survives into the note and eventually into the PRD; *"configurable session duration"* does not. Their words carry constraints and reasons that yours will quietly drop.

Full method, including how to mine a sales call and what to do when the only input is a rambling voice note: `references/elicitation.md`.

## 1a. Ask what they are set on building it in — before anything else

One question, asked early, because the answer can invalidate the whole plan:

> **"Are you set on building this in a particular tool? Base44, Lovable, v0, Replit, Bubble, something else?"**

Non-technical people frequently already have a subscription and a half-learned tool, and they will not mention it unless asked — it does not feel like a requirement to them, it feels like a detail. **It is a hard constraint.** AI web-app builders emit web apps and cannot produce a native desktop or mobile app at all, so a plan that says "Mac app" is a plan they cannot execute.

Ask it here, in §1, not at §4 when the platform is being chosen — by then you have already reasoned toward an answer their tool may not be able to reach.

Follow-ups: *are you committed to it or just already paying for it?*, *who maintains this in a year?* Then carry the answer into §4 and resolve any conflict openly (`references/platform-choice.md` — *"the constraint that overrules capability"*).

## 2. Find the job before you find the features

One paragraph, agreed out loud, before anything else:

> **Who** opens this, **what** are they trying to get done, **what happens today** without it, and **how do we know it worked?**

If you cannot write that paragraph, you do not have enough to plan and more feature discussion will not help. Go back to §1.

The last part is not decoration. *"She does her three sessions a week"* is a testable outcome; *"she feels supported"* is not, and an app cannot be aimed at it.

## 3. Walk the screens with them

This is the elicitation engine and it works on people who cannot describe software:

> *Close your eyes and imagine you're using it. It's open in front of you. What's the first thing you see? What do you click? What happens then?*

Walk it as **a journey, not a feature list**: open → first screen → first click → the main thing they came to do → done → what brings them back tomorrow. Non-technical people are excellent at this and hopeless at "what are your core features."

**Sidebar-first.** For a desktop or web app, the question *"what's in the sidebar?"* produces the core feature list almost directly, and it produces one a user would recognise. Ask it in those words.

**Treat the sidebar as a prompt for finding core features, not as the definition of one.** A core feature is **a big thing the user does**. The sidebar is simply where most of them are listed, which is why the question works — but some apps have a major screen you reach by pressing a button rather than by clicking the nav, and it is still a core feature. *How* the user gets to it is a navigation detail for the note, not the thing that decides whether it goes on the map.

The test that actually matters: **is this a big thing the user does, and would leaving it off hide a large part of the build?** Both yes → it is a core feature, sidebar or not.

Still aim for 4–8 (`target-map.md`). If applying this puts you at ten, the list is too granular, not too honest.

**Then walk the *second* user — the one who puts the content in.** People describe the app from the point of view of the person using it and never mention who fills it with exercises, lessons, templates or programmes. An authoring tool is a second application and is routinely 30–50% of a build while appearing nowhere in the feature list. Ask where the content comes from on day one, who adds more, whether it differs per user, who decides the order, and **what happens on day two** — the most-skipped question in app planning. `references/elicitation.md`.

Script, follow-up questions, and what never to ask: `references/elicitation.md`.

### 3a. Name every kind of user — including the owner

Ask this **before the feature list is final**, because the answer adds features to it:

> **"Who are all the different kinds of people who use this, what can each of them see and do, and who administers it?"**

They will describe one user. There are usually four or five: the end customer; **their** customers, who often receive an output without ever logging in; staff; partners; and **the owner of the business running the app**.

**Almost every app needs an admin surface for the owner** — see who has signed up, manage plans and access, and edit the data the app depends on. It is missed at planning time on nearly every project and it is expensive to retrofit, because it changes the permission model rather than adding a screen. Ask what **plans or tiers** exist and what each unlocks, because that decides whether entitlement is one column or a whole subsystem. And state the security rule plainly: **permissions are enforced at the database and on the server, never only in the interface** — hiding a button is not access control.

Full list of actors people forget, and the owner-only data problem: `references/data-and-shape.md` §3.

## 4. Pick the platform from what the app must do

Do this **before** the feature list is final, because it changes what is buildable.

Decide on **capability**, never on preference or fashion:

| Needs | Points to |
|---|---|
| Camera + real-time local ML, filesystem access, background/menubar, true offline, heavy local compute | **Desktop (Mac)** |
| Shared by link, signup funnel, SEO, "just send it to them", cross-platform from day one | **Web** |
| Genuinely mobile-first — in a gym, in a field, out of the house | **Mobile** |

**iOS is almost never right for a v1**: review latency, Apple's cut, and an older audience that mostly prefers a larger screen. Say so plainly and say why.

Then state the consequences of the choice out loud, because they are what bite later: signing and notarization, how the thing gets distributed, how payment works, whether "offline" is real. Full decision table and the consequences of each: `references/platform-choice.md`.

**Then ask the question that can overrule all of it: *what will they actually build it in, and who maintains it after you leave?*** Capability says what the app *needs*. This says what the person can *keep*. If they are committed to a tool that cannot produce the platform capability points at — an AI web-app builder cannot emit a native desktop app — you have a genuine conflict, and the resolution is a conversation, not a silent override in either direction. Do not quietly plan a platform they cannot build in, and do not quietly drop a capability because their tool is easier. Put both costs on the table and let them choose. `references/platform-choice.md` — *"the constraint that overrules capability"*.

### 4a. Inherit the stack from an app they already own

Once the platform is chosen, **ask whether they already have a working app on that platform** — theirs, or one you built for them. **Ask; do not go looking.** A codebase sitting in a neighbouring folder is not automatically a reference — it may be internal, abandoned, or on a platform this project has just ruled out. Confirm it is a deliberate template before reading a line of it, and drop it the moment the platform decision moves.

If it is confirmed, read its manifest and mirror it: same language version, same dependencies, same database layer, same design-system target, same build and release scripts.

This is not laziness, it is the single cheapest quality decision available:

- The stack is **already proven to ship** on that platform, including the tedious parts — signing, notarization, auto-update, crash reporting.
- The **design system already exists**, so the visual language is consistent and free.
- **Components you were about to spec may already be built.** In a real run, a client wanted a glass-blurred panel with an inset white card; the reference app's design-system target already contained exactly those two components. That is a whole task that evaporated because someone looked.
- The person maintaining both apps only has to know one stack.

So: read the reference app's `Package.swift` / `package.json` / equivalent, its design-system folder, and its `scripts/`. Record the inherited stack on the map's tech-stack node, and **name the reference app in the notes** so the builder knows where to copy patterns from rather than inventing them.

If there is no reference app, choose a boring, well-trodden stack and say why.

## 5. Find the hard part, and find who already solved it

**Every app has exactly one genuinely hard thing.** The rest is screens, forms and lists. A plan that has not named the hard thing is not a plan — it is a wish, and the build will discover it in week three.

Say which part it is, out loud, then:

1. **Search for prior art before designing anything custom.** Someone has almost certainly solved this. Use WebSearch/WebFetch; look for maintained libraries, platform-native frameworks (often the best answer and the most overlooked), and open-source repos.
2. **Check the licence, every time.** The most googlable library in a field is frequently the one that cannot be used commercially. This kills projects late and expensively.
3. **Prefer the platform-native framework** where one exists — no dependency, no licence question, better performance, and it survives OS updates.
4. **The hard part becomes task #1**, as a throwaway spike that proves it works on real input before a single screen is designed.

Method, the licence trap with worked examples, and how to write the spike: `references/hard-part-first.md`.

## 5a. Run the systems checks — the questions nobody asks for

Four more questions, asked out loud in the Think phase, before the v1 cut and before the gate. Nobody requests any of this and no user can describe it, but each one is **cheap as a decision and expensive as a retrofit**. The fifth — who the users are — was §3a, because it changes the feature list.

1. **"What figures does this app rely on that somebody else publishes — and what happens on the day they change?"**
   Tax and duty rates, statutory thresholds, interest or benefit rates, tariffs, postage, currency, compliance limits, licence fees, minimum wage. If there are any: **they belong in the database, not in the code**, as rows carrying **the dates they apply between**; the app resolves the value that applied **at the date of the thing being modelled** — including across a change already announced for a future date; anything saved **records which version produced it**; the app **knows when its data has expired** and says so. **Do not assume an API exists** — for many public datasets there is none, and scraping the publisher's site is more fragile than a maintained table because it fails by shipping wrong numbers rather than by stopping. Plan the honest version: a table, an import script, a dated review, and a written record of sources. And **give the owner a screen to edit it**, because they will need to model an announced-but-not-yet-legislated change before you can ship an update.
2. **"Is this app one of several that will share the same core logic?"**
   If yes, the shared part is **one package every product imports** — never copied, never reimplemented. It must be **pure**: no database, no network, no framework, no clock, no randomness; everything it needs is passed in. Give it a **version number**, and split it into **small files by topic**, because one huge file is what makes people copy a function out instead of importing it. Two copies always diverge, silently, until two parts of the business quote different numbers for the same thing.
3. **"Does the organisation already have a database, and is another product — or another person — already working in it?"**
   **Default to a separate database per product**, with the same ownership boundary in both so they can be merged later. Merging two well-shaped databases is a migration; unpicking one tangled database is a rebuild.
4. **"Does the user need to know how current the data is, or prove where a figure came from?"**
   If an output drives a financial, legal or medical decision it must show **what data it used and as at when**. Never assert currency the app cannot verify. Label estimates and assumptions **where they appear**, and let the user override them.

Reasoning, the rules in full, and a worked example for each: `references/data-and-shape.md`.

## 6. Cut it to a v1 that can actually ship

They will describe the finished product. Your job is the **first version that delivers the job in §2 end to end** — one complete loop, working, sellable.

- **One loop, whole.** A user opens it, does the main thing, and gets the outcome. Nothing half-present.
- **Cut breadth, never depth.** Five features at 60% is a broken app. One feature at 100% is a product.
- **Tracking features are not v1 features.** Anything whose value is "the user types in what they did" has near-zero pull and dies in week two. Features where the app *does something for them* are what people come back to. See `references/v1-scope.md` — this is the most common way an idea-plan goes wrong.
- **The revenue gate:** if the person needs this to make money, ask *"how does someone pay for this?"* and make sure the answer exists in v1. A v1 with no way to take money cannot produce revenue no matter how good it is, and this gets missed on nearly every plan because it is not a feature anyone is excited about.
- **Ask what the real cost is — it is often content, not code.** Apps that need a media library, a data set, an exercise catalogue or a document corpus are usually 20% software and 80% acquiring the content. If so, say it now and plan the pipeline, because it is the schedule risk. `references/v1-scope.md`.

Name what is *not* in v1 as explicitly as what is — an unspoken cut is heard as a broken promise later.

## 6a. THE GATE — read it back, get a yes

**Nothing has been written yet. Do not proceed without an explicit go-ahead.**

Narrate the plan back the way they described it in §3 — *"they open it, they see X, they click Y, then Z happens"* — then add the things they could not have supplied themselves:

1. **The platform call and why** (one sentence, repeatable).
2. **The hard part, and the named thing that solves it** — including its licence.
3. **Every kind of user, and what the owner gets** — the admin surface, the plans, and what only the owner can edit (§3a).
4. **Any figures somebody else publishes**, where they will live, who updates them and how often (§5a) — plus the database call, if there was one to make.
5. **What v1 is, and explicitly what it is not.**
6. **How someone pays**, if money is needed.

Then ask, in these words: **"What did I get wrong, and what's missing?"**

People correct a story. They rubber-stamp a feature list. This is the last cheap moment to be wrong — after §7 the plan exists as a map, notes and tasks, and changing it costs real work.

Iterate here as many times as it takes. **Only when they say yes, continue.**

## 7. Write the map

Identical mechanics to `cs-build-import-codebase` §4 — the node model, the one-sentence card rule and the notes-are-root-only constraint all come from `target-map.md`. Do not re-derive them.

```bash
codespring mindmap set-info --title "..." --description "..."
codespring mindmap tech-stack --replace --add '[{"id":"tech-...","title":"...","description":"Frontend"}, ...]'
codespring mindmap features --add '[{"title":"Today","description":"..."}, ...]'   # CORE features; keep the returned ids
codespring feature create --parent <coreId> --title "..." --description "..."       # sub-features
codespring mindmap note <coreId> --title "How it works — X" --text "$(cat note.txt)"
```

**`codespring mindmap features --replace` does NOT replace — it appends and duplicates** (`pitfalls.md`). Diff by title and add only what is missing. Recovery: `codespring feature delete <id> --yes`.

**The note is the whole deliverable on this path.** With no code to read, the note is the *only* context the PRD generator gets — a thin note here produces a thin PRD, and there is no repo to fall back on. Each core feature's note carries:

1. **What this feature does**, in the user's own words wherever possible.
2. **The screens and the journey** — what the user sees, clicks, and gets.
3. **The decisions and why** — platform, chosen library and its licence, the data model in plain terms, and anything deliberately deferred with the reason.
4. **The §5a answers that belong to this feature** — which published figures it uses and where they live, what it shares with another product, who is allowed to see and edit each thing, and what the interface has to show about how current the data is. These are invisible in a feature list and they are what the PRD and the tasks need in order to build the right shape.
5. **What is explicitly not in v1**, so it does not get quietly built.

Write the notes **before** generating any PRD.

## 7a. Hand off to `cs-build-ui-mockup` — BEFORE the PRDs

**Do not generate PRDs from a plan nobody has seen.** The map and notes are agreed in words, and words are not enough: a person will sign off a written plan they have not actually understood, because prose lets both sides fill the gaps differently and neither notices.

**Run `cs-build-ui-mockup`.** It builds a throwaway clickable mockup from these notes, runs the review that surfaces what the plan could not express — screen order, hierarchy, position, and choices that turn out to be incomplete — and writes every correction back into the notes and tasks.

A real run produced **eleven corrections in ten minutes** from a plan that had already passed the gate and looked complete. None had surfaced in written review.

Come back here only if the review changes the feature set. Otherwise the chain continues: mockup → `cs-build-create-prd` → `cs-build-create-tasks`.

## 8. Verify

Run the check, don't eyeball it:

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-verify
node ../codespring/scripts/check-map.mjs   /tmp/cs-verify --expect-core <the count you intended>
```

Core count matches; no sub-features flattened to top level (re-parent with `codespring feature update <subId> --parent <coreId>`); no duplicate titles; one note per core feature. A non-zero exit is a real failure — fix it before reporting. Then give the project link `https://v2.codespring.app/project/<projectId>`.

## 9. Hand off

**PRDs → `cs-build-create-prd`** (Both, per core feature). Never generate a PRD for a feature with no note.
**Tasks → `cs-build-create-tasks`**, with the §5 spike as task #1.
**Then → `cs-build-feature`.**

## 10. Report what now exists

One short close, because the person needs to know what they own: the project link, the core features by name, that every one has a note, and **the single next action** — normally *"task #1 is the spike that proves the hard part; do that before anything else."*

---

## What good looks like

- The **job paragraph** exists and was agreed before any feature was named.
- The feature list came out of a **walked journey**, not a brainstorm, and lands at 4–8 core features a user would recognise as sidebar items.
- The **platform was chosen on capability** and the consequences were stated, not chosen by default or by fashion.
- The **hard part is named**, has real prior art with a **checked licence** whose obligation was stated in one line, and is task #1 as a spike.
- **Every kind of user was enumerated before the feature list closed**, the owner has an admin surface, and permissions are stated as enforced on the server and in the database.
- **Every figure somebody else publishes was named**, lives in dated rows rather than in code, resolves by the date being modelled, and has a real plan for staying updated — with no assumption that an API exists.
- Where the same logic runs in more than one place, it is **one pure, versioned package** rather than a second copy, and the database decision was **deliberate** rather than inherited.
- The new project got **its own directory**, and no sibling project's link was clobbered.
- Where a proven app on the same platform already existed, its **stack and design system were inherited** rather than reinvented.
- **v1 is one complete loop**, and if the person needs money from it, there is a way to pay in v1.
- If the real cost is **content rather than code**, that was said out loud and a pipeline exists.
- The **notes are thick** — they are the only context a PRD will get on this path.
- **Nothing was written to CodeSpring before the gate**, and the plan was read back as a story with *"what did I get wrong?"* asked out loud.
- The plan contains **technical judgement they could not have supplied themselves.** If it is only their words tidied up, it is dictation.
