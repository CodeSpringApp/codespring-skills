---
name: cs-marketing-seo
description: Use when an app needs a verified SEO operating system. Establishes crawl/index health, query-led priorities, page briefs, internal links, honest discovery and a measurable review loop.
metadata:
  author: codespring
  version: "0.1"
---

# SEO operating system for an app

Use this skill after `cs-marketing-website` has produced a page inventory and NOW/NEXT/LATER/BLOCKED workboard. It creates a trustworthy SEO system for a real app: technically discoverable pages, a query-led page backlog, honest evidence and measurable conversion paths.

SEO here does **not** mean publishing keyword variants, buying links, promising rankings or treating a third-party authority metric as the outcome. AEO content is a separate handoff: it uses the same factual source material to make answer-led Resources pages easy to understand and quote.

## Required inputs and prerequisites

Collect or mark as **BLOCKED**:

- production site URL and website source repository;
- page inventory and website workboard from `cs-marketing-website`;
- technical authority to inspect, change and deploy the site;
- Google Search Console and analytics access status;
- known product/category pages, conversion action and approved proof;
- existing sitemap, robots and canonical behavior.

Never assume a local build proves production indexability. Never create accounts, submit a sitemap, change robots, publish a page, request indexing, pay for a placement or make customer-facing claims without the relevant authority and approval.

## Artifact contract

Create or update these durable records in the client repository or operating workspace:

1. `seo-baseline.md` — inspection date, production evidence, failures, owner and remediation status;
2. `seo-content-register.csv` — every proposed or live organic page and its intent, evidence, status and review date;
3. `seo-discovery-ledger.csv` — vetted third-party discovery/listing prospects and approval state;
4. existing website page inventory and workboard — updated with the next action, dependency and verified live status.

Use the templates and references bundled with this skill.

## Step 1: inspect the live technical baseline

Inspect the public production URL **and** source implementation. Record evidence, not assumptions.

Check:

- canonical host and HTTPS behavior;
- `robots.txt`: response, content type, crawl policy and sitemap declaration;
- `sitemap.xml`: response, parseability, canonical indexable URLs only;
- page-level status, title, meta description, H1, self-canonical and robots directive;
- accidental duplicates, previews, account/conversion-only pages and empty hubs;
- crawlable internal links and the primary conversion path;
- visible-content-backed structured data only;
- mobile usability and page performance issues that materially block users/crawlers.

For static sites, distinguish source generation from hosting/CDN behavior. A host redirect or deployment problem may require infrastructure access, not an application-code patch.

**Done when:** `seo-baseline.md` lists the production evidence, clear owner and status for every issue. No completion claim until public verification after deployment.

## Step 2: establish query-led priorities

Use Search Console exports where available. Retain query, page, clicks, impressions, CTR, average position, country and date range. If access is absent, create a **DRAFT** backlog from support conversations, sales objections, credible customer research and product evidence; do not present it as search data.

Cluster by intent:

- product/category and commercial evaluation;
- problem/how-to guidance;
- comparison/alternative decisions;
- support/product documentation;
- brand/navigation.

Prioritise one page at a time using:

1. broken or misleading high-value existing page;
2. strong buyer/problem intent with approved evidence;
3. Search Console impressions with a credible CTR/position improvement path;
4. a necessary supporting page for a conversion or internal-link cluster.

For each candidate, use `cs-marketing-website`'s page brief before writing. It must name one target intent, page home, original evidence, conversion CTA, existing page to avoid duplicating, internal links, indexation decision and review date.

**Done when:** every SEO work item has an owner, evidence, page home, status and next action in the register/workboard.

## Step 3: publish useful, connected pages

For every indexable page:

- answer the reader’s real job, not just a phrase;
- provide original value: a tested workflow, product demonstration, approved proof, transparent analysis or genuinely reusable asset;
- link to the relevant product/conversion page and related pages in the same cluster;
- use honest titles/descriptions, an explicit canonical and truthful schema;
- include it in the sitemap only when complete, canonical and intended for indexing;
- capture the publication/deploy date and 14/28/56-day review dates.

Page homes are strict: evergreen answers belong in Resources; company updates belong in Blog; customer operation help belongs in Docs; customer outcomes belong in approved Stories. Do not duplicate the same answer across all four.

## Step 4: build legitimate discovery and authority

Use third-party mentions because they reach relevant people or credibly corroborate a product—not because they promise a link metric.

A prospect qualifies only if it reaches the buyer/developer community, is a truthful review/integration/partner profile, can drive editorial discovery/referrals, or is a launch with a real community response. Reject paid-dofollow schemes, bulk directories, reciprocal-link farms, spun submissions and fabricated reviews.

Before any outreach or submission, assemble approved product facts, canonical/referral URL, current pricing/support details, media assets, owner and permission. Record status precisely: **DRAFT**, **AWAITING APPROVAL**, **SUBMITTED**, **LIVE / VERIFIED**, **REJECTED**.

**Done when:** the discovery ledger records public verification and referral/conversion review; submission alone is not success.

## Step 5: run the measurement loop

Review at 14, 28 and 56 days after a meaningful page change, then monthly at cluster level. Record:

- non-branded impressions and clicks;
- query/page CTR and average position;
- indexation failures or changes;
- qualified organic sessions and conversion events;
- referral traffic and attributable sign-ups;
- next refresh, consolidation, redirect/noindex or expansion decision.

Do not promise rankings, traffic or revenue. Report what changed, evidence observed, what remains unknown and the next action.

## Approval boundaries

- **Production changes/deploys:** need the repository/environment authority and public verification afterward.
- **Search Console/analytics:** need account access; never expose credentials in artifacts.
- **Indexing requests/listing accounts/submissions:** need organisation approval and company-controlled credentials.
- **Paid placements/spend:** explicit approval for source, cost and copy.
- **Customer claims/quotes/metrics:** written approval and attributable evidence before public use.

## Handoffs

- Website/page purpose, conversion paths and priorities → `cs-marketing-website`.
- Source-backed, answer-led Resources pages and AI-answer discoverability → `cs-marketing-aeo-content`.
- Editorial calendar, briefs, publishing/review rhythm and customer-story workflow → `cs-marketing-content`.

## Verification checklist

- [ ] Live baseline evidence is recorded; local state is not described as production state.
- [ ] Page inventory and SEO register agree on every active organic page.
- [ ] Every indexable page has intent, original evidence, CTA, internal links, indexation decision and review date.
- [ ] Sitemap/robots/canonical changes are publicly verified after deployment.
- [ ] Every discovery prospect passed relevance and approval gates.
- [ ] Query/conversion review dates are scheduled and owners are named.
- [ ] Workboard is updated using the approved status language.
