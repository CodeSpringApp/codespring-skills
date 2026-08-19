---
name: cs-seo-website
description: "Use when growing CodeSpring site SEO, content, or listings."
version: 0.5.0
author: CodeSpring
metadata:
  tags: [codespring, seo, marketing-site, search-console, content, link-building]
---

# CodeSpring website SEO operator

Use for CodeSpring marketing-site work: robots/sitemaps/canonicals, Search Console exports, docs/tutorials, the Vibe Code Library, product listings, referral links and organic-growth reporting.

This skill covers **the CodeSpring website repo** (`VolkisAI/codespring-webinar`), not CodeSpring customer projects. Its goal is qualified organic traffic and conversions, not a vanity Domain Rating (DR) target.

## Operating principle

A third-party authority metric can be a diagnostic, but it does not itself make pages rank. Prioritise in this order:

1. pages Google can crawl, index and understand;
2. pages that satisfy a real search intent better than existing results;
3. topical internal links and a clear conversion path;
4. genuine mentions, reviews, integrations and editorial references;
5. measurement of non-branded impressions, qualified visits and sign-ups.

Never promise a DR/ranking result or buy/mass-submit links designed chiefly to manipulate rankings. A `nofollow` mention can still be valuable when it drives the right people.

## Branch and release model

Read the website repository `AGENTS.md` first. It is the operating contract and wins over this skill.

- `main`: live branch and the only branch permitted to change shared SEO files such as `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`, `lib/site-links.ts`, `templates/` and `docs/*.md`.
- `blog`: only `app/blog/**`, `content/blog/**` and `public/blog/**`.
- `library`: only Vibe Code Library-owned paths.
- `docs`: only docs route/component paths.
- `marketing`: only marketing-owned paths.

Never recreate `dev`, never use an ad hoc `fix/seo-*` branch in the website repository, and never commit or push directly to `main`. Each area branch is cut from `origin/main`, keeps one draft PR into `main`, and begins every session by merging `origin/main` before any edits. A required shared SEO change is a separate, small main-only PR for human review.

```bash
git fetch origin --prune
git switch blog  # or library, docs or marketing
git merge origin/main
git status --short --branch
```

For a new area branch that does not yet exist, create it from `origin/main` exactly as `AGENTS.md` instructs. Run `npx tsc --noEmit`, `rm -rf .next out && npm run build` and `node --test tests/*.mjs`; if an unchanged baseline test fails, report it exactly and do not claim the full suite passed. Push and verify the remote SHA before reporting completion.

## 1. Technical SEO baseline

Before creating content or seeking listings, inspect the live route **and** implementation on `origin/main`:

- one canonical host, with the other host permanently redirected at CDN/hosting level;
- valid `200 text/plain` `/robots.txt` with a sitemap declaration;
- valid `200 XML` `/sitemap.xml` containing only canonical, intentionally indexable URLs;
- server-rendered titles, meta descriptions, canonical URLs and meaningful body content;
- intentional `noindex` for conversion-only, preview, account and duplicate routes;
- internal links crawlers can follow without JavaScript;
- accurate, visible-only structured data where applicable;
- Search Console domain property, sitemap submitted, URL Inspection checked.

For static Next.js exports, `app/robots.ts` and `app/sitemap.ts` generate the public files. A host redirect cannot be solved in Next.js source alone when S3/CloudFront serves static files; document and apply it at the delivery layer.

Acceptance test after a production deployment:

```bash
curl -sSIL https://codespring.app/
curl -sSIL https://www.codespring.app/     # expect 301 to the matching bare-host URL
curl -sSI https://codespring.app/robots.txt
curl -sSI https://codespring.app/sitemap.xml
curl -sS https://codespring.app/robots.txt
curl -sS https://codespring.app/sitemap.xml
```

## 2. Search Console → content loop

Treat the Search Console query export as the backlog source. Do not choose page topics from generic keyword lists alone.

1. Ingest the export and retain columns for query, page, clicks, impressions, CTR, average position, country and date range.
2. Cluster queries by intent: brand, comparison, tutorial/problem, product/category, and support/docs.
3. Prioritise terms with either:
   - meaningful impressions and weak CTR/position; or
   - clear commercial/problem intent matching CodeSpring’s product; or
   - an existing page with a credible chance to be improved.
4. For every page brief define: target intent, reader’s job, unique evidence/example, title, H1, outline, internal links, CTA, schema decision and success metric.
5. Publish, request indexing only when the page is genuinely ready, then review at 14/28/56 days. Improve pages based on impressions, CTR and conversion—not publication count.

Monthly scoreboard:

`non-branded impressions | non-branded clicks | top-20 queries | indexed URLs | qualified organic sessions | organic sign-ups | referring domains | referral sign-ups`.

