# CodeSpring Docs — pointers for guiding the user

Some steps happen in the **CodeSpring web app**, not the CLI (generating PRDs from the canvas, the Kanban board, picking a journey). Use this to guide users through those, and fetch the live docs when you need the current details.

- Docs home: https://codespring.app/docs
- Skills library: https://codespring.app/docs/skills
- A project: `https://v2.codespring.app/project/<projectId>`

> Agents: when you need the exact, current UI steps, fetch the relevant docs page (it's public) rather than relying on this summary, which may lag the product.

## Install the skills (whole pack)
```bash
npx skills add CodeSpringApp/codespring-skills   # installs every skill in the pack, once
```

## Connect the CLI
```bash
npm i -g @codespring-app/cli
codespring auth login      # browser OAuth
codespring init            # link this directory to a project
```

## Pick your journey
The docs frame two starting points: **build a new project from scratch** or **import an existing codebase**. `cs-build-getting-started` routes the user between them.

## Generate a PRD in the web app
If the user prefers the app over the CLI/API: open the project canvas → find the target **feature's bridge** → add a **PRD Bridge** to it → generate the **Frontend** and/or **Backend** PRD from that bridge → wait for it to finish. The PRD then appears as a `prdFrontend` / `prdBackend` node on that bridge. (Exact clicks are on the docs page — fetch it if unsure.) The same result is available programmatically via `prd-management.md`.

## Kanban board
Tasks created via the CLI show on the board: in the project, use the top-right **Map / Kanban** toggle → click **Kanban** to see tasks in `todo / in progress / on hold / done`.

## When a user is stuck
Point them at the relevant docs page (home or `/docs/skills`) rather than guessing UI details, and offer to do the CLI/API path for them where one exists.
