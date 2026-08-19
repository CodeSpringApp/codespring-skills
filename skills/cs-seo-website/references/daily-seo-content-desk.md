# Daily SEO content desk

Use this operating loop to prepare a founder-reviewable SEO packet each morning without turning volume into scaled-content spam.

## Capacity rule

The target is **five qualified opportunities and five fully written, review-ready page drafts** per working day.

Five new indexable pages is a ceiling, not a quota. Build all five only when every page:

- owns a distinct search intent and does not cannibalise an existing CodeSpring URL;
- has current demand/SERP evidence and a credible CodeSpring conversion path;
- contains original explanation, proof, product UI, example, tool or founder judgment;
- passes the content, metadata, internal-link and visual verification gates independently.

Five is a production target, not permission to lower the gate. If only three or four opportunities can become useful, non-overlapping pages, deliver those complete pages and state why the other slots were withheld. A slot may instead be an existing-page refresh, internal-link improvement, documentation expansion or customer-proof page when that is the better canonical answer. [Google defines scaled-content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) as generating many low-value or unoriginal pages primarily to manipulate rankings; speed never overrides usefulness.

## Daily page mix

Select from these lanes according to demand rather than forcing one of each every day:

1. **Commercial comparison/category:** one substantial parent comparison or decision guide, not thin pairwise variants.
2. **Problem-led guide:** answer a specific founder question with a real workflow, example or product proof.
3. **Tool/template/checklist:** provide something immediately usable, with a truthful route into CodeSpring.
4. **Refresh/internal-link slot:** improve an existing canonical page that already owns the intent.
5. **Proof/docs/story slot:** deepen product documentation, customer evidence or a founder-led story only when the source material exists.

Instagram, TikTok, YouTube and sales-call material are **inputs**, not automatic landing pages. Extract repeated questions, objections, language and hooks; then validate search demand and intent before choosing the correct canonical page. Consolidate overlapping clips into one strong resource instead of making one URL per clip.

## Morning workflow

### 1. Refresh the evidence backlog

Use, in order:

1. Search Console query/page performance and existing content gaps;
2. the monthly cached DataForSEO demand/difficulty/SERP dataset;
3. a live SERP check for only the shortlisted queries;
4. recent sales-call objections and social-video topics as qualitative signals;
5. the current Resources, Docs, Blog and Vibe Code inventories to detect cannibalisation.

For every candidate record: query, country, intent, volume/date, difficulty signal, SERP composition, existing CodeSpring owner, product fit, original evidence, CTA and proposed lane.

### 2. Rank five opportunities

Score each opportunity on demand, commercial/problem intent, CodeSpring fit, ability to add original value, ranking feasibility, production effort and cannibalisation risk. Reject a candidate if its only distinction is a slight keyword variation.

Attempt full production for all five in rank order. Withhold a candidate rather than turn it into a thin page when it fails a gate. The morning packet must say exactly which gate failed.

### 3. Build complete review drafts

For each selected page:

- create or improve the canonical route in a review branch;
- lead with the reader's answer, not a CodeSpring pitch;
- include original examples, accurate product positioning and first-party proof;
- add visible contextual links to the homepage and relevant documentation;
- use authentic screenshots, meaningful alt text and source provenance;
- set title, description, canonical, schema decision, sitemap/index state and CTA;
- run contract tests and render the finished page.

Before founder review, run a plain-language editing pass that protects meaning rather than chasing a low word count:

- define the term with ordinary words such as `done`;
- make each causal chain explicit: original feature → later change → regression → check or test;
- replace compressed fragments or concatenated states with complete natural sentences;
- use bullets for three or more parallel checks, edge cases, steps or outcomes;
- break up dense prose with useful lists, examples, screenshots or diagrams, not decorative cards;
- read the page aloud and rewrite any sentence whose subject, action or result is unclear;
- verify every first-person experience against founder feedback or a first-party source.

Do not publish filler, doorway pages, fake FAQs, fabricated benchmarks, copied SERP text or AI-redrawn product UI.

### 4. Produce accessible review URLs

Localhost is internal verification only. Push the review branch and create a Vercel PR preview for every page. Verify the latest deployment is ready and that the supplied route resolves. If Vercel authentication blocks the founder, label the packet **BLOCKED: REVIEW ACCESS** rather than pretending the page was reviewed.

