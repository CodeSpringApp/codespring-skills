---
name: cs-marketing-offer-creation
description: >
  Design or sharpen a commercial offer from customer-call evidence or competitor
  ad research. Use for front-end promises, profit versus pain-relief angles,
  price ladders, webinar offers, order bumps, or funnel teardowns. Produces a
  claim-checked offer brief; does not build or publish the page.
---

# Offer creation from customer and market evidence

## Overview

Produce a specified offer with explicit evidence and unresolved assumptions.
Use customer evidence for a quick offer decision and market research when the
user wants competitive validation. Consumes market
context from `cs-marketing-research`; hands its offer to `cs-marketing-website`
for the page build.

**Approval boundaries.** This skill reads public data and writes documents. It
must not launch ads, spend budget, publish pages, or contact competitors. It
must not copy competitor copy into production — quote it as evidence only.
Apify runs cost credits, so ask before using the paid route when a free one
exists.

## Choose the mode

- **Call-informed offer:** the user supplies calls, pains, current copy or asks
  for a few simpler offers. Read [call-informed offers](references/call-informed-offers.md),
  use that workflow and stop at the requested draft. Do not force an Ad Library
  sweep or a full price ladder before giving useful options.
- **Market teardown:** the user asks what competitors run, current market
  evidence or funnel research. Follow sections 1–6 below. Longevity and
  duplication are observations, not proof of profitability.
- **Combined:** use the calls to choose the hypothesis, then research alternatives
  only to the depth requested. Keep prospect evidence separate from ad proxies.

In all modes, distinguish verified results, user-reported claims, hypotheses and
illustrative targets. Revenue is not profit; saved hours are not automatically
cash savings. Never move proof from one buyer or business model into another.
Publishing, ad spend and new customer obligations require separate authority.

## 1. Frame the decision

State before researching: the product being sold, the avatar, the traffic
source, the price the back end needs to support, and the CPC or cost-per-lead
target. An offer designed without a back-end price is a guess.

Ask only when a missing input changes the research decision; otherwise state
the assumption. Unknown back-end pricing can remain an explicit gap in a draft.

## 2. Pull the ads

### Free route — the browser. Default to this.

Drive `facebook.com/ads/library` directly. No credits, no API.

```text
active_status=active|inactive|all
ad_type=all
country=US|GB|ALL
media_type=all
q=<terms>
search_type=keyword_exact_phrase | keyword_unordered
```

- `keyword_exact_phrase` — the literal phrase. Use for brand names, signature hooks, and measuring an angle's size.
- `keyword_unordered` — **AND across all terms.** The workhorse for finding offers. Four to five terms; six or more returns zero.

Parse by splitting `document.body.innerText` on `Library ID: `. Each chunk gives
the start date, the advertiser (the line before `Sponsored`), the
`N ads use this creative` count, `0:00 / 0:00` when the creative is video, and
the display domain.

Destination URLs are not in the text. Pull them from the DOM:

```js
[...document.querySelectorAll('a[href*="l.php"], a[href*="l.facebook.com"]')]
  .map(a => decodeURIComponent(new URL(a.href).searchParams.get('u') || ''))
```

Pagination is a **"See more"** button, not infinite scroll. Click it in a loop.

### Paid route — Apify MCP. Ask first; it spends credits.

Server `apify` at `https://mcp.apify.com/`, header `Authorization: Bearer <APIFY_TOKEN>`.

```text
search-actors        find a Facebook Ad Library actor
fetch-actor-details  read its input schema BEFORE calling
call-actor           run it (waitSecs 0-45; 0 returns a runId immediately)
```

Results return storage IDs, not rows. Build the URL from the ID and read it as
an MCP resource, paging with `limit`/`offset` because reads inline only to
about 256 KB:

```text
http://api.apify.internal:3333/v2/datasets/{datasetId}/items?clean=true&format=json&limit=100
```

Use this route for volume, scheduled monitoring, or when the browser is
unavailable.

## 3. Read the numbers

Five rules decide everything downstream.

1. **Duplication is a prioritisation signal, not a confirmed winner.** Record the library's displayed grouping literally; do not infer spend, ad-set count or profitability without account data.
2. **Many variants may indicate testing.** State the inference, not certainty about the operator's strategy.
3. **Inactivity needs context.** An ended campaign may be seasonal or budget-limited. Do not pronounce an entire angle dead from status alone.
4. **Age helps select research candidates.** Long-running ads merit inspection, but survival does not establish return on spend.
5. **Record observation dates and displayed dates.** Do not infer a complete uninterrupted history from a snapshot.

