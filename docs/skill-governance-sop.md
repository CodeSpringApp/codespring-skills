# Skill governance SOP

## Goal

Build a coherent skill system that lets an agent eventually research, plan, build, launch, secure, market, and operate a software company. This SOP prevents reactive, duplicate, and unfindable skills.

It is for people and agents adding or changing skills in this repository.

## 1. The classification gate — before writing anything

Every request must be classified before a new `SKILL.md` is created.

| Question | Decision |
|---|---|
| What business outcome is being achieved? | Name the outcome, not the tool or action. |
| Which lifecycle family owns it? | Use the map below. |
| Does an existing skill already own the trigger? | Extend it unless the work has a different approval boundary or output artifact. |
| Is it dogfooded? | If no, label it `draft`; do not present it as proven automation. |
| What can it change externally? | State approvals for credentials, spend, publication, production, customer data, and legal/product claims. |
| How is success proven? | Name the file, URL, test, screenshot, identifier, or measured result. |

If the agent cannot answer these questions, it must create a proposal in the relevant workboard or ask for the missing business decision. It must not add a vague skill.

## 2. Lifecycle map and naming

All new installable skills use this form:

```text
cs-<family>-<outcome>
```

| Family | Owns | Examples |
|---|---|---|
| `marketing` | market demand, ICP, alternatives, positioning, offer, website, SEO, AEO, content, carousels, video | `cs-marketing-research` |
| `build` | implementation and code-quality execution | `cs-build-feature` |
| `agent` | CodeSpring Agents setup, capability wiring, channels, runtime verification and agent operations | `cs-agent-setup` |
| `release` | deployment, security, observability, production verification | `cs-release-security-audit` |
| `operate` | customer success, metrics, renewals, recurring operations | `cs-operate-renewals` |

Use a durable, clear outcome after the family. Good: `cs-marketing-website`, `cs-build-create-tasks`. Avoid vague names such as `cs-helper`.

### Current transition

Existing flat names remain supported. Do not rename or move them one by one. A future migration must update all references, the installer test, documentation, and any customer installation guidance as one versioned change.

## 3. Physical repository layout

Keep the **published install surface flat today**:

```text
skills/
  cs-marketing-seo/
  cs-marketing-website/
  cs-build-feature/
  ...
```

This is intentional while installer discovery is validated. The `skills` CLI currently proves the flat surface works; its help also signals that nested discovery can depend on `--full-depth`. Do not assume a nested `skills/marketing/...` path is safe for the default customer install command.

Use these places for organisation without hiding installable skills:

```text
docs/                 # lifecycle maps, SOPs, architecture and roadmap
skills/<skill>/       # one installed capability
skills/<skill>/references/  # optional detailed subflows / standards
skills/<skill>/templates/   # reusable outputs
skills/<skill>/scripts/     # deterministic helpers
SKILLS.md             # catalog, lifecycle family, audience, status and owner
AGENTS.md             # automatic instructions for agents changing this repository
```

When nested layout is proposed, first create a disposable test repository with representative root and nested `SKILL.md` files, run the exact standard installation command (`npx skills add <repo> --list` and the intended install command), and record the result. Only then migrate the repository in one controlled release.

## 4. The right skill size

**One skill = one completed capability.** Do not make a skill for every step.

For example, `cs-marketing-seo` should contain these subflows as sections/references:

- setup and access: analytics, Search Console, crawl/index baseline;
- technical baseline: robots, sitemap, canonicals, metadata, internal links;
- page/content work: intent, brief, evidence, conversion path;
- measurement loop: query data, prioritised backlog, 14/28/56-day review.

Split a skill only when at least one is true:

1. It has a distinct user trigger and can be invoked independently.
2. It has a different approval boundary or credential set.
3. It produces a separate durable artifact used by another workflow.
4. It has grown beyond a concise skill plus progressive references and agents repeatedly miss steps.

A tool recipe, a checklist, or a one-off platform integration is normally a reference, template, or script — not a new top-level skill.

## 5. Maturity

Every skill must record a maturity state in `SKILLS.md`.

- `draft` — designed, not dogfooded.
- `dogfooding` — being run on CodeSpring/Ferb with evidence captured.
- `proven` — dogfooded and re-run on a customer-shaped example or customer work with permission.
- `deprecated` — retained only while migration is completed.


## 6. Required skill contract

Each skill must include:

1. **Trigger / outcome** — when it loads and the business result.
2. **Inputs and prerequisites** — source access, project/website context, authority, and missing-information behavior.
3. **Workflow** — ordered, outcome-oriented actions.
4. **Approval boundaries** — credentials, spend, production mutation, publishing, client communications, and claims.
5. **Artifacts** — files, plans, ledgers, page briefs, PRDs, tasks, URLs, or receipts it produces/updates.
6. **Verification** — exact evidence required before completion.
7. **Status language** — use the approved statuses precisely.
8. **Handoff** — what next capability consumes the result.
9. **Pitfalls** — known ways agents make unsafe, duplicative, or misleading progress.

Put always-needed routing and guardrails in `SKILL.md`. Put detailed platform mechanics, long checklists, and templates into `references/` / `templates/`.

## 7. Creation workflow

1. **Classify** using Section 1.
2. **Check collisions:** search `SKILLS.md`, existing skills, and current product/Atlas context.
3. **Choose the smallest valid capability:** extend an existing skill if appropriate.
4. **Create the contract:** follow the in-repo `SKILL.md` standard; add references and templates only when they are reused.
5. **Dogfood:** run it against CodeSpring/Ferb; capture what happened and fix missing prerequisites.
6. **Catalog:** update `SKILLS.md` with name, family, maturity, purpose, and lifecycle handoff.
7. **Validate:** frontmatter, links, commands/scripts, and completion criteria; run the relevant install/discovery smoke test if paths changed.
8. **Release:** branch → commit → push → remote SHA verification → approved merge to `main`.
9. **Ingest:** add a concise update to the relevant CodeSpring/Ferb Atlas context after the source is live.

## 8. Initial capability map

Keep the first release intentionally small:

- `cs-marketing-research`
- `cs-build-getting-started`
- `cs-build-import-codebase`
- `cs-build-create-prd`
- `cs-build-create-tasks`
- `cs-build-feature`
- `cs-agent-setup`
- `cs-release-production-readiness`
- `cs-release-security-audit`
- `cs-marketing-offer`
- `cs-marketing-website`
- `cs-marketing-seo`
- `cs-marketing-content`
- `cs-marketing-carousel`
- `cs-operate-growth-review`
- `cs-operate-skill-maintenance`

`cs-marketing-website` is the first marketing capability. It supplies the page inventory and website workboard that `cs-marketing-seo` uses for technical and content priorities.

## 9. Definition of done

A skill is ready to call a capability only when it is classified, dogfooded, catalogued, installed/discovered successfully, bounded by approvals, verified with evidence, and connected to the next lifecycle outcome. Otherwise it is a draft, reference, or workboard item — not a finished skill.
