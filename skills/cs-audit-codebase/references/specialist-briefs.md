# Specialist Sub-Agent Briefs

Copy-ready briefs for the parallel audit fan-out. Every brief is **self-contained** — the sub-agent gets the target path, the rules, and its own domain, and nothing from the other agents. Independence is the point: two agents reaching the same conclusion by different routes is the strongest evidence you can get, and that only works if they never saw each other's output.

## The shared preamble — prepend to EVERY brief

> **Target:** `<absolute repo path>` · **Live app:** `<url the orchestrator started, or "not running">`
> **Stack (already established, do not re-derive):** `<one paragraph — languages, frameworks, build, hosting, backend, database>`
> **Scratchpad for your output:** `<absolute path>/findings-<domain>.md`
>
> **Rules:**
> - **READ-ONLY on the repo.** Do not create, edit, move or delete any file under the target path. Write only to your scratchpad file.
> - Cite everything. Every finding carries a `file:line` reference **or** the exact command you ran and its output.
> - Label every finding **CONFIRMED** (you executed it or read the exact line — say which), **INFERRED** (deduced from code you read but did not run — state the inference), or **UNVERIFIED** (suspected, not checked — state what would check it). A finding with no label is not a finding.
> - **Report honestly.** If you cannot verify something, say so. Never present a guess as fact. Do not inflate severity to seem useful, and do not soften a real problem.
> - **Report the positives too.** "No privileged key was ever committed", "the input sanitiser is genuinely correct", "these controls are all correctly wired" are high-value findings. Include a "what works well — don't break it" section.
> - Rank findings **Critical → High → Medium → Low** by real-world consequence (money, legal/regulatory exposure, or loss of customer trust), not by how interesting the bug is.
> - Structure: executive summary (5–8 bullets, the headline first) → evidence tables → numbered findings → what works well.
> - Live probing of the user's own running app and own services is authorised where stated in your brief, and must be **non-destructive**: no deletes, no updates, no bulk data extraction. If you must prove write access, one clearly-labelled test row, and report exactly what you inserted and where.

## 1. Security / auth / trust boundary

> Audit the trust boundary between whatever ships to the user and whatever runs on a server.
> 1. **Enumerate the API surface** — every endpoint/action/route the client can call: what it sends, what it returns, what the server checks. One row per call.
> 2. **Test authentication for real.** Strip the credential and call anyway. Does it 401 at the gateway, or does it run? Is identity a verified session/token, or an opaque identifier the client supplies?
> 3. **Test authorization per action** — separately for reads and writes. Can a caller act on a record they do not own? Does a write with a bogus identifier return success? Does the server scope results, or does the client filter after receiving everything?
> 4. **Secrets** — what is embedded in shipped code, and what does it actually grant? Scan history for privileged keys. State the negative result explicitly if there is one.
> 5. **Row-level / database-level protection** — is it on and effective? Prove it (a table with data that reads empty through the public path proves the policy works; an empty result alone proves nothing).
> 6. **Third-party code** — scripts loaded from a CDN, pinned versions, integrity hashes, what those pages have access to.
> 7. **Response headers**, error verbosity (do errors leak internal names?), rate limiting, payment/entitlement paths.
> 8. For each finding: what an attacker gets, what it would take, and the fix.

## 2. Database / schema / data layer

> Audit how data is stored and reached.
> 1. **Trace the full data path** from user action to storage. Name every hop.
> 2. **Inventory the schema** — every table/collection/store, key columns, enums, relationships. Mark each **CONFIRMED (named in code)**, **CONFIRMED (observed live)** or **INFERRED**.
> 3. **Ownership** — which tables does *this* app own, which are shared with another system, which are read-only for it. A shared naming prefix does not prove shared ownership; check the actual call sites both ways.
> 4. **Schema management** — are there migrations? In version control? Can the schema be rebuilt from the repo? Is there a local/staging database, or does every change hit production?
> 5. **Is the server-side source in the repo at all?** If the backend lives only in a hosting dashboard, that is a critical finding — say what would be lost and give the exact commands to back it up.
> 6. **Orphans and unknowns** — what is unused, and what you *cannot* determine from where you sit (say so, and give the query that would answer it).
> 7. **Typing** — does the client guess field names? Fallback chains for a single field are a symptom; count them.
> 8. Output a concrete capture-and-migrate sequence the user can run.

## 3. Core business logic

