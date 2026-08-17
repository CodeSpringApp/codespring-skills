---
name: cs-build-ui-mockup
description: >
  Turn a CodeSpring plan into a clickable local mockup the client can actually
  look at — one screen per core feature, real copy, plausible data, a proper
  token-driven design system with light and dark mode, and a style guide page
  showing the branding. Then run the review that surfaces what the written plan
  could not: screen order, hierarchy, position, and choices that turn out to be
  incomplete. Feeds every correction back into the CodeSpring notes and tasks.
  Runs AFTER the map and notes exist and BEFORE the PRDs are generated.
  Triggers, "make a mockup", "mock up the UI", "show me what it looks like",
  "build a prototype", "design the screens", "what would this app look like",
  "create a UI mockup for this plan", "I want to show the client something".
allowed-tools: Bash(codespring:*) Bash(npx @codespring-app/cli:*) Bash(bash:*) Bash(node:*) Bash(npm:*) Bash(npx:*) Bash(git:*) Bash(grep:*) Bash(rg:*) WebSearch WebFetch
metadata:
  author: codespring
  version: "0.1"
---

# Build a clickable mockup from the plan

**A written plan cannot express a focal point.** It cannot express screen order, position, hierarchy, or whether a set of choices is complete. Those are exactly the things that go wrong, and no amount of re-reading the notes will find them — the client agrees to the words and then sees the screens and says something quite different.

This skill turns the plan into something they can look at, runs the review that surfaces the gap, and writes what it finds back into CodeSpring.

**Where it sits in the chain:**

```
cs-build-plan-app  or  cs-build-import-codebase        (map + notes exist)
        │
        ▼
   cs-build-ui-mockup   ← you are here
        │            build it, show it, feed corrections back
        ▼
  cs-build-create-prd → cs-build-create-tasks → cs-build-feature
```

**Run it before the PRDs.** A PRD generated from a plan nobody has seen just encodes the misunderstanding in more detail and makes it more expensive to undo.

Read: `codespring` skill `references/project-state.md`, `references/pitfalls.md`, and this skill's own references —

| Reference | Read it when |
|---|---|
| `references/design-system.md` | **Before writing any CSS.** The token architecture, the scales, the radius relationships, brand-swapping, and light/dark. |
| `references/review-method.md` | Before showing it to anyone. How to run the review without contaminating it, what mockups reliably catch, and how corrections get written back. |

**Also load Anthropic's `frontend-design` skill if the runtime supports it** (`https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md`). It is the method for making the thing distinctive rather than templated; `design-system.md` here is the structure it hangs on. If skills cannot be installed in this environment, read that URL and follow it directly.

---

## 0. Check the plan is ready

```bash
bash ../codespring/scripts/fetch-project.sh --out /tmp/cs-state
node ../codespring/scripts/state.mjs       /tmp/cs-state
```

You need **core features with notes**. Without notes there is nothing to draw — the note is where the screen's content, states and rules live.

- **No map** → wrong skill. `cs-build-plan-app` (no code) or `cs-build-import-codebase` (existing code) first.
- **Map but thin or missing notes** → say so and fix the notes first. A mockup built from card titles alone invents everything and tests nothing.
- **PRDs already generated** → still worth doing, but say plainly that corrections will mean regenerating them.

## 1. Get the brief straight before drawing anything

From the notes and from the person, settle these. They are the inputs to every visual decision:

- **Who uses it**, and what that constrains — age, ability, environment, device, how much patience they have.
- **The single job of the main screen.**
- **The one moment the product will be remembered by.** This is where the boldness gets spent; everything else stays quiet.
- **Any brand that already exists** — colours, type, logo, an existing product to match.
- **Any reference the client has supplied.** If they have pinned a direction, **follow it exactly** — their words win over any default you would otherwise reach for.
- **Light or dark or both**, and which is the default.

**If a reference image was supplied, extract from it explicitly** and write the extraction down: palette as named hex values, radius scale, type pairing, spacing rhythm, and the two or three structural patterns worth stealing. Then say what you are deliberately *not* taking from it, and why. A reference is evidence of what they liked, not a specification to copy wholesale — the reference's audience is often not their audience.

## 2. Choose the smallest stack that throws away cleanly

This is a **communication device with a lifespan of days**. It is not the app and it must never become the app by accident.

Default: whatever gets a styled, routed, clickable page up fastest in the target platform's own idiom — usually a scaffolded web app with a utility CSS layer. Match the eventual stack where that is free, but **never let stack fidelity slow the mockup down.** A web mockup for a native app is fine and normal; the point is the screens.

**No backend. No database. No auth. No real API calls.** Hardcoded sample data throughout.

Put it in its own directory, clearly named `mockup/`, and say in one line that it is throwaway.

## 3. Build the design system FIRST

Do not write a screen before the tokens exist. `references/design-system.md` is the spec; the short version:

- **Every value lives in one place.** No hex, no pixel value, no radius, no font stack appears in a component. Ever. A whole rebrand must be one file.
- **Light and dark are both built from day one**, not retrofitted. Retrofitting dark mode means revisiting every screen.
- **One spacing scale, one type scale, one radius scale.** Radii are chosen as a deliberate relationship — see the reference; the common failure is a card at 28, a button at 6 and an input at 12 for no reason anyone can state.
- **Colour is semantic, not literal.** `--surface`, `--ink`, `--accent` — never `--blue`. Semantic names are what make a brand swap possible.

