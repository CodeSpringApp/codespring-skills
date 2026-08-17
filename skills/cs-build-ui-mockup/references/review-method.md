# Building it, showing it, and feeding it back

The method behind `cs-build-ui-mockup`. Learned the expensive way on a real client.

## The problem it solves

`elicitation.md` warns that a confident plan which does not match what is in the person's head **reads exactly like a good one**. Everything else in this skill fights that with words — read it back, ask what is wrong, get a yes at the gate.

**Words are not enough.** A person will agree to a written plan they have not actually understood, because prose lets both sides fill the gaps differently and neither notices. The gap only becomes visible when someone can *look* at it.

Real run: a plan was written, agreed at the gate, expanded into PRDs and sixty tasks. It looked complete. A clickable mockup was then built from it, and within ten minutes of the owner looking at the screens it produced **eleven corrections** — including a whole screen in the wrong order, a feature nobody could find, a control that had no source for its numbers, and a list nobody could open. None of those had surfaced in any amount of written review, and several would have been expensive to fix after the build.

> **A mockup is the cheapest possible disagreement.**

## When to build one

**After the map and notes, before the PRDs.** That is the moment the plan is complete enough to draw and cheap enough to be wrong.

Skip it only when there is genuinely no interface — a CLI, a library, a background job.

The design system that the mockup is built from is a separate concern with its own rules: `design-system.md`. Build that first.

## What to build

**A static, clickable, throwaway front end.** Not the app. No backend, no real data, no auth, no camera, no API calls. Hardcoded sample values everywhere.

- **One screen per core feature**, plus the single most important flow.
- **Real copy**, not lorem ipsum. Wrong copy is one of the things you are trying to surface, and placeholder text hides it.
- **Plausible sample data.** Numbers that could be real. "Sit-to-Stand Strength · 10 minutes · Level 2" surfaces problems that "Item 1" never will.
- Enough interactivity that clicking a thing visibly does something. **A control that does not respond reads as broken, not as static**, and you will waste review time on it.

Build it in whatever is fastest to throw away. It is a communication device with a lifespan of days.

## How to run the review

Put it in front of them and **shut up**. Do not narrate, do not explain the reasoning, do not pre-defend a choice. The moment you explain a screen you have contaminated the test — you are now measuring whether your explanation is convincing, not whether the screen is.

Ask only:
- *"Show me what you'd do first."*
- *"What's confusing?"*
- *"What's missing?"*
- *"Where would you look for X?"*

**Then take the feedback literally, and separately work out what it means.** "This looks blobby" is not actionable, but the thing they are pointing at is real. "I don't know what that's showing" means a chart has no title. "Is that something I click?" means one screen is doing two jobs with no signposting.

## What a mockup reliably catches that prose does not

Every one of these came from a real review, and every one had been invisible in a written plan that both parties had signed off:

| What surfaced | The general lesson |
|---|---|
| The screen asked two questions before showing anything useful | **Screen ORDER is a decision, and prose does not encode it.** A note listing features says nothing about what is at the top. |
| A summary line duplicated what the graphic already said | Redundancy is invisible in a list and obvious on a screen. |
| A control had no source for its numbers | **"The user picks a level" hides the question of where the level's VALUES come from.** Prose accepts an unfinished thought; a form has to be filled in. |
| A list of items could not be opened | **A list nobody can open is a list nobody can trust.** Detail views get planned as "obviously"; obviously never gets built. |
| A fixed set of options had no escape hatch | **Every enumerated choice needs an "other".** A list of five equipment types dies on contact with a real user. |
| An important secondary action was at the bottom of a long page | Position IS priority, and a note cannot express position. |
| A screen in the nav had nothing behind it | Prose lists it as a feature; the mockup shows it is empty. |
| Status was scattered across five floating elements | **"Show the round, the reps and the timer" reads fine as a sentence and fails as a screen.** |
| Everything on a bar had equal weight | **A written plan cannot express a focal point.** Prose has no hierarchy; a screen is nothing but hierarchy. |
| A real feature read as invented | If a feature's purpose is not legible on screen, it will be cut by whoever reviews it — including the person who asked for it. |

Notice the pattern: **almost all of it is about hierarchy, order, position, and the completeness of a choice.** Those are exactly the properties a bulleted list cannot represent, which is why no amount of re-reading the plan finds them.

## Feed it straight back into the plan

The review output is not a UI to-do list — it is **plan corrections**, and they belong in CodeSpring where the build will read them:

1. Write each decision into the relevant feature's **note**, with the reason. *"Order changed: the workout goes first because asking two questions before showing anything is two decisions before she has seen anything."* The reason is what stops it being reverted by the next person.
2. Add a **DESIGN REVIEW** block to every affected **task**, so whoever builds that screen sees the correction and does not rediscover the original mistake.
3. **Add tasks for what the review revealed was missing.** A detail view, a defaults table, an empty screen that was only ever a nav item.
4. Add sub-features for anything genuinely new.
5. Keep the mockup and **name it in the notes as the agreed UI reference.** It is now worth more than any written description of the same screens.

## Expect more than one round

The first revision will not be right either. The second review is cheaper and sharper because the obvious problems are gone and the person is now looking at hierarchy rather than content.

**Two rounds is normal. Three is fine.** It is still radically cheaper than discovering any of it after the build. Stop when the feedback moves from "this is wrong" to "I'd prefer" — at that point you have the understanding you came for, and the rest is taste that can be settled during the build.

## What good looks like

- A clickable mockup existed **before** the PRDs were generated.
- It used real copy and plausible data, and its controls visibly responded.
- It was shown **without narration**, and the questions asked were open.
- Every piece of feedback became a **note correction with its reason**, a **task addition**, or both — not a private to-do list.
- The mockup is named in the notes as the agreed UI reference.
- At least one thing surfaced that no amount of reading the plan had found. **If nothing did, the mockup was too vague to be useful.**
