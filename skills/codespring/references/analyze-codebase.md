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

## 6. Find the TRUE core features — read the sidebar first, then cut

Section 4 gives candidates; this pins them down. In most webapps the **core features are the sidebar / primary-nav items = pages**. Find and read the nav/sidebar component (search for `sidebar`, `nav`, `navItems`, `routes`) and take its entries as the candidate list. Only fall back to routes/README when there is no nav. A core feature is the highest-level thing a user recognizes as "a thing the app does"; it should map to a page/section, not a file.

**Then cut the list down.** Aim for **4–8 core features.** Above 8, argue for each one; above 10 you have almost certainly split one feature into many. Merge screens that are one job spread across pages, and drop pages the app shouldn't have (dead ends, orphans, internal galleries). A real run produced **13 confusing** core features before being cut to **6 clean** ones — the smaller list was the correct one. Read the list back to the user and ask them to cut it further before writing anything.

## 7. Sub-features — things a user DOES

Under each core feature, list the specialized capabilities that make it work — the actions inside that page, e.g. under a "Projects" page: Create Project, Invite Teammate, Project Detail. **A sub-feature is a verb: something the user does.** Create them parented to the core feature (`codespring feature create --parent <coreFeatureId>`). Keep descriptions to one sentence; depth goes in the note/PRD.

**Do not turn report/page sections or form field-groups into sub-features.** This is the specific mistake that produced the 13-feature mess:
- **A report or output section is not a feature.** "Government costs", "Tax benefits", "Glossary" are parts of one feature's output. Twelve report sections make **one** feature plus a good note — not twelve features.
- **A form field-group is not a feature.** "Location", "Loan details", "Property details" are parts of one feature's input. The feature is *analysing a property*; those are panels of it.

Symptoms you got this wrong: core features that read like a table of contents; sub-features that are nouns; more features than the app has screens; two sub-features a user couldn't tell apart. If detail is being lost, the **note** is too thin — enrich it rather than adding features.

## 8. Backend depth (feeds the note + Backend PRD)

For each core feature capture:
- **API routes** — path, method, request/response, auth. **Flag any route used by more than one feature** (shared routes are where new features accidentally duplicate work).
- **Data model** — tables/collections, key columns, enums, relationships; what's read vs written.
- **Server actions / services / queries** — the reusable functions that already exist (new features should call these, not re-implement them).
- **Security** — authn/authz, ownership checks, input validation, secrets/keys, row-level security, webhook signature verification.
- **Shared backend systems** (call these out explicitly — new features collide with them): hosting/deploy target (AWS, Vercel…) and platform limits; crediting/usage metering; payment, subscription, and **refund** systems; background **jobs / pipelines / queues / cron**; storage — **S3 conventions / buckets**, file paths, signed-URL patterns; media/render pipelines (e.g. Remotion/video compositions); databases + migrations; **auth and row-level security (RLS)**; **environment variable names** to reuse; webhooks + signature verification.
- **External services & env vars** — every integration and the env vars it needs.
- **Infra & gotchas** — request timeouts/limits, async or polling jobs, hardcoded hosts, rate/credit logic, orphan/misnamed routes.
- **Dependency / break-risk map** — what depends on this feature's code, so a future change doesn't silently break another feature.

## 9. Frontend depth (feeds the note + Frontend PRD)

- **Design tokens** — colors/branding, corner radius, spacing scale, typography, shadows (pull from the Tailwind config, CSS variables, or theme file).
- **Component & UI styles** — which UI library, how buttons/cards/inputs/modals are styled, and their states (hover/active/disabled).
- **Layout, positioning & spacing** — grid/flex, columns, breakpoints, gaps; where things sit relative to each other. Be concrete.
- **What the user sees** — header, sections, cards, tables, empty/loading states, toasts.
- **Navigation / interaction map** — the concrete path to and through the feature: which nav item/button opens it, what route it lands on, what it shows, and what each interaction does. Also where it links FROM and TO other features.

Sections 8–9 are what you write into each core feature's "how it works" note before generating PRDs — the generator uses that note as context.
