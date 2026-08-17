# The systems questions — data that goes stale, and the shape the app has to be

Five checks that decide whether the app survives its second year. The named examples are **labelled worked examples** from real runs, not assumptions about the app in front of you.

## Why these belong in planning and nowhere else

Nobody asks for any of this. They are not features, they never appear in a walked journey (`elicitation.md`), and a user cannot describe them because they are invisible until the day they go wrong. But each one is **cheap as a decision and expensive as a retrofit** — changing where a number lives, who is allowed to edit it, or which database it sits in means touching every screen that reads it, and in one case it means changing the permission model of the whole app.

So they are asked **during the Think phase, before the plan is read back at the gate.** The actor question (§3 below) has to come earliest of all, because it adds features to the list.

The five, in the words to ask them in:

| # | The question to ask |
|---|---|
| 1 | **"What figures does this app rely on that somebody else publishes — and what happens on the day they change?"** |
| 2 | **"Is this app one of several that will share the same core logic? Is the same calculation, ruleset or model going to run in more than one place?"** |
| 3 | **"Who are all the different kinds of people who use this, what can each of them see and do, and who administers it?"** |
| 4 | **"Does the organisation already have a database, and is another product — or another person — already working in it?"** |
| 5 | **"Does the user need to know how current the data is? Would they ever need to prove where a figure came from?"** |

---

## 1. Reference data that goes stale

> **"What figures does this app rely on that somebody else publishes — and what happens on the day they change?"**

Follow-ups: *how often do they change, who publishes them, and does anything tell us when they have?*

**Reference data** here means any number the app uses but does not own — someone else decides it, publishes it on a schedule, and it is wrong for everyone from the moment it changes until the moment the app is updated. It is far more common than people expect: tax and duty rates, statutory thresholds, interest or benefit rates, shipping tariffs, postage prices, currency conversions, compliance limits, licence fees, minimum wage, contribution caps, mileage allowances.

If the answer to the question is "none", say so and move on. If it is anything else, these rules apply.

### The rules

- **Reference data belongs in the database, not in the code.** This is the whole decision, and it is one sentence long. If a rate is typed into the code, updating it is a developer editing a file and shipping a new version of the app. If it is a row in a table, updating it is a data change — someone edits a value and every user has the new number immediately. Same number, completely different cost, forever.
- **Every row carries the dates it applies between, not just a current value.** Two extra columns — *applies from* and *applies until* — turn a single figure into a history. Without them the app can only ever answer "what is it now", and it silently forgets that it ever said anything different.
- **The app resolves which value applied at the date of the thing being modelled, not "the current one".** This is the rule people skip, and it matters in both directions. Looking backward: a document produced for last year must use last year's figures. Looking forward: **a projection that crosses a known future change must use the new value after that date** — an app modelling ten years ahead, with a rate change already announced for next April, is wrong from year two onward if it uses today's number all the way through.
- **Anything the app saves that used those figures records which version produced it.** Store the inputs, the result, and the identifier of the reference data set behind it. Otherwise correcting a figure later silently changes a document a customer has already received, printed, or sent to their accountant — and nobody can reconstruct what the app said at the time or explain the difference.
- **The app knows when its own data has expired, and says so.** If today is past the end date of every row, the app must show that it can no longer verify these figures, rather than continuing to present them as current. Software asserting currency it cannot check is the thing that costs trust (§5).
- **Do not assume an API exists.** For a great many public datasets there is no feed at all, free or paid, and there never has been. Scraping the publisher's website is *more* fragile than a maintained table, not less: it breaks silently whenever a page is redesigned, and it fails by shipping a wrong number rather than by stopping. The realistic pattern, and the one to plan for, is unglamorous and reliable: **a table, a small import script, a dated annual review, and a written record of where each figure came from and when it was last checked.** Say this out loud at plan time, because "can't it just fetch them automatically?" comes up in every one of these conversations and deserves a settled answer rather than a repeated one.
- **Give the owner a way to edit it.** They will need to model a change that has been announced but not yet legislated, or to correct something you got wrong, before you can realistically ship an update. That is an editing screen for the owner and nobody else, which is §3's job — and it is the most common reason the admin surface gets discovered too late.

### Where it lands in the plan

The reference table is part of the data model in the note; the annual review is a real, recurring job that belongs in the plan rather than in someone's memory; the owner's editing screen is a feature on the map. None of the three appears unless the question is asked.

