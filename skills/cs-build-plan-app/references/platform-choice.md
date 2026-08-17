# Choosing the platform — decide on capability, then state what it costs

Decide this **before** the feature list is final, because it changes what is buildable and what a feature even means. Do not decide it on preference, on fashion, or by asking the user — they will answer on vibes, and it is not their call. Make the call, then **tell them the call and the reason** in one sentence they can repeat.

## The decision

Start from **what the app must physically be able to do**, not from what is trendy.

| If it must | Platform | Why |
|---|---|---|
| Use the camera with **real-time local ML** | **Desktop (Mac)** | Native frameworks, real compute, no upload, believable privacy story |
| Read/write real files, watch folders, run at login, live in the menubar | **Desktop** | The browser cannot, by design |
| Work **genuinely offline** | **Desktop** | "Offline web app" is a service worker and a cache, and it is a lie in most cases (below) |
| Be **shared by a link**, found by search, signed up for in one click | **Web** | Distribution is the product |
| Be sold with a self-serve funnel from day one | **Web** | Payment, accounts and onboarding are solved and expected |
| Be used **away from a desk** — in a gym, a field, a warehouse | **Mobile** | Nothing else is in their pocket |
| Be usable on any machine the user happens to be at | **Web** | No install |

**When both fit, pick web** — it is cheaper to distribute, cheaper to update, and easier to sell. Desktop must be *earned* by a capability the browser genuinely cannot provide.

## iOS is almost never the right v1

Say this plainly and say why:

- **Review latency.** Every release, including the fix for the bug you shipped on Friday.
- **Apple's cut** on in-app purchase.
- **A developer account and the whole signing apparatus** before anyone can install anything.
- **Small screen.** For an older audience or anything with a lot on screen at once, this is a real usability loss, not a preference.
- **The hardest place to iterate**, which is the one thing a v1 must do well.

Exception: the app is genuinely useless anywhere but in someone's hand.

## The constraint that overrules capability — what will they actually build it in?

Capability decides what the app *needs*. It does not decide what the person in front of you can **build and keep running after you leave**, and that second question can legitimately overrule the first.

Ask it explicitly, before the platform is written down:

> **"What are you going to build this in, and who maintains it after I'm gone?"**

The common collision: someone is committed to an AI web-app builder (Base44, Lovable, v0, Replit) — it is what they have paid for, what they half-understand, and the only tool they can imagine still using in six months. **Those tools emit web apps. They cannot produce a native desktop or mobile app at all.** So a plan that says "Mac app" is a plan they cannot execute, however correct the capability argument was.

### How to resolve it — a conversation, not a silent override

Do not quietly plan a platform they cannot build in, and do not quietly drop a capability because their tool is easier. Both failures look like agreement in the room and surface weeks later. Instead, put the real trade on the table:

1. **Name what is lost** by moving to the platform their tool supports. Be specific and technical: *"in a browser this runs at roughly half the frame rate and the privacy claim is harder to make credible."*
2. **Check whether the loss is actually fatal**, by researching it rather than assuming. Browser capability moves fast and the intuition that "the browser can't do that" is often several years out of date. This is worth a real investigation, not a guess.
3. **Name what is gained** — usually distribution, cross-platform reach, no signing or notarization, no install friction, payment already solved, and instant updates. These are not consolation prizes; for a v1 that has to be sold quickly they frequently outweigh the capability.
4. **If the capability is genuinely load-bearing and their tool cannot reach it, say so plainly** and offer the two honest options: build it outside their tool, or change the product so it no longer needs that capability.

### The maintenance question is the real one

A technically better app the owner cannot touch is worse than a slightly worse app they can. Weight this heavily for non-technical owners — the platform they can still ship a fix to in a year usually wins, and that is a legitimate engineering judgement rather than a compromise.

**Record the decision and the reason in the note**, including what was given up. Otherwise the next person reads "web app" and assumes nobody considered the alternative.

---

## "Offline" almost never means offline

When someone says the app should work offline, find out which they mean:

1. **"It shouldn't break on bad wifi"** — a web app with sensible caching is fine.
2. **"It works on a plane"** — real offline. Desktop, or a serious PWA investment.
3. **"My data doesn't go to a server"** — that is **privacy**, not offline, and it is a much stronger requirement. It usually forces desktop and it is usually worth a lot in the marketing.

They are three different requirements and people use one phrase for all of them. **Video, in particular, kills naive offline claims** — a follow-along app that streams its content is online whatever the shell is built in.

---

## What each choice actually costs — state these out loud

The platform decision is cheap. Its consequences are not, and they surface in week four.

### Desktop (Mac)

- **Signing and notarization.** Distributing outside the App Store still needs an Apple Developer account, a **Developer ID certificate**, and notarization on every build. Without it users get "cannot be opened because the developer cannot be verified" and they will not proceed. **This is a hard, calendar-time dependency — start it on day one, not at launch.**
- **Distribution is manual by default** — a signed, notarized DMG on a download page. That is genuinely fine for the first few dozen customers and much faster than it sounds.
- **Updates** need a mechanism (Sparkle or equivalent). If you defer it, you cannot ship a fix to anyone who already installed. Decide deliberately.
- **Payment is not solved for you.** No store, no billing. A payment link plus a licence key checked at launch is the cheap answer, and **the licence check must exist from the first build** — it cannot be retrofitted onto customers who already have an unlocked copy.
- **Mac-only excludes Windows users.** Fine for a design-led or Apple-heavy audience; check it is not half the market.

### Web

- **Accounts, hosting and a database from day one** — there is no local-only web app worth selling.
- **Payment is solved** (Stripe Checkout, an afternoon).
- **Updates are free** — everyone is on the latest version always.
- **Capability ceiling.** Camera works; sustained real-time ML is harder, heavier and less believable on privacy; filesystem is limited; background work is limited.
- **Distribution is the win.** A link. This is worth more than most capability arguments.

### Mobile

- Everything in iOS above, plus a second platform if Android matters.
- The only correct answer when the use is genuinely away from a desk.

---

## The privacy angle can decide it

If the app handles **camera video of the user, health data, or anything they'd be uncomfortable uploading**, desktop wins on credibility even where the browser is technically capable.

*"This never leaves your computer"* is true, provable, and worth saying loudly in the UI of a native app. The same claim from a web page is technically achievable and **nobody believes it**. For an older, less technical audience — one that already suspects it is being watched — this is not a footnote, it is a selling point and possibly the deciding factor.

---

## Worked example — a follow-along exercise app for women over 50

- **Camera + real-time pose estimation, every frame** → real compute, and Apple's Vision framework is on-device and free (`hard-part-first.md`).
- **Video of a woman exercising in her living room** → the "this never leaves your computer" claim is the whole trust story, and it is only credible in a native app.
- **Audience is 50–78 on laptops** → big screen wins, phone loses.
- **She wants to sell within weeks** → App Store review is a schedule risk; a DMG on a page is not.
- **Verdict: Mac app.** Not because Mac is nicer — because pose estimation and the privacy claim both need it.
- **Consequences stated up front:** Developer ID certificate needed *now*; DMG distribution; payment via link + licence key, **with the licence check in the first build**; no Windows users in v1, accepted deliberately.