## 3. Proactive daily content desk

Run a founder-reviewable SEO desk at the start of each working day. The target output is **five distinct, fully written review pages**, not five briefs and never five automatically published URLs. Every page must independently have distinct intent, original value, demand evidence, no cannibalisation and a credible conversion path. If only three or four pages can honestly pass those gates, deliver those complete pages and explain why the remaining slots were withheld. This protects CodeSpring from scaled-content and doorway-page behavior while still creating a fast production rhythm.

Use Search Console first, the cached monthly DataForSEO dataset second and live SERPs only for the short list. Treat Instagram, TikTok, YouTube and sales calls as qualitative sources for language, questions and objections—not as automatic one-video-per-landing-page instructions. Improve an existing canonical page whenever it already owns the intent.

Each morning:

1. rank five opportunities across commercial comparisons, problem-led guides, useful tools/templates, canonical-page refreshes and proof/docs/story work;
2. build up to five complete, readable pages; withhold any slot that cannot pass the evidence and content gates;
3. push a review branch and provide one verified, directly openable Vercel route per page—never localhost;
4. send Sebastian a compact review packet with the target query, SERP gap, original value, CodeSpring position, CTA and one exact decision needed;
5. select one or two pages where a founder YouTube video materially adds proof or teaching value;
6. keep video demos simple by default: no authentication, database, backend, payments or deployment; use a single-screen utility, local-data interaction, one workflow or a current-interface comparison;
7. create thumbnail candidates only after the page and video angle are approved;
8. apply feedback, refresh previews and merge only with explicit approval; keep AWS production deployment separate.

Track every opportunity and page through:

`OPPORTUNITY → BRIEFED → REVIEW → REVISION → APPROVED → MERGED → AWAITING AWS DEPLOYMENT → LIVE / VERIFIED → 14/28/56-DAY REVIEW`.

The morning run is incomplete without remote review URLs or explicit access blockers. Never call a Vercel preview published or live. Never let a page quota override distinct intent, usefulness, original evidence or quality.

Use `references/daily-seo-content-desk.md` for the full selection, build, video, indexing and measurement workflow. Write the daily artifact with `templates/morning-seo-review.md`.

## 4. Content systems

### Tutorials and documentation

Use tutorials for problems the product demonstrably solves: planning an AI-built app, turning requirements into PRDs, project/task sequencing, importing a codebase, and connecting coding agents. Lead with the reader’s outcome, give a real walkthrough/example, then use a direct CodeSpring CTA.

Do not write generic AI filler or dozens of slight keyword variants. One high-quality tutorial with original examples and internal links beats a thin post farm.

#### Write for beginners without flattening the meaning

Plain English does not mean chopping every thought into the fewest possible words. Sentence length and reading-grade scores are checks, not quotas. Keep enough context for the reader to understand what changed, what broke and why the lesson matters.

- Prefer ordinary language: say a feature is `done`, not that somebody can `call it finished`.
- Keep the subject, action and result clear. Avoid compressed lines such as `The main screen worked. The blank form, failed save or next step did not.` Rewrite the full causal example.
- Do not concatenate several states into one sentence merely to reduce word count. If three or more checks sit at the same level, introduce them and use bullets.
- Use a real sequence: what was built, what initially worked, what changed later, what broke, and which acceptance check or test would catch the regression.
- For example, explain that a CSV upload worked, a later data-processing change broke the upload, and the original upload tests should still pass after the new work.
- Use paragraphs for explanation and bullets for parallel checks, edge cases, steps or outcomes. A long wall of prose is not beginner friendly.
- Read the copy aloud. If a sentence is grammatically short but hard to understand without guessing the missing connection, rewrite it rather than shortening it further.
- First-person founder lessons must come from Sebastian's feedback, first-party videos, call transcripts or recorded CodeSpring experience. Never invent the experience to make a page sound personal.

### Editorial comparison and guide pages

Treat a comparison page as an editorial article, not a landing-page feature grid.