> **Worked example.** A property-investment calculator covering eight jurisdictions. Every jurisdiction's tax and duty tables were typed directly into a web page — and the same tables existed in **five places across two repositories**, two of which had already drifted, so the same property produced different figures depending on which page the user opened. **No government API exists for any of it**, in any of the eight jurisdictions, so the automatic-fetch idea that everybody proposes was never available. The correct shape was one dated table per jurisdiction in the database, a resolver that picks the rows applying at the date being modelled, a stamped version on every saved report, an expiry warning, and a screen where the owner can enter next year's rates the week they are announced.

---

## 2. Shared logic across more than one product

> **"Is this app one of several that will share the same core logic? Is the same calculation, ruleset or model going to run in more than one place?"**

Ask it even when the answer looks obviously "no" — a web app plus its own admin tool is already two places, and "we'll do a mobile version later" is the same answer arriving a year late.

If it is genuinely one product with one place the logic runs, skip the rest of this section.

### The rules

- **The shared part becomes one package that every product imports.** A *package* here just means a self-contained folder of code with a name, which other projects depend on the way they depend on any other library. Never copy-pasted between projects, never reimplemented in a second language because it was easier at the time.
- **The shared part is pure.** *Pure* means: given the same inputs it always returns the same answer, and it touches nothing else. No database access, no network calls, no framework imports, no reading the clock, no randomness. Anything it needs — including today's date and the reference data from §1 — is **passed in as an argument.** That constraint is not tidiness; it is the only thing that makes the same code usable in a browser, on a server, in a background job, and in a second product, and it is what makes it testable without any of them.
- **Give it a version number**, and let anything it produces record which version produced it. Paired with the reference-data version from §1, that means any saved output can be explained: these inputs, that data set, this version of the rules.
- **Structure it as several small files by topic, not one large one.** A single enormous file is precisely what makes the next person copy one function out of it instead of importing the package — and that copy is where the divergence starts.

### The failure this prevents

**Two copies of the same logic always diverge, and the divergence is invisible.** Nobody edits both. There is no error, no crash and no failing test — just two parts of the business quoting different numbers for the same thing, usually discovered by a customer, and usually long after both numbers have been sent to people.

> **Worked example.** The same property calculator had its calculation engine in two places. The copy the secondary pages used sat a full financial year behind for nine days, so the identical property produced different government charges depending on which page it was opened from. Nothing failed and nothing was logged; there were no tests to notice. One imported package, pure, with a version stamped onto every saved report, removes the entire class of problem.

---

## 3. Who uses it, and what each of them can reach

> **"Who are all the different kinds of people who use this, what can each of them see and do, and who administers it?"**

**Ask this before the feature list is final**, because the answer adds features to it. It belongs next to the walked journey in `elicitation.md` — that section finds the second user who *puts the content in*; this one finds every remaining actor and what each is allowed to reach.

### The rules

- **Enumerate every actor, including the ones people forget.** They will describe one. There are usually four or five: the end customer; **their** customers or clients, who often receive an output without ever logging in; staff or team members; partners, resellers or referrers; and **the owner of the business running the app**. Write the list down, and for each one write what they can see and what they can do.
- **Almost every app needs an admin surface for the owner.** A place to see who has signed up, manage plans and access, and edit the data the app depends on. It is missed at planning time on nearly every project, and it is expensive to retrofit for a specific reason: **it changes the permission model**, so it is not a screen bolted on at the end but a distinction that has to run through the data from the first day.
- **Some data must be editable by the owner and by nobody else.** The reference data in §1 is the classic case: every user reads it, exactly one person changes it. That is a different kind of ownership from "this row belongs to this user", and both have to exist in the data design from the start.
- **Ask what plans or tiers exist and what each one unlocks.** The answer decides whether entitlement — what this account is allowed to do — is a single column on an account, or a whole subsystem with limits, counters and upgrade paths. Those are very different builds and the difference is settled by one question.
- **Permissions are enforced at the database and on the server, never only in the interface.** Hiding a button is not access control. The rule to state plainly: every request re-checks who is asking and what they own, on the server, and the database itself refuses to return rows that belong to somebody else — regardless of what the screen showed.

> **Worked example.** The same property calculator was described as a tool for financial advisers, and the plan on the table had exactly one kind of user. There were four. The adviser used it; **the adviser's client** received the report as a document and was the person whose trust the whole thing depended on; the adviser's **firm** wanted to see what its people were producing; and **the owner of the business selling the app** needed to see who had signed up, manage their plans, and update eight jurisdictions of tax tables himself the week the budgets landed. Only the first was in the plan. The fourth is the one that changes the permission model.

