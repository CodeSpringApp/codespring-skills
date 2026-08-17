---
name: cs-build-handoff
description: >
  Turn a finished CodeSpring plan into the pack a paying client actually
  receives — a plain-English summary of what is being built, the mockup and its
  style guide, the plan and task links, an honest phase-by-phase build order,
  what was assumed, what is still open, what is needed from them, and exactly
  what to do next to start building. Written at a reading level a non-technical
  owner can follow, with no file paths and no jargon. Run it once the map,
  notes, PRDs and tasks exist and the plan is about to leave your hands.
  Triggers, "hand this over to the client", "create the client pack", "write the
  handover", "send them the plan", "what do I send the client", "onboard them
  onto this plan", "package this up for delivery".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(node:*) Bash(git:*) Bash(grep:*) Bash(rg:*)
metadata:
  author: codespring
  version: "0.1"
---

# Hand the plan over

**When the plan is the product, the handover is the delivery.** Everything upstream produced artefacts for the build — a map, notes, PRDs, a task board. None of those are written for the person paying, and handing someone a link to a canvas they have never opened is not a delivery.

This produces the thing they receive.

Run it **after** `cs-build-create-tasks`, once the map, notes, PRDs and tasks all exist.

Read: `codespring` skill `references/project-state.md` and `references/pitfalls.md`, and **`cs-build-audit-codebase/references/plain-english-writeup.md`** — the voice rules there apply here exactly. Third-grade reading level, no file paths, no jargon, no framework names.

---

## 0. Check there is something to hand over

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state
node ../codespring/scripts/state.mjs       /tmp/cs-state
node ../codespring/scripts/check-map.mjs   /tmp/cs-state
```

**Do not hand over a plan with holes in it.** Check and say plainly if any of these are missing:

- Core features, each with a real note
- PRDs on every core feature
- Tasks, numbered, ordered, each linked to a feature
- A mockup, if the thing has a user interface

A missing piece is not a reason to write around it — go back and finish it. The one exception is where something is deliberately deferred, and then it belongs in **"what we haven't decided yet"** rather than being quietly absent.

## 1. Know who is reading it

Usually a non-technical owner who has paid real money and is nervous. Often they have been burned by a previous agency or program.

**Write for them, not for the builder.** Two consequences that decide the whole tone:

- **No jargon, no file paths, no framework names, no task IDs in the prose.** They do not need to know what a PRD is to understand what they are getting.
- **Say what it does for their user, not how it is built.** "She picks how long she has and the app runs the session" — not "the session controller reads the workout schema".

If they *are* technical, they will not be annoyed by clarity. The reverse is not true.

## 2. Write the pack

One document. Sections in this order, because that is the order their questions arrive in.

### What we're building
Two or three paragraphs, plain English, in **their own words wherever possible** — pull the phrasing straight out of the call or the notes. They should recognise their idea, said back more clearly than they said it.

State the job it does and who it does it for. No feature list yet.

### What it does
The core features, each with a sentence or two on what the person using it can actually do. **Named the way they talk**, not the way the map is organised.

If there is a mockup, put the screenshots here, beside the feature each one shows. This is the section they will read most carefully.

### What you'll see
The mockup: how to run it, or where it is hosted, and one line making clear it is **a sketch of the finished thing, not the app** — nothing in it works yet, the data is made up, and it exists so they can react to the shape before anything is built.

Include the **style guide** page if there is one, and say what it is for: the colours, type and spacing are all set in one place, so changing the look later is a small job rather than a rebuild.

### How it gets built
The task list as **phases, not tasks.** Nobody wants to read sixty rows. Group them into the four or five stages they already exist in, and for each give: what happens, roughly how long, and what it unlocks.

Two things must be honest here:
- **Name the hard part** and say it is being proven first, before the screens are built around it. If the plan has a spike as task one, explain why in one sentence.
- **Name what they have to do.** Content, decisions, reviews, accounts. This is the most-skipped section and the most common cause of a stalled build.

**Do not give a total delivery date** unless one was actually agreed. Give the shape and the sequence.

### What we assumed
Every assumption made on their behalf, in plain words, each with a one-line reason. Platform, scope, audience, anything cut from v1.

This section buys trust rather than spending it. An assumption they disagree with is cheap to fix now and expensive after the build — and surfacing them is what separates a plan from a guess.

### What we haven't decided yet
The genuinely open questions, and **who needs to answer each one.** Be specific about what a decision unblocks: *"we need your exercise list before the content work can start"* is actionable; *"TBC"* is not.

### What's not in the first version
Named explicitly, each with a reason, and clearly marked as *later* rather than *never*. An unspoken cut is heard as a broken promise the moment they see the build.

### What to do next
Numbered, concrete, and short. Typically:
1. Open the plan (link)
2. Look at the mockup (link or command)
3. Send back the things in "what we haven't decided yet"
4. Open the project in the build tool and start with task one

Assume they have never used any of these tools. **Include the actual links and the actual first task**, not a description of them.

### Where everything lives
A short reference: the plan link, the mockup, the docs, the task board, and who to contact.

## 3. Deliver it in the form they will actually read

Ask, or use what you know about them. The document is the same; the wrapper differs:

- **A rendered page** they can open and share — usually the best default, and it keeps the screenshots inline.
- **A markdown file** in the repo if they are comfortable there.
- **An email or message body**, if the pack is short and they are more likely to read it in their inbox than to click a link.

Whatever the form, **put the screenshots in it.** A plan without pictures reads as an invoice; a plan with pictures reads as a product.

## 4. Record it in CodeSpring

So the next session knows what the client has already been told:

- Set the project description to the plain-English "what we're building" paragraph, so the canvas opens with something they recognise.
- Put the handover date and what was sent in the project info or a note.
- If assumptions or open questions were listed, make sure they also exist in the relevant feature's note — otherwise they live only in a document nobody reads again.

```bash
codespring mindmap set-info --title "..." --description "<the plain-English paragraph>"
```

## 5. Say what you sent

Tell the person who commissioned it — usually not the same person as the client — in three lines: what went out, what you are waiting on from the client, and what happens when it arrives.

---

## What good looks like

- The client could read the whole pack and **explain their own app back to someone else.**
- **No jargon, no file paths, no task IDs, no framework names** anywhere in the prose.
- The mockup screenshots are in it, beside the features they show.
- Build order is **phases with what-it-unlocks**, not sixty rows.
- **Assumptions are stated**, each with a reason.
- **What they owe is named**, specifically, with what it unblocks.
- Cuts are named as *later*, not left silent.
- The next steps are numbered, with real links and the real first task.
- The plain-English summary is on the CodeSpring project, so the canvas opens with something they recognise.
