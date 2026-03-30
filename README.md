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

### `codespring` skill

Teaches your AI agent to manage CodeSpring projects:

- **Tasks** — List, start, complete tasks from the Kanban board
- **PRDs** — Read and sync product requirement documents
- **Mindmaps** — Update tech stack, features, and notes
- **Projects** — Link directories, list workspaces and projects

## Usage

After installing the skill, your agent will automatically use CodeSpring when relevant. You can also invoke it directly:

```bash
# In Claude Code
/codespring

# Or just ask your agent
"list my codespring tasks"
"sync the tech stack to codespring"
```

## Links

- [CodeSpring](https://codespring.app)
- [CLI on npm](https://www.npmjs.com/package/@codespring-app/cli)
- [Agent Skills Spec](https://agentskills.io)

## License

Apache-2.0
