---
name: cs-marketing-offer-creation
description: >
  Design a paid-ads offer from evidence rather than opinion. Tears down what
  competitors are already running in the Meta Ad Library, ranks offers by
  survival and creative duplication, scrapes the landing pages behind the
  winning ads, then writes the offer, its price ladder, its order bumps and its
  back end into a durable teardown document. Use when designing or rewriting a
  front-end offer, a webinar or event registration page, an order bump, or an
  upsell. Triggers, "research offers", "what offers are working right now",
  "tear down this funnel", "scrape the ad library", "design a front-end offer",
  "what should our webinar promise be", "competitor ad research", "why is our
  CPC so high".
---

# Offer creation from ad-library evidence

## Overview

Produce an offer backed by what the market is already paying to run. The output
is a teardown document plus a specified offer, not a hunch. Consumes market
context from `cs-marketing-research`; hands its offer to `cs-marketing-website`
for the page build.

**Approval boundaries.** This skill reads public data and writes documents. It
must not launch ads, spend budget, publish pages, or contact competitors. It
must not copy competitor copy into production — quote it as evidence only.
Apify runs cost credits, so ask before using the paid route when a free one
exists.

## 1. Frame the decision

State before researching: the product being sold, the avatar, the traffic
source, the price the back end needs to support, and the CPC or cost-per-lead
target. An offer designed without a back-end price is a guess.

If any of these are missing, ask. Do not research generically.

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

1. **A duplicated creative is a winner.** `N ads use this creative` means one creative across N ad sets. Nobody duplicates twenty-four times to test; they duplicate because it already won. This is the only free profitability signal that exists.
2. **Many creatives with no duplication means still testing.** Judge nothing until it survives.
3. **Mass inactivity kills an angle.** If an angle sits entirely in `active_status=inactive`, it was tried at volume and abandoned. Do not re-run it as though it were undiscovered.
4. **Age beats volume.** One ad alive 150 days outranks ninety ads alive three weeks. Spend fakes volume; it cannot fake survival.
5. **Durations are floors.** Meta resets the start date on material edits.

Also compute `active ÷ (active + inactive)` per keyword for the survival rate of
the space, and cross-check each operator's brand keyword against their personal
name — the oldest ad is often a different, older offer.

## 4. Scrape the pages behind the winners

Fetch the destination URLs from step 2. Funnel pages are usually JS-rendered; if
a fetch returns only the footer or a 403, load it in a browser instead.

Capture verbatim, never paraphrased: headline, sub-headline, every bullet, form
fields, CTA button text, countdown or date language, price, guarantee, and proof
claims. Paraphrase destroys the evidence.

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

- **Does the promise end at money?** Offers that stop at a capability die young. Offers that close the loop to revenue survive.
- **Is the number in the first line?** Winning pages lead with a specific figure and make it the reader's future, not the founder's past.
- **Is the front end in the proven band?** Free registration, or roughly $7–$97. Anything above needs a free front door in front of it.
- **Is there an order bump?** A single front-end price rarely liquidates ad spend. Bumps should sell the half the core product does not deliver.
- **Is the back end an outcome rather than more software?** Winning back ends sell the result; the software is the delivery mechanism.
- **Is there one door per avatar?** Separate registration pages feeding one event beat one page trying to address everyone.
- **Is the proof aggregate?** Customer averages travel further, and survive scrutiny better, than founder claims.

## 7. Artifacts

- A dated teardown document in the project's research folder.
- A specified offer: promise, avatar, format, price ladder, bumps, back end.
- A concise ingest into Atlas so later work inherits the decision.

## 8. Verification

Do not report completion without: the query strings used, ad and duplication
counts per operator, at least one verbatim landing page per shortlisted offer,
and an explicit statement of what was not covered.

## 9. Status language

Use `draft`, `dogfooding`, `proven`, `deprecated` exactly as defined in
`docs/skill-governance-sop.md`. An offer that has not run traffic is `draft`,
however good the research is.

## Pitfalls

- **Benchmarking against a dead funnel.** Confirm which of your own campaigns are actually live before comparing. A paused offer's creative is not your current positioning.
- **Reading raw ad counts as spend.** Ad count without the duplication breakdown misreads eight winning creatives as eighty tests.
- **Treating an empty lane as opportunity.** Usually it means unproven demand, not undiscovered demand. Say which you believe and why.
- **Copying competitor copy.** Quote it as evidence; never ship it.
- **Claiming conversion insight.** Longevity and duplication are profitability proxies. Nothing in the Ad Library measures conversion, and no spend data exists for US-targeted ads.
- **Sampling silently.** Every sweep is impressions-sorted and sampled from the top. State what was left uncovered.

## Handoff

Feeds `cs-marketing-website` for the page build, and the offer's back-end
definition into the relevant build or release planning.