The morning packet must include one directly openable review URL per completed page. Label these **REVIEW**, never **LIVE / VERIFIED**. AWS remains production and is a separate approved deployment step.

### 5. Send the founder review packet

Use `templates/morning-seo-review.md`. The Telegram message itself stays within five short bullets and links to the durable packet when detail exceeds that limit.

For each page show:

- status and review URL;
- target query, audience intent and why this page now;
- what was written or changed;
- CodeSpring positioning and CTA;
- evidence/assets still needed;
- the exact founder decision or correction requested.

### 6. Assign one or two video briefs

Choose the pages where a founder video adds proof, trust or demonstration value. A video is optional; it must not delay pages that stand on their own.

Every video brief includes:

- working YouTube title and thumbnail promise;
- one-sentence hook;
- three teaching beats;
- exact screen/demo sequence;
- CodeSpring positioning and CTA;
- maximum build scope and estimated filming effort.

Keep demonstrations intentionally small. Default to no authentication, database, backend, payments, deployment or multi-user state. Prefer a single-screen utility, static interaction, local-data example, one workflow or a screen-led comparison. For comparisons, demonstrate current interfaces and decision criteria without inventing a benchmark or winner.

### 7. Produce thumbnails only after the angle is approved

After the page and video angle are accepted, create one or more thumbnail candidates. Use a short promise, one focal idea and authentic CodeSpring/product evidence where the claim needs it. Never redraw readable product UI or fabricate results. Deliver the thumbnail as a review asset, not as a published YouTube asset.

### 8. Publish only after approval

Apply founder feedback, rerun tests and refresh previews. Merge only the approved pages. AWS deployment, sitemap verification, Search Console indexing request and public URL checks remain separate explicit actions.

Track exact states:

`OPPORTUNITY → BRIEFED → REVIEW → REVISION → APPROVED → MERGED → AWAITING AWS DEPLOYMENT → LIVE / VERIFIED → 14/28/56-DAY REVIEW`

### 9. Hand off indexing after approval and production verification

Google can discover pages automatically through crawlable internal links and the XML sitemap, but discovery and indexing are not guaranteed. Do not request indexing while a page is only on Vercel or merely merged.

After Sebastian approves the page and the AWS production deployment is independently verified:

1. verify the public URL returns `200`, renders the approved content, uses the intended self-canonical and is not `noindex`;
2. verify the URL appears in `https://codespring.app/sitemap.xml` and has crawlable internal links from the relevant hub/related pages;
3. verify the sitemap is already submitted in the correct Search Console property; submit or refresh the sitemap only when needed rather than repeatedly every day;
4. for a small number of priority URLs, open URL Inspection in Search Console, test the live URL and use **Request indexing**;
5. record the request date and monitor the Page indexing/URL Inspection status—do not repeatedly resubmit the same URL;
6. report separately: `AWS LIVE / VERIFIED`, `SITEMAP VERIFIED`, `SEARCH CONSOLE REQUESTED`, and `INDEXED / VERIFIED`.

[Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) says crawling can take from a few days to a few weeks, individual URL requests have quotas, repeated requests do not make crawling faster, and a crawl request does not guarantee inclusion. For many URLs, the sitemap is the discovery mechanism; URL Inspection is for a small priority set.

The founder handoff must say exactly what happens next: approve revisions → merge → AWS deploy → production QA → sitemap/internal-link verification → Search Console request for priority URLs → monitor indexing and performance.

## Durable daily register

Keep one row per candidate/page with:

`date | source signal | query | country | intent | volume/date | difficulty | SERP shape | existing owner | lane | route | original evidence | CTA | branch | PR | review URL | status | video priority | video URL | thumbnail path | AWS status | live URL | Search Console request | 14/28/56-day outcome`

Use the register to prevent duplicate pages, lost review URLs and unmeasured publishing.

## Completion criteria

A morning run is complete only when:

- five evidence-backed opportunities are ranked;
- up to five complete pages have verified remote review URLs, with explicit reasons for every withheld slot;
- one or two video briefs are selected when video materially helps;
- no page is called published or live;
- the durable register and founder review packet are updated.
