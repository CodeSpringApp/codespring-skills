# CodeSpring Agent Skills

Agent skills for [CodeSpring](https://codespring.app) — project planning and management from your AI coding agent.

Works with **30+ AI tools** including Claude Code, Cursor, Codex, Gemini CLI, Roo Code, VS Code Copilot, and more.

## Installation

```bash
npx skills add CodeSpringApp/codespring-skills
```

The installer will ask which agent to install for.

### Prerequisites

- [CodeSpring CLI](https://www.npmjs.com/package/@codespring-app/cli) installed and authenticated:

```bash
npm i -g @codespring-app/cli
codespring auth login
```

## What's included

One command installs the whole pack. It's organized as a core knowledge skill plus task-specific specialists (see [`SKILLS.md`](SKILLS.md) for the status tracker).

### `codespring` — the core skill

Teaches your AI agent how CodeSpring works and how to drive the CLI:

- **Tasks** — List, start, complete tasks from the Kanban board
- **PRDs** — Read, sync, and (via the specialists) generate product requirement documents
- **Mindmaps** — Update tech stack, features, notes, and PRD bridge nodes
- **Projects** — Link directories, list workspaces and projects

It carries the canonical `references/` (commands, task-workflow, analyze-codebase, mindmap-structure, prd-management, pitfalls) that the specialists build on.

### Specialist skills

- **`cs-getting-started`** — connects the agent to CodeSpring, then routes you: design a new project from scratch, or import an existing codebase.
- **`cs-import-codebase`** — reads your real code and maps it into CodeSpring (core features, sub-features, notes), generates Frontend + Backend PRDs, then runs an independent read-only audit of code vs map.
- **`cs-create-prd`** — pick a feature and generate a Frontend, Backend, or Both PRD, deep-dived from the code (incl. shared backend systems) and attached to the feature.
- **`cs-create-tasks`** — turn a feature's PRDs into a numbered, prioritized, parallel-safe Kanban task list.
- **`cs-build-feature`** — interactive build: checks readiness, then works the tasks (up to 5 parallel sub-agents) with guards against breaking existing features.
- **`cs-resync-codebase`** — after building, checks whether CodeSpring is stale vs the real code and updates the map (read-only on your code).
- **`cs-seo-website`** — operates CodeSpring marketing-site technical SEO, the Search Console-to-content loop, Vibe Code Library publishing gates and vetted product listings.

Also: `claude-templates/` — agnostic `CLAUDE.md` starters by app type (web / iOS / macOS). See [`SKILLS.md`](SKILLS.md) for status and roadmap.

## Usage

After installing, your agent uses the skills automatically when relevant. You can also invoke one directly:

```bash
# In Claude Code
/cs-getting-started
/cs-import-codebase
/cs-create-prd
/codespring

# Or just ask your agent
"import my codebase into codespring"
"create a backend PRD for the billing feature"
"list my codespring tasks"
```

## Links

- [CodeSpring](https://codespring.app)
- [CLI on npm](https://www.npmjs.com/package/@codespring-app/cli)
- [Agent Skills Spec](https://agentskills.io)

## License

Apache-2.0
