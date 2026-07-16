# CLAUDE.md templates

Starter `CLAUDE.md` files by app type. A `CLAUDE.md` at a project's root tells the coding agent how to build in that repo — commands, conventions, and guardrails — so you don't re-explain it every session.

These are **agnostic starting points** — no company/person/branch specifics. Copy the one that matches your app to your project root as `CLAUDE.md`, then fill in the `<…>` placeholders (build/run/test commands, paths, conventions).

| Template | For |
|----------|-----|
| `web-app.CLAUDE.md` | Web apps (Next.js, Vite/React, etc.) |
| `ios-app.CLAUDE.md` | iOS / iPadOS apps (Swift/SwiftUI) |
| `macos-app.CLAUDE.md` | macOS apps (Swift/SwiftUI/AppKit) |

> Status: agnostic v0.1 drafts. Replace the placeholders with your real setup. A future `cs-setup-github` skill will pair these with a branch workflow (main / dev / feature branches).
