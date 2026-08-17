---
name: cs-marketing-website
description: Use when an app needs its marketing pages set up and organised. Builds the site architecture, page inventory, proof map, conversion paths, and a founder-facing NOW/NEXT/LATER workboard.
metadata:
  author: codespring
  version: "0.1"
---

# Website foundation for an app

Use this skill when a founder has a finished or credible product but cannot reliably remember what each website page is for, what to build next or which marketing work is blocked. This is the coordinating marketing skill. It turns a scattered site and a list of ideas into a maintained page inventory and a dependency-aware workboard.

Do not use it to publish content, make a production change, spend on ads or claim a page is live. Those actions require the appropriate follow-on skill and approval.

## Required inputs

Collect or explicitly mark missing:

- product, buyer and job to be done;
- primary conversion action and destination;
- current production URL and source repository, if available;
- approved proof: customer outcomes, screenshots, product demos, reviews or source data;
- analytics and Search Console access status;
- founder availability, decision owner and review cadence.

If the live site or repository is unavailable, create a **DRAFT** inventory from supplied information and record the blocker. Do not infer technical state.

## Step 1: inspect, inventory, and organise the site

Inspect the actual website, routes, navigation, sitemap and conversion paths. Use `templates/page-inventory.csv` to record each existing and needed page.

For every page capture: URL, page home, parent route, navigation label, page type, audience, job to be done, primary CTA, proof, indexation state, owner, status, dependency, success metric, next action and review date.

Use these page homes by default:

| Page purpose | Home |
| --- | --- |
| Product/category or use-case conversion | product, solution or use-case page |
| Evergreen how-to answer | `/resources/guides/[slug]` |
| Tool/approach decision | `/resources/comparisons/[slug]` |
| Useful template, checklist or generator | `/resources/tools/[slug]` |
| Approved customer evidence | `/resources/stories/[slug]` |
| Company updates and launches | `/blog/[slug]` |
| Product help | `/docs/[slug]` |

A page must have one primary job. If it has several, split it or state the priority.

### Required page architecture

Before adding pages, define a compact hierarchy. Start with only the lanes the product can genuinely support:

```text
/                         # home: category, buyer, promise, primary CTA
/product or /solutions    # product/use-case conversion pages
/pricing                  # packaging and purchase path, if public
/resources                # resource hub; not a dumping ground
  /guides                 # evergreen how-to answers
  /comparisons            # decision pages
  /tools                  # useful templates, checklists, or generators
  /stories                # approved customer evidence
/docs                     # product help, not acquisition content
/blog                     # announcements and time-bound updates
```

- Keep navigation to a small set of buyer-relevant top-level destinations. A resource subtype belongs in its own hub and is linked from the relevant product page; do not make every article a top-nav item.
- A planned page gets a parent/home before it gets a slug. Do not create duplicate guides, comparisons, blog posts, and docs pages that answer the same job.
- A resource lane stays out of the sitemap and is `noindex` until it has a useful hub and at least one complete, original page. Retired or duplicate pages need an explicit redirect/noindex decision.
- Use `templates/page-brief.md` for every new material page before writing or building it.

**Done when:** the inventory covers every route that matters to a buyer, customer or crawler; every page has a page home and primary job; and missing pages are ordered on the workboard rather than created ad hoc.

## Step 2: establish truth and proof

Write the product truth in `templates/website-context.md`:

- audience, problem and category;
- promise that can actually be supported;
- what the product does not do;
- approved proof and evidence gaps;
- conversion action and objection each page must address.

Mark any unapproved customer name, quote, metric or screenshot as **BLOCKED/AWAITING APPROVAL**. Never turn an anecdote into public proof.

**Done when:** every planned page can point to a source of truth or is explicitly marked as research-needed.

## Step 3: create the workboard

Sort the inventory into `templates/website-workboard.md`:

- **NOW**: the smallest set of unblocked actions that improves a broken conversion path, missing essential product page or high-intent question.
- **NEXT**: work that becomes useful once NOW is complete.
- **LATER**: worthwhile but not currently limiting growth.
- **BLOCKED/AWAITING APPROVAL**: work waiting on a founder, customer consent, access, copy approval, production deploy or evidence.

Every item requires an owner, concrete next action, dependency and evidence of done. Do not add vague cards such as "improve SEO".

**Done when:** the founder can ask "what should we do this week?" and receive one clear NOW item plus the blocker or approval needed.

## Step 4: establish the durable marketing system

Create or confirm these records in the client repository or operating workspace:

1. page inventory;
2. marketing context brief;
3. NOW/NEXT/LATER/BLOCKED workboard;
4. content register for planned Resources pages;
5. customer-story pipeline with consent and approval tracking;
6. weekly and monthly review cadence.

Use `references/status-language.md` exactly. A committed or locally built page is not LIVE.

## Handoffs

- Technical crawlability, canonical, sitemap and Search Console setup → `cs-marketing-seo`.
- Answer-led, source-backed Resources content → `cs-marketing-aeo-content`.
- Recurring briefs, publishing, review and founder updates → `cs-marketing-content`.
- Customer interviews and approved story production → `cs-marketing-content` until a dedicated story/video skill is proven.

## Common mistakes

1. **Treating the blog as the entire website.** Product, resource, story and docs pages serve different jobs.
2. **Publishing empty resource lanes.** Keep them noindex until there is useful, complete material.
3. **Planning without an owner or review date.** It becomes an archive, not an operating system.
4. **Confusing local completion with live.** Require public URL verification after deployment.
5. **Inventing proof.** Unapproved claims destroy the trust the system is meant to build.

## Verification checklist

- [ ] Page inventory has a row for every material route and needed page.
- [ ] Every row has a page home, job, audience, CTA, owner, status and next action.
- [ ] Every material new page has a page brief, parent route, indexation decision, and a place in the navigation/internal-link plan.
- [ ] Product truth and approved proof are separated from research gaps.
- [ ] Workboard has NOW, NEXT, LATER and BLOCKED sections.
- [ ] The highest-priority NOW item has its dependencies and approval boundary stated.
- [ ] Next weekly check-in and monthly review dates are recorded.