> Audit the part of this app that produces its actual output — the calculation, the pipeline, the ranking, the decision, whatever the product is *for*. This is usually where the money is.
> 1. **Establish ground truth by executing the real code**, not by reading it. Extract the logic into a scratch harness and run it, or drive it in the live app. Prove your harness is faithful (identical source, only the environment stubbed) and say how. Where two independent methods agree, state that.
> 2. **Verify the outputs against authoritative external sources** where the domain has any — published rates, specifications, official documentation. Report which ones you checked and which you could not.
> 3. **Walk one complete output end to end**, showing every intermediate figure, so a human can check it by hand.
> 4. **Edge and degenerate inputs**: empty, zero, negative, absurdly large, wrong case, wrong type, wrong format, whitespace. For each: correct result, wrong result, exception, or **silent wrong result** — the last is the worst and the most important to find.
> 5. **Hunt hardcoded reference data** — anything with an expiry date typed as a literal. Table it: what, where, duplicated where, what happens when it goes stale, and whether the output *claims* to be current.
> 6. **Hunt drift** — is this logic duplicated? Do the copies agree *today*? Did they ever disagree (check history)? Which copy does the main entry point actually load?
> 7. **Separate genuine errors from undisclosed assumptions.** A number that is a guess presented as precise is a finding even when the arithmetic is perfect.
> 8. **Size every error in the units the user cares about** — dollars, percentage points, hours.

## 4. Frontend / UX / dead controls

> Audit what the user actually experiences. Test live where possible, not just statically.
> 1. **Dead controls** — every interactive element: is it wired, does its handler exist, does it do anything? Report the negative loudly if wiring is good ("not one inert button in 194 controls" is a real finding).
> 2. **Orphan pages/screens** — reachable by URL, linked from nowhere. And the reverse: dead ends with no way out.
> 3. **Validation** — count required fields, bounds, patterns. Test what a wrong format does (a decimal separator read as a thousands separator silently divides by a thousand). Are negatives and absurd values accepted and printed confidently?
> 4. **Persistence** — which screens save work and which lose it on refresh? Is there an unsaved-changes guard? Does anything reload placeholder/demo content over real work?
> 5. **Failure and empty states** — what does the user see when a request fails? Is a failure distinguishable from an empty result? Does anything **fabricate plausible content** on failure? Does anything report success without checking?
> 6. **Destructive actions** without confirm or undo.
> 7. **Accessibility** — accessible names on controls, label association, live regions for content that updates, keyboard reachability, focus visibility, colour contrast (compute it, per theme).
> 8. **Mobile and print** — the output the customer is actually handed. Check the printed/exported artefact specifically; it is often styled differently from the screen.

## 5. Architecture / quality / scalability

> Audit structure, maintainability and limits. Be balanced — say plainly where the current design is a *reasonable* choice for the app's size, and do not recommend a rewrite by reflex.
> 1. **Measure it**: total lines, files, largest file, dependency count, build step, test count.
> 2. **Duplication register** — one row per duplicated thing: what, how many copies, where, drifted (today? historically? check history), which copy is authoritative, which copy is actually loaded.
> 3. **Test / lint / CI** — what exists. If nothing, say what the cheapest suite that would have caught the worst bug you found looks like.
> 4. **Delivery** — branch structure, review practice, whether deploy is gated on any automated check, whether the local clone is current with the remote, staging vs production, environment-variable mechanism.
> 5. **Error handling and observability** — count swallowed errors, count log/report calls, is there any global handler. If it breaks in production, does anyone find out?
> 6. **Measured performance limits** — payload size, largest assets versus their rendered size, work per interaction, caching, anything unbounded (a list with no pagination, a loop that never stops).
> 7. **Supply chain** — external origins, third-party scripts, integrity, privacy implications.
> 8. **A recommended path forward in three buckets:** this week / this month / **explicitly not doing** — and justify the "not doing" list.

## 6. Repository & delivery setup (do this yourself, it is fast)

Not a sub-agent brief — the orchestrator runs these directly, **before** the fan-out, because the answers caveat everything else.

```bash
git -C <repo> rev-parse --abbrev-ref HEAD          # current branch
git -C <repo> rev-parse HEAD                       # local head
git -C <repo> ls-remote --heads origin             # remote heads → is the clone behind?
git -C <repo> log --oneline -30                    # commit quality, intent-revealing messages?
git -C <repo> branch -a                            # branch structure, stale branches
ls -a <repo>/.github/workflows 2>/dev/null         # any CI at all?
cat <repo>/.gitignore                              # is it adequate before anyone commits secrets?
git -C <repo> log -p -S 'BEGIN PRIVATE KEY' --oneline | head
git -C <repo> log -p -S 'service_role' --oneline | head     # adapt markers to the stack
gh pr list --state all --limit 30                  # review practice (if gh is available)
```

Answer, in the report: is the clone current with the remote (if not, **caveat the whole audit**); is the server-side source in the repo; is deploy gated on any check or does merge ship to production; were secrets ever committed; is there a staging environment.

## Fan-out mechanics

- Launch all specialists **in one message, concurrently**. They are independent.
- Give each one only its own brief plus the shared preamble. No cross-talk.
- While they run, do the live pass yourself (§Run the app in `auditing-and-fixing.md`) — you are the sixth agent and the one who resolves disagreements.
- Add domains the app warrants: a competitor/incumbent comparison (invaluable when the app replaces a known product), a user-journey-and-failure map, a data-provenance pass ("which figures are real, which are typed in, which are assumptions"). Give each the same preamble.
- When they return: reconcile contradictions, independently reproduce the headline claims, and only then write the report. A later, better-informed pass beats an earlier one — record the correction rather than shipping both.
