# Tracking plan
Choose a campaign slug, e.g. `invoice-approvals-oct26`. Use:
- utm_source=reddit (or the actual source)
- utm_medium=community
- utm_campaign=your-campaign-slug
- utm_content=L001 (internal conversation ID)

Do not place usernames, emails, private facts or sensitive information in URLs. Make one link per permitted conversation. Keep the original landing URL, tracked URL and published permalink separate. Shorteners do not make a prohibited promotional link acceptable. If the community rejects tracked links, obey its rules.

The helper lives at `skills/automated-marketer/scripts/campaign_tools.py`:
```sh
python3 skills/automated-marketer/scripts/campaign_tools.py utm 'https://your-product.example/signup' --source reddit --campaign invoice-approvals-oct26 --content L001
python3 skills/automated-marketer/scripts/campaign_tools.py rank templates/leads.csv --out ranked-leads.csv
```
Replace the example destination with your real public URL. Python 3 is required. No packages, network access, API keys or private data are needed. The rank command refuses to overwrite an existing output file; choose a new name or intentionally remove the old file yourself.

Before a real campaign, test a visit with a test campaign tag and check your analytics sees it. This pack does not install analytics. Record visits, signups and paid conversions from actual sources. Unknown values stay unknown.