1. **Read the live SERP examples first.** Inspect the strongest ranking pages for structure, reader questions and missing evidence. Learn from them without copying text, images or unsupported claims.
2. **Start with the reader.** Open with the situation, problem and decision they are trying to make. Do not introduce CodeSpring before answering the comparison intent.
3. **Use article anatomy.** Include a visible founder byline/photo when Sebastian is the author, an updated date, reading time and linked chapter navigation for long pages.
4. **Give each compared product its own section.** Explain what Claude Code, Codex, Cursor or another product does well, who it suits and what context it still needs. Put CodeSpring in its own later section, then summarise the choice in a fair table or decision path.
5. **Use real visuals, not decorative substitutes.** For every third-party product, use a current screenshot captured from that product's first-party public product page or documentation. Store the optimised image locally, record the source URL/date, add meaningful alt text and link the caption to the official source. Never use search-result thumbnails, AI-redrawn interfaces or generic text-block diagrams when an authentic UI view is available.
6. **Reuse real CodeSpring product assets.** Inspect the current homepage and `public/` library before inventing a diagram. Prefer the real mind map, generated PRD, journey/map or Kanban board screenshots already approved on the site. Replace placeholder architecture blocks with the relevant product UI.
7. **Make comparison tables scannable.** Pair each product name with its official/approved logo at a consistent size. Keep supporting copy slightly smaller than article body copy and present each cell as a short bullet-style point rather than a dense paragraph. Logos identify products; they do not imply endorsement.
8. **Build a visible internal-link map.** Link CodeSpring mentions to the homepage where the reader needs the product definition. Link topical phrases such as mind map, PRDs and Kanban board to their specific documentation pages. Links must look like links without requiring hover: use an accessible contrasting colour and underline, then verify every destination. Keep the final CTA direct. Link third-party screenshot captions and sources to their first-party pages.
9. **Keep evidence honest.** Do not claim hands-on benchmark results unless the same task, environment and review method were documented. State when a page is a decision guide rather than a performance benchmark.
10. **Verify the whole article.** Confirm screenshots load at natural dimensions, logos are legible, chapter anchors work, mobile/desktop layouts remain readable, metadata/canonical/schema are correct and every claim has visible support.

For review, a Vercel PR preview is acceptable when it is actually accessible to the reviewer. Production remains the manual AWS workflow. Label the preview `REVIEW`, not `LIVE / VERIFIED`, and never imply that a Vercel preview changed AWS production.

### Vibe Code Library

Use the dedicated `feat/codespring-vibe-code-library` branch and strategy doc. An app page becomes indexable only when it has an original scoped verdict, realistic core loop, hard boundaries/exclusions, feature groups, original FAQs, sources/review date and meaningful related links. Draft pages stay out of the sitemap.

The library’s conversion asset is not a generic directory listing: it is an honest plan/prompt/map for building a scoped substitute, with a real CTA destination.

## 5. Listings and mentions

Create one product-profile packet before using any directory:

- product name and canonical URL;
- 60-word and 160-character descriptions;
- positioning/category;
- logo, screenshots and approved demo link;
- pricing/support/founder details that are true at submission time;
- UTM-tagged referral URL;
- owner, approval status and source evidence.

### Qualification gate

Use a listing only if at least one is true:

- it reaches a relevant buyer/developer community;
- it is a truthful review/integration/partner profile;
- it can create editorial discovery or referral traffic;
- it is a product launch with a real community response.

Reject sites whose primary offer is selling “dofollow backlinks,” bulk link exchanges, spun descriptions or a large batch of low-quality submissions. Never create accounts, pay for placements, publish claims, or solicit reviews without approval and company-controlled credentials.

Track every prospect in a ledger:

`source | relevance | reason | proposed URL | rel | cost | owner | approval | submitted | live listing | referral sessions | sign-ups | review date`.

Status labels are exact: **DRAFT**, **AWAITING APPROVAL**, **SUBMITTED**, **LIVE**, or **REJECTED**. Do not call a submission a live backlink until the public listing and outbound link are verified.

## 6. Review and release checklist

- [ ] Live and `origin/main` source inspected first.
- [ ] Search intent and original evidence exist for each indexable page.
- [ ] Daily desk targets five fully written review pages; every page independently passes the no-cannibalisation and original-value gates, and withheld slots have an explicit reason.
- [ ] Every completed morning page has a directly openable, verified Vercel review route and one precise founder decision request.
- [ ] Video briefs are limited to one or two high-value pages, use deliberately simple scope and do not block page review.
- [ ] Canonical, title, description, server-rendered links and sitemap inclusion checked.
- [ ] New Vibe Code pages pass the content gate.
- [ ] Listing passes relevance/quality gate and has approval.
- [ ] Editorial pages use article anatomy, first-party screenshots, approved logos, image provenance and real CodeSpring product assets.
- [ ] Comparison tables are compact and scannable; internal links are visible without hover and point to the relevant homepage or documentation route.
- [ ] Mobile/desktop and themes reviewed for UI changes.
- [ ] `npx tsc --noEmit`, `npm run build` and `node --test tests/*.mjs` pass, or unchanged baseline failures are reported exactly.
- [ ] Branch pushed, remote SHA verified and draft PR targets `main`.
- [ ] Report review preview and AWS production status separately.
- [ ] After approval and AWS verification, provide the sitemap/internal-link/Search Console indexing handoff; never imply a crawl request guarantees indexing.
