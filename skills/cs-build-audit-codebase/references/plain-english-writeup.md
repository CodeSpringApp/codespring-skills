# The plain-English write-up — structure, voice, and the quality bar

An audit produces two different documents. Do not mix them up.

| | Internal notes | `FINDINGS.md` (the deliverable) |
|---|---|---|
| Audience | you, and the agents that will do the work | the app's owner — often not a developer |
| Language | technical | plain English, roughly third-grade reading level |
| References | `file:line`, commands, evidence labels | **none** — no file paths, no line numbers, no function names |
| Ordering | by domain | by real-world consequence |
| Lives | scratchpad | committed into the audited repo as `FINDINGS.md` |

The internal notes feed the tasks. `FINDINGS.md` is what the owner reads and decides with.

**Every named specific below is a labelled worked example** from the audit this structure was generalised from — a rate table, a report, a suburb figure. They are there to show the *shape* of a good sentence. Nothing here assumes anything about the codebase in front of you, which may be in any language and any domain.

---

## Voice rules for `FINDINGS.md`

1. **Third-grade reading level.** Short sentences. Common words. If a nine-year-old couldn't follow the sentence structure, rewrite it. (The *subject* can be advanced — the *language* cannot.)
2. **Short bullets.** One idea per bullet. No paragraph longer than three lines.
3. **One concrete example per problem.** Not "validation is missing" — "typing a full stop instead of a comma turns 800,000 into $800."
4. **Name the consequence, not the mechanism.** The owner needs to know what it costs them, not where the bug is. Say "the report shows $0 in government charges while still claiming it used official rates", not "the lookup is case-sensitive with no default branch".
5. **Put a number on it wherever you honestly can** — dollars, a count, a percentage. Numbers are what make an owner act. If you can't size it, say what it damages instead (client trust, a legal obligation, a sale). **State what the number covers in the same sentence** — "45 bytes across 3 keys" measured on one page is not a fact about the whole app (`auditing-and-fixing.md` §3a).
6. **No file paths, no line numbers, no function or variable names, no jargon.** Hard rule: **every finding must be readable by someone who does not know what a database migration is.** Any term of art is either explained in the same sentence it appears in, or not used.

   This has already failed once in practice. *"Versioned rate tables stamped onto the saved file"* meant nothing to the person it was written for. The plain version says the same thing and is **more** specific:

   > *"When you save a report, also save which year's tax rates it used — so that fixing a rate later doesn't change what a client was already shown."*

   Notice the shape: the action, the thing, then **the consequence of not doing it**. The consequence is what persuades. Run the same test over *idempotent, RLS, IDOR, migration, ORM, schema drift, silent failure path, denormalised* — explain inline or find the plain sentence.
7. **Rank by consequence, hardest-hitting first** — inside every section and across the whole document. The reader should be able to stop after section 2 and still have the important part.
8. **Say what is good — with its boundary.** A write-up that only lists faults is neither trustworthy nor useful. Where something is genuinely well done — a verified data set, a correct security check, a decision better than the competitor's — say so in the same plain voice, and mark it as something not to break.

   **When you claim the app does something better, say what it does NOT do in the same breath.** This has already failed once. *Worked example: the app was called "ahead" of the incumbent product on one calculation when it had in fact solved only the easy half of it — the single-record case, not the case of combining records across a portfolio, which was the exact part the incumbent had said was too hard.* The owner will repeat "we're ahead on this" to a customer, so the boundary has to travel with the claim.
9. **Be explicit about what you did not verify.** Give it a closing section. It protects the owner and it protects you.
10. **Distinguish "wrong today" from "wrong later".** *"This is wrong today, not wrong next year"* is the most action-forcing sentence available — use it only when it is true.

---

## Structure

Open with a two-line header: what this document is, what it is based on, and the dates. **Name the commit** — findings are a snapshot, and on a repo someone else is still working in that matters.

> Plain-English record of what the app gets wrong, what it can't do, and what needs to change.
> No code. Real-world implications only.
> Reviewed *dates*, against commit *short SHA* on *branch*. Based on the live app, the code, the database, and *any other sources*.

Then the sections below. Drop any that don't apply — do not pad.

**1. The most important thing to understand.**
One structural truth that reframes everything else, then a short "that means:" list. This is the section that changes the owner's mind. In the real audit it was: almost nothing comes from a database — every figure is calculated in the browser from typed-in values, and the rate tables are typed into the web page itself.

**2. Where it's wrong — in order of how much it matters.**
The core of the document. One `###` sub-heading per defect, written as a plain statement of the problem *with its size in it* ("Capital gains tax is understated by about $337,000"). Two to five bullets under each: what it does, when it happens, what it costs. Hardest-hitting first.

