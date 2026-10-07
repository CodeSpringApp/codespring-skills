# Browser comment review
For batches, make the primary handoff an opened browser review page rather than a long text file. Use the user's chosen connected browser/profile. Keep reports/CSV as supporting records.

Create a campaign JSON outside the installed skill. It has `id` (stable campaign/batch identifier), `title`, and `items`. Each item needs string fields `id`, `title` (original post title), `url` (original HTTPS permalink), `community` (without r/), `summary` (short accurate paraphrase), and `draft` (complete reply). Optional string fields: `mention`, `checks` (specific unresolved posting checks), `evidence`, `limitation`. Do not describe a paraphrase as the original post. Generate with:

```sh
python3 scripts/build_review_queue.py /path/to/campaign/queue.json --out /path/to/campaign/review-queue.html
```

Open the result in the user's browser. A file URL works for offline review; localhost generally supports clipboard copying more reliably. If starting a local server, bind it to loopback, serve only the campaign directory and record how to reopen the saved HTML. Do not publish the review page or install a browser extension to deliver it.

After native composer preparation is verified, the optional top-level integer `native_tabs_prepared` adds session handoff instructions. Set it to the actual prepared count, never a planned target. Edits in the review page do not synchronize to native Reddit composers; make that clear in the handoff.

The included page shows one conversation beside an editable draft, queue navigation, copy/open-thread actions, local review decisions and export. Edits persist in that browser; export provides a file for later agent review. Keep/skip decisions are not publication permission. “I posted this myself” is the user's report, not a verified receipt. Opening, copying or filling a composer must never mark a reply published.

If the user wants native Reddit tabs with drafts ready for their own Post click, use supported browser controls to open the requested threads and fill their native comment composers. Verify the exact thread and visible draft, leave the actual submission to the user, and retain those tabs as the handoff. Work within the requested batch size; do not silently open an unbounded set of tabs. Preserve pre-existing text: skip a nonempty composer rather than overwriting it. If login, a closed thread, unavailable controls or access restrictions prevent this, retain the review page with copy/open controls and state the concrete limit. Do not invent a Reddit prefill URL, use a simulated Post button, or route around a login/CAPTCHA/block.

Before any agent-performed publication, apply the existing publication checks and actual authorization. For the manual review handoff, put unresolved rules/context/prior-contact checks beside the relevant draft so the owner can assess them before using Reddit's native Post button.

## Native editor formatting and owner activity
Check the rendered draft, not just the submitted string. In Reddit's rich-text composer, inserting plain text with two newlines can create an extra empty paragraph. Where available, switch to Markdown, enter the draft with one blank line between paragraphs, return to rich-text preview and verify paragraph spacing and exact wording. Use another supported editing method if the current UI differs; do not alter account-wide editor preferences.

A nonempty composer may contain owner edits; preserve it unless the owner asks to replace or replay that specific draft. Recheck the thread for an already published owner reply before filling an empty composer. Record an observed owner publication separately from agent publication and retain its permalink; do not create a duplicate, edit or delete the published comment without authorization.