Also compute `active ÷ (active + inactive)` per keyword for the survival rate of
the space, and cross-check each operator's brand keyword against their personal
name — the oldest ad is often a different, older offer.

## 4. Scrape the pages behind the winners

Fetch the destination URLs from step 2. Funnel pages are usually JS-rendered; if
a fetch returns only the footer or a 403, load it in a browser instead.

Capture source URLs and exact short excerpts where permitted, especially the
headline and CTA. Summarise longer third-party material within source-use limits,
clearly labelling paraphrases. Record price, guarantee, date language and proof
claims without copying entire copyrighted pages into the deliverable.

**Evergreen tell:** a CTA reading "See The Next Workshop Time" or "STARTING 8PM
TONIGHT" with a rolling countdown, rather than a fixed calendar date.

**Also record the mechanics, not just the copy** — social-proof counters,
incentivised phone capture, attendance bribes, and how many separate
application pages sit behind one registration.

## 5. Write the teardown

One entry per offer. Name the offer so it can be argued about.

| Field | Why it matters |
|---|---|
| Front-end format | webinar, evergreen, challenge, VSL, sales page |
| Promise, verbatim | the words that actually buy the click |
| Product sold | SaaS, agent, marketplace, course, community, coaching, DFY |
| Price ladder | front end, order bumps, OTO, high-ticket |
| Operators running it | one company, or a licensee/affiliate network |
| Ads and duplication | total ads, and unique creatives |
| Days live | from the oldest still-active ad |
| Format mix | video versus static |

## 6. Specify the offer

Test the draft against what the teardown shows.

- **Is the result commercially meaningful?** Connect the capability to the buyer's actual job, profit or operational constraint. Do not force a money promise when the evidence supports relief instead.
- **Does a number clarify the outcome?** Use substantiated amounts or clearly labelled demonstration scope; never invent a percentage for impact.
- **Does the price match the deliverable and economics?** Competitor price bands are observations, not universal limits.
- **Would a bump add distinct value?** Do not add one automatically or hide what the core purchase lacks.
- **Is the back end a credible outcome with a delivery mechanism?** Keep its licence, implementation and ongoing costs distinct from a low-ticket educational front end.
- **Is there one primary buyer per page?** Separate materially different buying motives, rather than writing a page for everybody.
- **Does proof match this claim and buyer?** Neither founder results nor customer averages guarantee the prospect's outcome.

## 7. Artifacts

- A dated teardown document for market mode, or a concise call-informed offer brief.
- A specified offer: promise, avatar, format, price ladder, bumps, back end.
- A claim ledger: wording, source, evidence status and unresolved validation.
- A concise ingest into Atlas so later work inherits the decision.

## 8. Verification

For market mode, report query strings, observed counts and dates, source pages
with permitted excerpts, and sampling limits. For call-informed mode, report
the buyer, outcome, obstacle, mechanism, actual deliverable, terms and claim
gaps. Preserve the user's selected copy. Do not build the page without authority.

## 9. Status language

Skill maturity uses `draft`, `dogfooding`, `proven`, `deprecated` per governance.
Deliverable status uses `DRAFT`, `READY`, `AWAITING APPROVAL`, `LIVE / VERIFIED`
or `BLOCKED`. A selected brief can be READY for implementation while its market
performance remains unproven. Never claim a target conversion rate was achieved.

## Pitfalls

- **Benchmarking against a dead funnel.** Confirm which of your own campaigns are actually live before comparing. A paused offer's creative is not your current positioning.
- **Reading raw ad counts as spend.** Ad count without the duplication breakdown misreads eight winning creatives as eighty tests.
- **Treating an empty lane as opportunity.** Usually it means unproven demand, not undiscovered demand. Say which you believe and why.
- **Copying competitor copy.** Quote it as evidence; never ship it.
- **Claiming conversion insight.** Public longevity and duplication observations do not reveal conversions or prove profit. State exactly which account metrics, if any, were available.
- **Sampling silently.** Every sweep is impressions-sorted and sampled from the top. State what was left uncovered.

## Handoff

Feeds `cs-marketing-website` for the page build, and the offer's back-end
definition into the relevant build or release planning.
