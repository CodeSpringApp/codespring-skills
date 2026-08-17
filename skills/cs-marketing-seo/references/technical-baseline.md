# Technical SEO baseline evidence

Inspect the **production** URL and source repository. Record the command, URL, timestamp, result and owner for remediation. A local build verifies generation only; it does not verify deploy, redirects, headers or indexation.

## Required checks

| Check | Evidence to record | Pass condition |
| --- | --- | --- |
| Canonical host | both host response chains | one HTTPS canonical host; alternate host redirects intentionally |
| `robots.txt` | public response/status/content | crawl policy is intentional; sitemap declared |
| `sitemap.xml` | public response plus sampled URLs | contains complete canonical indexable URLs only |
| Indexable page | rendered title, H1, canonical, robots | matches page intent and declared indexation state |
| Duplicate/utility pages | route inventory and robots | explicit `noindex`, redirect or retirement decision |
| Internal links | rendered page/path inspection | relevant hubs, product pages and sibling pages can be reached |
| Structured data | rendered visible-content comparison | schema matches visible content; no invented FAQs/reviews/offers |
| Deployment | public URL after deploy | current source change is actually reachable |

## Remediation order

1. accidental noindex/robots/canonical/sitemap failures;
2. duplicate routes and broken internal conversion links;
3. missing title/H1/description on high-value pages;
4. performance/accessibility problems that prevent use or rendering;
5. enhancement schema only when the visible page already supports it.

## Static-site caution

Application source can generate metadata, robots and sitemap files, but host redirects, caching/CDN behavior and deploy configuration can sit outside the application. Mark those as `AWAITING APPROVAL` or `BLOCKED` with the infrastructure owner; do not imply a code commit fixed them.
