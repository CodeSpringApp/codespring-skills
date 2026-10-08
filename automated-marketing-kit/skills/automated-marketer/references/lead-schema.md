# Lead CSV and scorecard
Use UTF-8 CSV with the exact headers in `assets/leads.csv`. One public conversation per row, keyed by `thread_url`; normalize fragments/trailing slashes when deduplicating. Sample/example URLs are not eligible to publish. Keep observations short. Do not add private contact details.

| Field | Meaning |
|---|---|
| lead_id | Internal stable ID, e.g. L001; no username/email |
| thread_url | Original public permalink, not a search page |
| community | Community name |
| observed_at | ISO date when researched |
| thread_date | Source date, blank if unknown |
| problem_evidence | Short sourced paraphrase/limited excerpt |
| requested_help | The person's stated request |
| product_fit | Actual capability relevant to that request |
| limitation | Important mismatch or uncertainty |
| pain | Integer 0–3: absent; vague; concrete; concrete with consequence |
| intent | Integer 0–3: none; exploring; asking recommendations; explicit active search |
| fit | Integer 0–3: none; partial; core task; core task + required conditions met |
| freshness | Integer 0–2: stale/unknown; usable context; recent and still open |
| helpfulness | Integer 0–2: no useful answer; useful general answer; specific actionable answer |
| rules_status | allowed / disallowed / unknown for the proposed interaction |
| rules_url | Public rules link |
| rules_checked_at | ISO check date |
| thread_status | open / closed / unknown |
| already_contacted | yes / no / unknown |
| status | research / candidate / draft / approved / posted / skipped |
| draft | Proposed answer, never a posting instruction |
| published_url | Actual returned permalink, otherwise blank |
| outcome | Observed outcome, otherwise blank |

Raw score = pain + intent + fit + freshness + helpfulness (0–13). Suggested priority: high 10–13; medium 7–9; low 0–6. These are heuristics, not purchase probabilities.

Review drafts may be saved in `draft` with `status=draft` after the original post and relevant replies have been read, while publication checks remain unknown. Put unresolved checks in the card/outcome; do not mark unknown facts “allowed” or “no” to clear a gate. A missing posting approval or prior-contact check should not prevent useful local drafting. Known restrictions on the proposed content still require a compliant no-mention contribution or skip.

The offline helper's stricter `draft-ready` gate is a supplied-data preflight: real HTTPS thread URL (not example.com); all five scores present; nonempty evidence; `fit>=2`, `helpfulness>=1`, rules allowed with URL/check date, thread open, already_contacted no. A failed gate goes to hold/skip regardless of score, even if a review draft exists. Human review still determines relevance. `allowed` means the actual proposed interaction, not general permission to promote. Posting additionally requires user authorization and legitimate tool/account access.
