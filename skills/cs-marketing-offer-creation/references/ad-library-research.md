# Meta Ad Library research

Use this route only when competitor paid-ad evidence can resolve an offer
decision. It is not a substitute for current customer language or product truth.

## Free browser route

Open `facebook.com/ads/library` with the relevant country and status. Search
exact brand/signature phrases and a small set of unordered buyer terms. Record
the query, country, date and sampling limits.

Useful visible fields include the Library ID, start date, advertiser,
`N ads use this creative`, media type and display domain. Destination URLs may
be present in Meta redirect links in the page DOM. Pagination may require the
“See more” control.

## Paid extraction route

Use an available scraper only with permission when it consumes credits. Read
the current tool schema before calling it, page large datasets, and retain the
query and run/dataset identifier so the result is reproducible.

## Read the signals conservatively

- Creative duplication suggests the operator expanded distribution of a
  creative; it does not independently prove profit.
- Long-running active ads provide a stronger survival signal than a large burst
  of recent tests, but start dates can reset after material edits.
- Many inactive ads can indicate abandoned testing, yet the library does not
  explain why an ad stopped.
- Ad counts are not spend, conversion rate or acquisition cost.
- Search results are sampled and can vary by query, country and sorting.

Treat these as comparative signals. Avoid absolute claims such as “the only free
profitability signal” or “nobody duplicates unless it won.”

## Inspect the destination

For shortlisted offers, capture the visible page truth: headline, subheadline,
bullets, CTA, form fields, price, guarantee, urgency/date language and proof
claims. Record the front-end format, product sold, price ladder when visible,
days live, duplication and format mix. Use a browser when the page is
JavaScript-rendered or blocks normal fetching.

Quote only what is needed for evidence and attribution. Do not copy competitor
copy into production.

## Research output

Include:

- Query strings, country, dates and status filters.
- Operators and offers reviewed.
- Active/inactive counts, oldest visible start date and duplication observations.
- At least one inspected destination for each shortlisted offer when accessible.
- The exact offer decision the research supports.
- Coverage gaps and why the signal is directional rather than performance proof.
