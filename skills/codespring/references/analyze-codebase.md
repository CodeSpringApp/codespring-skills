# Codebase Analysis Checklist

Use this checklist when analyzing a local codebase to sync findings to CodeSpring. Sections 1–5 identify the stack and rough feature list. Sections 6–9 go deeper — they are what make notes and PRDs accurate. Read the code; don't guess.

## 1. Project Identity

- Read `package.json` for: name, version, description, scripts
- Read `README.md` for: description, feature list, setup instructions

## 2. Dependencies Analysis

From `package.json` dependencies/devDependencies, identify:

### Frontend Frameworks
`react`, `react-dom`, `next`, `vue`, `nuxt`, `svelte`, `solid-js`, `angular`, `astro`, `remix`

### Backend Frameworks
`express`, `fastify`, `hono`, `koa`, `nestjs`, `elysia`, `hapi`

### Database/ORM
`prisma`, `drizzle-orm`, `mongoose`, `typeorm`, `sequelize`, `knex`, `pg`, `redis`, `ioredis`

### State Management
`zustand`, `jotai`, `recoil`, `valtio`, `mobx`, `xstate`, `redux`, `@reduxjs/toolkit`

### Styling
`tailwindcss`, `styled-components`, `@emotion/react`, `sass`, `@vanilla-extract/css`

### Testing
`jest`, `vitest`, `mocha`, `cypress`, `playwright`, `@testing-library/*`

## 3. Directory Structure

| Directory | Indicates |
|-----------|-----------|
| `src/app/` | Next.js App Router |
| `src/pages/` | Next.js Pages Router |
| `src/components/` | Component library |
| `src/features/` | Feature-based architecture |
| `src/hooks/` | Custom React hooks |
| `src/lib/` or `src/utils/` | Utility functions |
| `src/services/` | API/business logic |
| `prisma/` | Prisma ORM |
| `drizzle/` | Drizzle ORM |

## 4. Feature Discovery

Identify features from:
1. **Route segments**: `/dashboard`, `/settings`, `/billing`
2. **Feature directories**: `features/auth`, `features/payments`
3. **README sections**: "Features", "What's Included"
4. **Component directories**: Major UI sections

## 5. Sync to CodeSpring

### Tech Stack
```bash
codespring mindmap tech-stack --add '[
  {"id":"tech-react","title":"React","description":"Frontend"},
  {"id":"tech-typescript","title":"TypeScript","description":"DevTools"}
]'
```

### Features
```bash
codespring mindmap features --add '[
  {"title":"Authentication","description":"User login/signup"},
  {"title":"Dashboard","description":"Main user interface"}
]'
```

### Project Metadata
Update project name/description if discovered from package.json/README.

---

## 6. Find the TRUE core features — read the sidebar first

Section 4 gives candidates; this pins them down. In most webapps the **core features are the sidebar / primary-nav items = pages**. Find and read the nav/sidebar component (search for `sidebar`, `nav`, `navItems`, `routes`) and take its entries verbatim — that is the authoritative core-feature list. Only fall back to routes/README when there is no nav. A core feature is the highest-level thing a user recognizes as "a thing the app does"; it should map to a page/section, not a file.

## 7. Sub-features

Under each core feature, list the specialized capabilities that make it work (the screens/actions/steps inside that page — e.g. under a "Projects" page: Create Project, Invite Teammate, Project Detail). Create them parented to the core feature (`codespring feature create --parent <coreFeatureId>`). Keep descriptions to one sentence; depth goes in the note/PRD.

## 8. Backend depth (feeds the note + Backend PRD)

For each core feature capture:
- **API routes** — path, method, request/response, auth. **Flag any route used by more than one feature** (shared routes are where new features accidentally duplicate work).
- **Data model** — tables/collections, key columns, enums, relationships; what's read vs written.
- **Server actions / services / queries** — the reusable functions that already exist (new features should call these, not re-implement them).
- **Security** — authn/authz, ownership checks, input validation, secrets/keys, row-level security, webhook signature verification.
- **External services & env vars** — every integration and the env vars it needs.
- **Infra & gotchas** — hosting, request timeouts/limits, async or polling jobs, cron/queues (or their absence), storage buckets, rate/credit logic, hardcoded hosts, orphan/misnamed routes.

## 9. Frontend depth (feeds the note + Frontend PRD)

- **Design tokens** — colors/branding, corner radius, spacing scale, typography, shadows (pull from the Tailwind config, CSS variables, or theme file).
- **Component & UI styles** — which UI library, how buttons/cards/inputs/modals are styled, and their states (hover/active/disabled).
- **Layout, positioning & spacing** — grid/flex, columns, breakpoints, gaps; where things sit relative to each other. Be concrete.
- **What the user sees** — header, sections, cards, tables, empty/loading states, toasts.
- **Navigation / interaction map** — the concrete path to and through the feature: which nav item/button opens it, what route it lands on, what it shows, and what each interaction does. Also where it links FROM and TO other features.

Sections 8–9 are what you write into each core feature's "how it works" note before generating PRDs — the generator uses that note as context.
