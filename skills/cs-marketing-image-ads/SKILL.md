---
name: cs-marketing-image-ads
description: >
  Create and revise static paid-social image ads from an offer, customer pain,
  brand assets and visual references. Use for Facebook/Instagram image ads,
  campaign creative batches and edits to existing ad images. Delivers reviewed
  image files and a copy/reference manifest; does not launch campaigns.
---

# Image ads people can understand in one glance

## Outcome and scope

Turn an existing offer into usable image ads with a clear hook, an image that
demonstrates it, and the correct next action. This marketing capability owns
the finished creative files. Offer strategy belongs to
`cs-marketing-offer-creation`; website changes belong to `cs-marketing-website`.
Do not require either workflow just to revise a supplied ad.

**Maturity: draft.** Derived from repeated CodeSpring creative reviews; this
packaged skill has not yet been independently run on a new campaign.

## Start from the campaign

Recover the following from the current request and prior decisions. Ask only
when missing information materially changes the result:

- Audience and awareness: what are they already trying, what goes wrong, and
  what would make this ad feel specifically for them?
- Destination and actual offer: free class, paid case study, trial, product or
  call; approved price, promise, CTA and supporting proof.
- Current selected images, revisions to keep, visual references, brand assets,
  face references, requested quantity, format and destination folder.

When the user asks for new ads for a working funnel, preserve the funnel and
its offer. A free-class ad sells what the viewer will learn. A paid case-study
ad sells access to that case study. Do not imply that the front-end purchase
includes a licence, implementation or a guaranteed commercial result.

Inspect a supplied landing page if its contents are unknown. Use available
customer material or memory when requested or useful; distinguish prospect
language from the seller's theory. Do not claim to have reviewed calls you
have not read. Detailed copy and visual examples are in
[creative decisions](references/creative-decisions.md).

## Make the message concrete

Choose one main idea per ad. Usually it needs only:

1. A specific pain or desired outcome in the headline.
2. An optional short line explaining what the offer teaches or delivers.
3. One clear CTA consistent with the destination.

For problem-aware buyers, name the recognisable incident: a fix breaks another
feature, a working agent needs rebuilding for the next client, or the same
requirements must be explained again. Then state the relevant lesson or
deliverable. Generic process language such as “learn a structured system” is
weak unless the viewer can see the result it helps them achieve.

Use the user's selected wording verbatim when requested. Do not silently
improve approved copy during generation. If copy approval was requested before
image creation, return copy first; otherwise proceed within the supplied brief.
Follow the user's punctuation preferences, including no em dashes or full stops
where specified.

Numbers must have a role and a source. Keep user-reported results attributed
in the working brief; never convert them into independently verified results.
Do not turn SaaS revenue into agency profit or a hypothetical target into a
past achievement. A user-reported winning ad is a useful reference, not proof
that the new variant will win. Never invent urgency, customer proof or refunds.

## Design the visual around the hook

Inspect the actual image references before prompting. Give each input one role:
edit target, identity reference, style reference, real screenshot or logo.
Use current explicit user direction ahead of earlier preferences or repository
CSS. A website's palette does not automatically define a campaign's ad style.
Do not hardcode CodeSpring green, red/orange or any other palette into every job.

Write a one-sentence visual explanation before generating: “The repeated chat
messages show the founder having to explain the same feature again.” If the
image does not explain the headline without narration, change the concept.

- Prefer one dominant visual with readable headline and CTA at phone-feed size.
- A supplied winning ad can guide hierarchy, contrast, typography and density;
  adapt the offer and proof to this campaign.
- Match a requested continuous poster: put text directly on the image. Do not
  add white footer boxes, cards, pills, badges or decorative circles by habit.
  Preserve such elements only when requested or supported by the selected reference.
- Show the relevant software action. Use a supplied real screenshot when asked.
  Do not substitute a made-up branded interface and describe it as authentic.
  If an illustrative screen is appropriate, keep it plausible and simple.
- For AI-building ads, show a recognisable agent workspace with brief tasks,
  conversation or a product preview. Dense code is appropriate only if it helps
  this audience. A large error state can communicate failure better than many
  illegible panels. A branded screenshot must not imply vendor endorsement.
- Preserve the face reference and natural skin colour. Check the whole body:
  arm continuity, hand count, fingers and where each hand connects. Repeating
  “correct anatomy” in a prompt is not a substitute for inspecting the result.
- Make batch concepts materially different in composition or scene, not merely
  different colours around the same portrait. Keep the offer consistent.

## Generate or edit

Use the environment's image-generation capability and follow its generation
skill when available. On Codex, prefer built-in `imagegen`; do not silently
switch to a paid API or claim a particular model version without tool evidence.
If generation is unavailable, report that boundary instead of claiming files
are being created. The workflow remains usable in other runtimes with equivalent
image tools.

For each image, specify exact text, input roles, aspect ratio, composition,
palette, visual action, and important exclusions. For an edit, name exactly what
changes and what must remain. Read local image targets with an image viewer
before editing. Produce separate outputs for separate concepts.

Default Facebook/Instagram feed creative to portrait 4:5 when no format is given;
match existing campaign dimensions when available. Verify actual pixel dimensions
and any small ratio rounding rather than relying on the requested format.

Revise only the ads the user identified. Keep accepted images intact. If the user
deleted old versions, work from the files that still exist and do not recreate
deleted alternatives unless requested. Save new versions without overwriting
originals unless replacement is authorised. Never assume a background agent is
still running; verify actual task state before reporting progress.

## Review before delivery

Open every output at full resolution and at approximately phone-feed width
(roughly 300–400 px); a 120 px preview can additionally test the main hook.
Check:

- Exact headline, supporting text, price and CTA, including spelling and line breaks.
- Face identity, natural skin, anatomy, and realistic object/screen placement.
- The image demonstrates the promised pain or result; UI detail is useful and readable.
- Contrast, crop safety, typography and absence of unwanted branding or layout elements.
- Correct funnel, offer, evidence and requested edit scope.

Make targeted corrections for visible defects, then inspect the corrected file.
Do not declare anatomy, mobile readability or screen authenticity verified without
actually checking them. Scope changes and contradictory preferences should follow
the latest explicit user instruction.

## Save and hand off

Copy final files to the requested directory, using versioned names during
iteration. When the user asks to number a set, inspect the folder first and rename
only the exact selected files without collisions. A useful final naming scheme is
`<Campaign> Image Ad 1.png`, `... 2.png`, and so on.

Maintain one concise manifest alongside the working assets or in the campaign
workspace. Record filename, exact copy, prompt, input roles/source paths,
generation method, dimensions, revision/selection state and checks actually done.
Use relative paths in a portable handoff. Do not embed private customer records,
credentials or personal photos in the reusable skill repository.

Report the saved file links, the material changes and any unresolved limitation.
Use `DRAFT` for unreviewed concepts, `IN PROGRESS` during generation, `READY` for
reviewed saved assets, `AWAITING APPROVAL` only for an actual pending approval,
and `BLOCKED` for an unavailable required input/tool. Use `LIVE / VERIFIED` only
after authorised publication and verification. READY does not mean performance
proven or uploaded to an ad account.

**Approval boundaries:** a request to create/revise ads authorises the scoped
creative files and normal review. It does not authorise ad spend, publication,
messages to others, changing a funnel, deleting unrelated files or new customer
guarantees. Continue under existing authorisation rather than repeatedly asking.

**Next step:** hand the files and manifest to the user or their authorised campaign
workflow. If requested later, compare creative IDs against actual registrations,
buyers and spend. Do not infer profitability from aesthetics, public duplication
or a low click cost alone.
