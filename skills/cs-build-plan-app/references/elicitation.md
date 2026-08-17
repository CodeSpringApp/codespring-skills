# Getting the real app out of someone's head

Applies whether the input is a live conversation, a sales-call recording, a voice note, or three screenshots and a paragraph. The named examples are **labelled worked examples** from real runs, not assumptions about the person in front of you.

## The problem this solves

> **They do not know what they don't know, and they do not know what they need.**

A non-technical person describes an app in terms of things they have already seen. They will ask for the thing from the Instagram reel. That request is **evidence**, not a specification — it tells you what appealed to them, and your job is to find out *why* it appealed, because the why is the actual requirement.

Two failure modes, and they are opposites:

- **Dictation.** You write down what they said, tidied up. The plan contains no technical judgement, no platform reasoning, no prior art, and no cut list. It reads well and it is worthless — they could have written it themselves.
- **Substitution.** You decide what the app should be, because you can see a better product. They nod along in the call and then never recognise the thing that gets built.

The line: **they own the *what*, you own the *how*** — and you own telling them when the *what* costs more than they think.

---

## Mining a recording

**Read or listen to all of it before you ask a single question.** Turning up with questions the recording already answered is the fastest way to lose a non-technical person's confidence — they told you, and now they think you weren't listening.

Pull out, verbatim where you can:

| Look for | Why it matters |
|---|---|
| Who it is for, in their words | The audience constrains everything — a 78-year-old beginner is a different app from a 30-year-old gym-goer |
| Every screen, button, moment they described | This is the journey; you will replay it in the walkthrough |
| Every **number** they said | Numbers are hard requirements in disguise: *"five minutes is the floor"*, *"up to twenty"*, *"three times a week"* |
| Every constraint | Platform, offline, price, deadline, audience age, accessibility |
| Every reference app or screenshot, **and what they liked about it** | The *what they liked* is the requirement; the app itself is just where they saw it |
| **Anything they said twice** | Repetition marks what actually matters to them. This is the single highest-signal thing in a transcript |
| Anything they rejected, and why | Prevents you proposing it back to them in an hour |
| Their **own domain expertise** | Often the most valuable asset in the whole project and almost always under-used |

**Extract, do not summarise.** Summarising is lossy in exactly the wrong direction — it keeps the features and drops the reasons.

**Keep their phrasing all the way into the note.** *"Anything lower than five minutes is not worth the time"* survives into the note and eventually into the PRD, carrying its own justification. *"Configurable session duration"* is the same fact with the reason amputated, and the reason is what stops someone building a slider from 1 to 90.

### What a transcript will not give you

Recordings are full of *what* and empty of *why*. They also systematically miss:
- what happens when it goes wrong
- what brings someone back tomorrow
- how anyone pays
- what happens the very first time someone opens it, before there is any data

Those are your questions.

---

## The walkthrough — the elicitation engine

This works on people who cannot describe software:

> *Close your eyes and imagine you're using it. It's open in front of you. What's the first thing you see? What do you click? What happens then?*

Walk it as **a journey, not a feature list**:

1. They open it. What is on screen?
2. What do they click first?
3. Now they are doing the main thing they came for — describe it, moment by moment.
4. They finish. What do they see?
5. What brings them back tomorrow?
6. What happens the **first** time they ever open it, when there is nothing in there yet?

Step 6 is the one everyone forgets, and it is where non-technical apps most often feel broken — an empty dashboard with no data reads as "this doesn't work."

**Sidebar-first.** For desktop or web, ask literally: *"if there's a sidebar down the left, what's in it?"* This produces the core feature list almost directly, and it produces one the user recognises — which is exactly the 4–8 sidebar-item test in `target-map.md`. It is a much better question than *"what are your core features"*, which produces a wish list.

### Questions that work

- *"What happens today, without the app?"* — finds the real job and the real competitor, which is usually a notebook, a spreadsheet, or nothing.
- *"Who is the person opening this, and what kind of day are they having?"* — surfaces the audience constraints they would never think to state.
- *"What would make them close it and not come back?"* — finds the trust-breakers. Extremely high yield.
- *"Show me the thing you saw that you liked. What specifically about it?"*
- *"If it only did one thing brilliantly, which one?"* — the v1 cut, asked in a way they can answer.
- *"How does somebody pay for this?"* — see `v1-scope.md`. Nearly always missing.
- *"What do you already have that we should use?"* — audience, content, an email list, professional credibility, a domain. Usually under-used.

### Questions that do not work

