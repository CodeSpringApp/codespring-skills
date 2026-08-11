---
name: cs-seo-website
description: "Use when growing CodeSpring site SEO, content, or listings."
version: 0.1.0
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

## 3. Content systems

### Tutorials and documentation

Use tutorials for problems the product demonstrably solves: planning an AI-built app, turning requirements into PRDs, project/task sequencing, importing a codebase, and connecting coding agents. Lead with the reader’s outcome, give a real walkthrough/example, then use a direct CodeSpring CTA.

Do not write generic AI filler or dozens of slight keyword variants. One high-quality tutorial with original examples and internal links beats a thin post farm.

### Vibe Code Library

Use the dedicated `feat/codespring-vibe-code-library` branch and strategy doc. An app page becomes indexable only when it has an original scoped verdict, realistic core loop, hard boundaries/exclusions, feature groups, original FAQs, sources/review date and meaningful related links. Draft pages stay out of the sitemap.

The library’s conversion asset is not a generic directory listing: it is an honest plan/prompt/map for building a scoped substitute, with a real CTA destination.

## 4. Listings and mentions

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

## 5. Review and release checklist

- [ ] Live and `origin/main` source inspected first.
- [ ] Search intent and original evidence exist for each indexable page.
- [ ] Canonical, title, description, server-rendered links and sitemap inclusion checked.
- [ ] New Vibe Code pages pass the content gate.
- [ ] Listing passes relevance/quality gate and has approval.
- [ ] Mobile/desktop and themes reviewed for UI changes.
- [ ] `npm run type-check` and `npm run build` pass.
- [ ] Branch pushed, remote SHA verified, draft PR targets `dev`.
- [ ] Report branch/PR/dev/production status separately.