Then run the **two-pass process** from Anthropic's frontend-design skill: plan the token set (4–6 named colours, display + body faces, a layout concept, and the one signature element), **critique that plan against the brief**, revise anything that reads as a generic default, and only then write code.

## 4. Build the screens

**One screen per core feature, plus the single most important flow.** Do not build every sub-feature — build enough that the shape of the product is legible.

Non-negotiables, because each one has cost a real review:

- **Real copy.** Never lorem ipsum. Wrong wording is one of the things you are trying to surface, and placeholder text hides it completely.
- **Plausible sample data.** Real-looking names, real-looking numbers. "Sit-to-Stand Strength · 10 minutes · Level 2" surfaces problems that "Item 1" never will.
- **Controls must visibly respond.** A chip that does nothing when clicked reads as **broken**, not as static, and you will lose review time to it. Hardcoded state that moves on click is enough.
- **Draw the empty and first-run states.** They are the most-skipped screens and the ones that most often read as "this is broken" to a non-technical user.
- **Every list item that has detail behind it must open.** A list you cannot open is a list nobody can trust, and "you'd click into it" is exactly the kind of assumption a mockup exists to expose.
- **Every enumerated choice needs its escape hatch** — an "Other" or "Custom" option — unless the set is genuinely closed. Fixed lists die on contact with real users.

## 5. Add a style guide page

A `/styleguide` route showing the design system as an artefact the client can react to: the palette with names and values, the type scale in use, the spacing and radius scales, buttons and inputs in every state, cards, and the light/dark toggle.

This does real work. It gives the client something concrete to approve or reject **at the token level**, which is a far cheaper conversation than arguing about it one screen at a time. It also documents the system for whoever builds the real thing.

## 6. Check it yourself before showing anyone

- The build passes and every route loads.
- **Look at it.** Screenshot each screen and actually read them. Do not ship a mockup you have only verified with HTTP 200s.
- Light and dark both work on every screen.
- Nothing framework-branded is visible — dev badges, error overlays, placeholder favicons. A non-technical client reads any of that as "broken".
- The quality floor: keyboard focus visible, sensible heading order, reduced motion respected, no horizontal scroll.
- **Chanel's rule: find the one thing to remove.**

## 7. Run the review

Full method in `references/review-method.md`. The core of it:

**Put it in front of them and shut up.** Do not narrate, do not explain your reasoning, do not pre-defend a choice. The moment you explain a screen you are measuring whether your explanation is convincing, not whether the screen is.

Ask only open questions: *show me what you'd do first*, *what's confusing*, *what's missing*, *where would you look for X*.

**Take the feedback literally and work out separately what it means.** "This looks blobby" is not actionable but the thing they are pointing at is real. "I don't know what that's showing" means a chart has no title. "Is that something I click?" means one screen is doing two jobs with no signposting.

**Expect two rounds.** Stop when the feedback moves from "this is wrong" to "I'd prefer" — at that point you have the understanding you came for and the rest is taste that can be settled during the build.

## 8. Write the corrections back into CodeSpring

**This is the step that makes the skill worth running.** The review output is not a UI to-do list — it is plan corrections, and they belong where the build will read them.

1. **The reason goes in the feature's note.** Not just the decision — the reason. *"The workout goes first, because asking two questions before showing anything is two decisions before she has seen anything."* The reason is what stops the next person reverting it.
2. **A `DESIGN REVIEW` block goes on every affected task**, so whoever builds that screen sees the correction rather than rediscovering the original mistake.
3. **Anything the review revealed as missing becomes a new task**, and a new sub-feature if it is genuinely a new thing the user does.
4. **Name the mockup in the notes as the agreed UI reference**, with how to run it. It is now worth more than any written description of the same screens.

```bash
codespring mindmap note <coreFeatureId> --title "How it works — X" --text "$(cat note.txt)"
codespring task update <taskId> --description "$(cat task.txt)"
codespring task create --title "0.x.y — ..." --description "..." --feature <id> --priority high
```

## 9. Hand off

**→ `cs-build-create-prd`**, now that the plan reflects something the client has actually seen.
Then `cs-build-create-tasks`, then `cs-build-feature`.

Tell them plainly what they have: the mockup and how to run it, the style guide, what changed in the plan because of the review, and what happens next.

---

## What good looks like

- The mockup existed **before** the PRDs.
- **The design system was built first**, all values live in one place, and light and dark both work.
- A `/styleguide` route exists, so branding is a token-level conversation.
- Real copy, plausible data, controls that respond, and empty states drawn.
- Every list with detail behind it opens; every enumerated choice has an escape hatch.
- It was shown **without narration**, with open questions.
- **Every correction became a note reason and a task block** — not a private to-do list.
- The mockup is named in the notes as the agreed UI reference.
- **At least one thing surfaced that no amount of reading the plan had found.** If nothing did, the mockup was too vague to be useful.