---

## 4. Where the data lives, and who else is in it

> **"Does the organisation already have a database, and is another product — or another person — already working in it?"**

The tempting answer is "we already have one, put it in there." It is almost always wrong.

### The rules

- **Sharing a database between two products is the fastest route to confusion.** Three predictable costs: a table count where most of the tables belong to something else, so nobody can see the shape of either product; **name collisions** between them, where both want a table or a column called the obvious thing and one of them has to be renamed into something misleading; and permission mistakes, where a rule written for one product exposes its data through the other.
- **Default to a separate database per product.** Same shape in both — in particular the same **tenant boundary**, meaning every row carries which account or organisation owns it, expressed the same way in both places. That is what keeps a later merge possible.
- **Merging two well-shaped databases is a migration. Unpicking one tangled database is a rebuild.** That asymmetry is the whole argument: separate is reversible, shared is not.
- **The argument is strongest when a non-technical owner is actively working in the existing database.** Two people with different tooling in one database — one editing rows through a dashboard by hand, one shipping schema changes from code — will collide, and the collision usually destroys someone's work rather than raising an error.

> **Worked example.** An owner had a database already in daily use by another product, and was editing rows in it himself through the provider's dashboard. Adding the new app's tables there would have put both products' tables in one list, put a hand-editing human and an automated migration in the same place, and made every permission rule twice as hard to reason about. Separate database, identical ownership column in both, merge later if it is ever actually wanted.

---

## 5. Freshness and provenance in the interface

> **"Does the user need to know how current the data is? Would they ever need to prove where a figure came from?"**

Checks 1 and 2 decide what the app *knows*. This one decides what it *says*, and it is the half that customers actually see.

### The rules

- **If an output is used to make a financial, legal or medical decision, show what data it used and as at when.** A line saying which figures were applied and the date they were current to, on the screen and on anything exported or printed. This is what makes an output defensible months later, when the numbers have moved and somebody asks why the document says what it says.
- **Never present a figure as authoritative when the app cannot verify it is current.** A printed claim like *"rates current for this financial year"* sitting next to numbers that nothing checks is worse than printing no claim at all: it converts an ordinary staleness problem into a false statement the business has made in writing.
- **If a value is an estimate or an assumption, say so where it appears, and let the user override it.** Not in a footnote, not in a help page — next to the number. The nastiest version of this failure is a field that is honestly labelled as estimated in one mode and loses the label in another, so the same guess is presented as a precise result.
- Assumptions presented as precise results are **a trust problem, not a cosmetic one.** A user who catches one number that was quietly invented stops believing all the others, including the correct ones, and does not come back to check.

> **Worked example.** A generated property report named its government source and financial year beside figures that nothing validated — including for an unrecognised location, where every government charge came out as zero and the report presented the zeros with the same confidence as everything else. The fix was not a bigger disclaimer: it was the app knowing which dated data set it used, printing that data set and its as-at date on the report, refusing to produce charges at all for a location it does not recognise, and labelling every estimated input as estimated at the point it is shown.

---

## What good looks like

- [ ] Every figure the app relies on that **somebody else publishes** is named, with how often it changes and who publishes it.
- [ ] That data lives in **dated rows in the database**, never in code, and the app resolves the value that applied **at the date being modelled** — including across a known future change.
- [ ] Saved outputs record **which version of the data and which version of the logic** produced them.
- [ ] The app can tell when its data has **expired**, and says so instead of asserting currency.
- [ ] There is a plan for **keeping it updated** — a table, an import script, a dated review, a record of sources — and no assumption that an API exists.
- [ ] If the same logic runs in more than one place, it is **one imported package, pure and versioned**, split into small files by topic.
- [ ] **Every actor is listed** with what they can see and do — including the customer's customer, and the owner of the business.
- [ ] There is an **admin surface for the owner**, including editing the reference data, and it was in the plan rather than added later.
- [ ] **Plans and tiers** are settled, so entitlement is scoped as either a column or a subsystem deliberately.
- [ ] Permissions are **enforced on the server and in the database**, and the plan says so in those words.
- [ ] The database decision is **deliberate** — separate per product by default, with the same ownership boundary in both.
- [ ] Anything used for a real decision shows **what data it used, as at when**, and every estimate is **labelled and overridable** where it appears.
