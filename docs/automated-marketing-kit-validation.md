# Automated Marketing Kit validation — 2026-10-07

## Classification and layout

Marketing owns the outcome: product understanding, positioning, community discovery and a reviewed reply queue. This is an import of the existing six-skill purchaser bundle, retaining its established skill names. It is not a rename of the flat CodeSpring skills or a set of new per-action skills.

The folder `automated-marketing-kit/` contains the complete bundle. The normal root installer discovers the flat CodeSpring skills and does not discover this separate folder. A disposable fixture containing a normal `skills/<skill>/SKILL.md` and the nested bundle returned only the normal skill. Pointing the installer directly at the kit returned all six marketing skills. No `--full-depth` requirement is hidden from customers.

## Checks performed

Environment: Node 24.13.0, installed `skills` CLI 1.7.0, Python 3. The exact executable from that installed npm package was used; no global skill installation or browser extension was added.

```sh
# Discovery, from the repository checkout
skills add ./automated-marketing-kit --list

# Installation, from a disposable project directory
skills add /path/to/codespring-skills/automated-marketing-kit --agent codex --skill '*' --copy -y

# Rebuild, from the repository checkout
python3 automated-marketing-kit/scripts/build_uploads.py
```

- The six imported kit skill frontmatters passed the skill-creator validator. Existing CodeSpring skills were left unchanged in this release.
- Six kit skills were discovered and installed. Every installed source, reference, asset and helper matched the bundle byte-for-byte.
- All 55 manifest entries passed file-size and SHA-256 checks. The manifest itself makes the bundle 56 files.
- All six individual upload ZIPs matched their standalone skill folders, including references and helpers.
- Rebuilding uploads and the manifest twice produced identical bytes.
- All kit relative Markdown links resolved. The purchaser delivery archive matched the GitHub bundle and manifest.
- Both review-page helper entrypoints rendered the existing nine-item campaign queue into a temporary HTML output. The campaign data and generated review page are not included in this repository.
- The campaign helper's rank/UTM commands were inspected through their CLI help. The purchaser fulfilment suite passed all nine tests after rebuilding delivery assets in the source application.
- `git diff --check` passed.

## Practical evidence and limits

The integrated kit was exercised on CodeSpring: public product facts, community discovery, original posts and existing comments, individual draft review, and native Reddit draft preparation. A Markdown-to-rich-text preview produced four normal paragraphs with zero empty blocks in the demonstrated response. Replaying typing preserved the exact unposted draft. These observations justify dogfooding status, not proven customer acquisition or agent publication.

Standalone research and positioning specialists remain draft pending independent reruns. Browser profile selection does not establish window placement or cursor animation; demo instructions now require an actual visible test and an explicit limitation when window selection is unavailable. No video-recording capability has been added.

Release scope: only the Automated Marketing Kit bundle and its catalog/setup documentation. Other CodeSpring skills are unchanged. The source is the owner-provided Downloads bundle, verified byte-for-byte against the funnel resource copy on 8 October 2026.