**3. Numbers that look precise but are actually fixed assumptions.**
Anything the app presents as a computed fact that is really a choice someone made. Open with the framing sentence: *these are not calculated from anything; someone chose them, and the user cannot see or change them.* One bullet each, with the value and its effect.

**4. Data that isn't really data.**
Anything typed in by hand, stale, defaulted to zero on failure, or asserted without verification. Say plainly what a missing value and a failure look like to the user (identical, usually). If an integration is expected to fix this, **set the expectation honestly** — in the real case, connecting the data provider would stop the typing but would not change a single calculated figure, and saying so up front prevented a wasted project.

**5. Why it behaves inconsistently.**
The "why do some outputs look different from others" section. Users notice inconsistency before they notice errors, and the answer is often "nothing is broken, the setting is just invisible". Worth its own section because it converts a suspicion into a fact.

**6. Where the work actually lives.**
Storage, durability, sharing. What survives a refresh, a new browser, a new machine, two colleagues. What is lost permanently, with no backup, and with no warning that it was ever a risk.

**7. Compared to what it's replacing.** *(only if there is an incumbent or named competitor)*
Three lists, in this order: **where this app is already better** (put it first — it is true, and it earns the rest of the document a fair hearing), **what the other product has that this one doesn't**, and **differences worth deciding deliberately** rather than calling bugs.

**8. What it cannot do at all.**
Not bugs — gaps. The things a customer or a competitor will raise. Rank by how likely they are to come up in a real conversation.

**8a. Could add later — deliberately not doing now.** *(bucket 2, `auditing-and-fixing.md` §4a)*
Real gaps that are consciously parked. Title the section in those words so it is unmistakable, and say the posture out loud once: *the job right now is making what already works work properly, not adding to it.* One line each, with the reason it is parked and whether it is worth doing later. Nothing in this section becomes a task.

**8b. Not worth adding.** *(bucket 3)*
One line each, **with the reason**, so the question stops coming up. A "not worth it" without a why gets asked again next month. Real example: *don't build an integration to fetch tax rates automatically — no free authoritative feed exists, and scraping eight government websites would be more fragile than a maintained table plus a yearly review.*

> **These two sections are the only home a future idea has.** CodeSpring has features, notes, PRDs and Kanban tasks and no "ideas" surface, and a parked idea must never be written as a task because **a task list implies committed work**. So they live here, in the repo, titled exactly as above. Flag it to the user as a known product gap.

**9. What needs to change — the principle, not the code.**
The fix direction, as principles a non-developer can hold in their head and check work against. `###` per principle. In the real audit: reference data moves out of the app and into dated records; reading it must not happen on every output; there must be a visible staleness check; a published document must be frozen; there is no free API for this so it is a maintained table plus an annual review; assumptions should become fields.

**10. Not yet verified.**
Everything you could not confirm, and what would confirm it. Short. Honest.

---

## Where the verdict goes

The rebuild-or-fix verdict does **not** go in `FINDINGS.md` — that document is about the app, not about the plan. Deliver the verdict in the conversation, and if the user wants it written down, as a separate plan document. Keeping them apart means the owner can circulate the write-up without circulating a recommendation they haven't agreed to yet.

Spoken, the verdict is four things: the recommendation, the two or three signals that decided it (from the decision table in `auditing-and-fixing.md`), the honest cost of following it, and — on a rebuild — exactly which parts get carried across rather than rewritten.

---

## Writing it out

- `FINDINGS.md` at the audited repo's root is the **one** file this skill may add to the target repo. Say so before you write it, and ask.
- **Never commit it.** Leave it as an untracked change for the user to review.
- If it already exists, read it first and **update in place**: keep any section the user has edited, fold in what's new, add the new review date to the header. Never silently discard their words.
- Keep it a single file. A pack the owner has to navigate is a pack the owner won't read.

## The quality bar

Measured against the audit this structure was generalised from, a `FINDINGS.md` is good when:

- **Every problem is sized** — in money where money applies, otherwise in a count, a percentage, or the specific trust it costs.
- **The good parts are stated as clearly as the faults**, each with the boundary of what it does *not* do.
- **Expectations are set honestly** where the owner is about to spend money on the wrong fix. In the real case, one paragraph explaining that connecting a paid data provider would stop the manual typing but would not change a single calculated figure prevented a wasted project. That paragraph was worth more than any single defect.
- **There is not one file path, line number or function name in the whole document** — and no term of art that isn't explained where it appears.
- **A non-technical owner can read it top to bottom and act on it**, and can circulate it without a translation layer.

Test it before you hand it over: read the first three sections as if you had never seen the code. If any sentence needs you to know what a database migration is, rewrite it.
