# Cutting to a v1 that can actually ship

They will describe the finished product. You are planning **the first version that delivers the job end to end** — one complete loop, working, and sellable if it needs to be sold.

## One loop, whole

> A user opens it, does the main thing, gets the outcome, and has a reason to come back.

Everything in v1 serves that sentence. Everything else is later, and *later* is a real place — it goes in the note as "explicitly not in v1", not on the map and not in Kanban.

**Cut breadth, never depth.** Five features at 60% is a broken app that cannot be shown to anyone. One feature at 100% is a product. When the list is too long, remove whole features rather than shipping all of them half-done — this is the single most valuable instinct in scoping and the one people resist hardest.

---

## Tracking features are not v1 features

The most common way an idea-plan goes wrong. It is worth being blunt about.

Sort every proposed feature into two piles:

| | The app does something **for** them | The user does something **for** the app |
|---|---|---|
| **Called** | a doing feature | a tracking feature |
| **Examples** | runs the session, corrects the form, reads the receipt, makes the decision | log your sleep, type in your meals, rate your mood, tick the box |
| **Pull** | high — they come back because it gives them something | near zero — it is a chore with a delayed, abstract payoff |
| **Week-two retention** | good | close to nil |

**Manual logging dies.** It dies fastest with older, busier and less technical audiences — exactly the people these apps are usually for. Every "and it'll track their X" feature should be challenged, and the challenge is: *what does the user get back, in the next ten seconds, for typing that in?* If the answer is "a chart, eventually", cut it.

This matters most when someone has a **framework with several parts** and wants all of them in the app. Usually one part is a doing feature and the rest are tracking features wearing a costume.

**Worked example.** A menopause coach with a five-pillar method — sleep, nutrition, movement, brain health, stress — wanted all five in the app. Four of the five would have been manual logging screens. **Only movement was a doing feature**: the app runs the session and corrects the form. Correct v1: build movement properly, alone. The other four are her *coaching*, and the plan says so, so nobody builds four dead screens.

If the other parts genuinely must appear, the cheap shape is **one short daily check-in feeding one number**, not one tracker screen each.

---

## The revenue gate

If the person needs this to make money — and they will have said so, usually early and emotionally — then ask, in these words:

> **"How does somebody pay for this?"**

Then confirm the answer exists in v1. This is missed on nearly every plan because it is not a feature anyone is excited about, and it is the difference between a product and a demo.

Minimum viable answers, in order of cost:

1. **Manual.** A payment link, then send the download or an invite by hand. Perfectly fine for the first few dozen customers, and it can be live tomorrow.
2. **Payment link + licence key** checked on launch (desktop). Cheap, and **the check must be in the first build** — you cannot retrofit it onto people who already have an unlocked copy.
3. **Stripe Checkout + accounts** (web). An afternoon, and the right answer if it is a web app.

Also settle: **free trial or not**, and **what a paying user gets that a non-paying one does not.** These are product decisions that change the build, so they belong in the plan and not in a conversation three weeks later.

---

## Ask what the real cost is — it is often content, not code

Some apps are 20% software and 80% acquiring the thing the software shows. If that is true here, **say it now**, because it is the schedule risk and it is invisible on a feature list.

Signals: the app needs an exercise library, a media catalogue, a document corpus, a template set, a curriculum, a reference data set, or anything "we'll generate with AI."

**Beware AI-generated content standing in for a real corpus.** For anything a domain expert or an experienced user will look at, current generation is often not good enough, and being *nearly* right is worse than being obviously wrong — it destroys trust in one glance and it does not come back.

**Worked example.** An exercise app where AI generated an illustration of a bicep curl that was not a bicep curl. The client — a physician — immediately said *"anybody would say this is not a bicep curl, and you lose trust doing those kind of things."* The right plan filmed the expert doing each movement once, which was cheaper, correct by construction, and turned her credibility into the product's.

**The best content pipelines fall out of the architecture.** If the exercise is stored as a sequence of joint positions, then recording the expert once produces the demonstration, the correction targets and the rep counting from a single capture — one artefact, three features. Look for that collapse before planning a content operation.

Plan the pipeline explicitly: **who makes it, how much is needed for v1, how long it takes, and what the quality bar is.** Then cut the v1 content set to the smallest that still delivers the loop — a dozen items done properly beats sixty done badly, and nobody has ever churned because a library was too small at launch.

---

## Say what is not in v1

Name the cuts as explicitly as the inclusions, and write them into the note. An unspoken cut is heard as a broken promise the moment they see the build.

Say it as a sentence they can repeat: *"v1 is one thing done properly — the session, with the camera. Sleep, nutrition and the community come after we know people are using this one."*

---

## The v1 test

- [ ] One complete loop — open, do the thing, get the outcome, reason to return.
- [ ] Every feature is a **doing** feature.
- [ ] If money is needed, there is a way to pay **in v1**.
- [ ] The hard part (`hard-part-first.md`) is proven by a spike before screens are built.
- [ ] If the real cost is content, there is a pipeline and a minimum viable set.
- [ ] The **not-in-v1 list is written down** and was said out loud.
- [ ] It can be shown to a real user in weeks, not months.