- *"What are your core features?"* → a wish list, not a product.
- *"Do you want it to be simple or powerful?"* → everyone says both.
- *"Should it be a web app or a native app?"* → not their decision, and they will answer on vibes. Decide it on capability (`platform-choice.md`) and then **tell them the call and the reason**.
- *"What's your tech stack preference?"* → they do not have one, and asking makes them feel stupid.
- Anything with an acronym in it.

---

## Handling "I saw this on Instagram"

Reference material is good — take it. Then interrogate it once:

1. **What specifically did you like?** Usually one mechanic, not the whole app.
2. **Would your person like it, or do you like it?** Not the same, especially across an age gap.
3. **What does it do that yours must not do?**

Then say plainly whether the thing is cheap or expensive to build. A reference that is one afternoon of work should be taken wholesale; one that is the entire product should be discussed now, not discovered in week three.

**Worked example.** A client wanted a streak display copied from a cycling app — flame, day-of-week dots, the lot. Cheap to build, so take it. But the reference counted *consecutive days*, and the app was strength training for beginners over 50, where **rest days are physiologically required**. A daily streak would have punished correct behaviour and broken on week one. The fix was to keep the exact visual and change the unit to *weeks hitting a target* — which the reference screenshot was already showing anyway ("1 Weeks"). Same design, opposite behaviour. **Copy the look; re-derive the rule.**

---

## The second user nobody mentions — who puts the content in?

People describe the app from the point of view of the person *using* it. They almost never describe the person who **fills it with content**, even when that person is themselves.

If the app shows exercises, lessons, templates, recipes, programmes, questions, or any other catalogue, ask all of these:

- **Where does the content come from on day one?** Shipped inside the app, or entered by someone?
- **Who adds more later, and how?** Them, in a tool you have to build? You, by hand? Nobody?
- **Does it differ per user?** A coach assigning different programmes to different clients is a **completely different app** from a fixed catalogue everyone gets — accounts, assignment, roles, a second interface.
- **Who decides the order?** The app, on a rule? The user, freely? The coach, in advance?
- **What happens on day two?** The single most-skipped question. *Is it the same as day one?* If not, something has to decide — and that decision rule is a feature nobody has mentioned yet.

**Why this matters more than it sounds:** an authoring tool is a second application. It has its own screens, its own validation and its own testing, and it is routinely 30–50% of the build while appearing nowhere in the feature list. It is also the most common cause of *"I thought we were nearly done."*

**The cheap answer is almost always the right v1 answer:** ship a fixed catalogue inside the app, authored by hand as data before release. No authoring UI, no accounts, no assignment. Add the tool later, once anyone has proved they want to change the content.

**Worked example.** A coach's exercise app: the assumption was that she would need an admin app to record and add exercises. The v1 answer was a hand-authored catalogue file shipped in the bundle — nothing to build, nothing to film, nothing for her to learn. The admin tool became a v2 question to be answered by whether she ever actually asks for it.

**Watch for the ordering rule specifically.** *"They shouldn't do the same thing every day"* sounds like a preference and is actually a scheduling feature with real edge cases — what if they skip a day, do half a session, or do it twice? Get the rule stated in one sentence at plan time (*"a cursor through the unlocked list that advances only on completion"*), because otherwise it gets invented during the build.

---

## When the input is one long ramble

Common, and fine. Do this in order:

1. **Separate ideas from the app.** People bring three or four ideas to a planning session. Get them listed and get one chosen before planning anything. The others are recorded and parked, not discussed.
2. **Separate the app from the business.** *"I need money by September"* is a real constraint that shapes v1 scope, but it is not a feature. Note it under the job (§2 of the skill), where it belongs.
3. **Separate what they want from what they have seen.**
4. **Find the thing they said twice.** That is the centre of the app.

---

## Before you leave the interview

You need all of these. If any is missing, ask now — it is cheap here and expensive later.

- [ ] The job paragraph: **who**, **what they're trying to get done**, **what happens today without it**, **how we know it worked**.
- [ ] The journey, walked start to finish, including the very first launch.
- [ ] Every number they stated.
- [ ] The audience's real constraints — age, ability, device, environment, how much patience they have.
- [ ] What would make someone close it and never come back.
- [ ] How money changes hands, if it needs to.
- [ ] What they already have that the plan should use.
- [ ] What they have explicitly rejected.

## The test

**Would they recognise this as their app, and does it contain at least one thing they could not have told you?**

Both halves are required. The first alone is dictation. The second alone is substitution.
