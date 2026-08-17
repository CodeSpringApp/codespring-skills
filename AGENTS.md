# CodeSpring skills repository — agent operating rules

This is the source repository for reusable CodeSpring and Ferb skills. Treat a skill as a product capability, not a prompt or a note.

## Start here

Before creating, renaming, moving, or retiring a skill:

1. Read [`docs/skill-governance-sop.md`](docs/skill-governance-sop.md).
2. Inspect `SKILLS.md` and the nearest existing skill.
3. Classify the requested outcome using the lifecycle map.
4. Reuse or extend an existing skill unless the new work has a distinct trigger, approval boundary, or completion artifact.

## Hard rules

- Do not create an unclassified `cs-*` skill.
- Do not create one skill for every action. Add a capability skill, then place detailed subflows in its `references/` and reusable outputs in `templates/`.
- Use the required `cs-<family>-<outcome>` name for all new skills.
- The current package has a flat installation surface. Do **not** move an installable `SKILL.md` into a nested category directory until the exact installer command has been smoke-tested against the proposed structure.
- **Skill-size rule:** one skill owns one completed capability, not every action. Keep setup, execution, measurement, and related checklists in that skill's `SKILL.md`/`references/`; split only for a genuinely independent trigger, approval boundary, or durable handoff artifact.
- Dogfood first. Do not represent an untested playbook as a reusable customer capability.
- Every skill needs explicit approval boundaries, completion evidence, exact status language, and a handoff to the next lifecycle capability.
- Never silently claim a remote publication, production deployment, listing, or integration is live. Use `DRAFT`, `READY`, `IN PROGRESS`, `AWAITING APPROVAL`, `QUEUED`, `SUBMITTED`, `LIVE / VERIFIED`, or `BLOCKED` precisely.

## Required delivery

For any source change: validate the skill/frontmatter, update `SKILLS.md`, commit on a working branch, push, verify the remote SHA, and merge to `main` only when the change is approved for the live pack.
