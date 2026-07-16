# CLAUDE.md — Web app

Agnostic starter. Replace every `<…>` with your project's real values, then delete this line.

## Project
- **What it is:** <one sentence>
- **Stack:** <framework e.g. Next.js 14 / Vite+React> · <language e.g. TypeScript> · <styling e.g. Tailwind + shadcn> · <db/ORM> · <auth> · <payments>
- **Hosting:** <Vercel / AWS / …>

## Commands
```bash
<install>      # e.g. npm install
<dev>          # e.g. npm run dev
<build>        # e.g. npm run build
<test>         # e.g. npm test / vitest
<lint>         # e.g. npm run lint
<typecheck>    # e.g. tsc --noEmit
```
Always run `<typecheck>` and `<lint>` before considering a change done.

## Conventions
- Match the surrounding code (naming, file structure, imports). Look at a nearby file before adding a new one.
- Components in `<components dir>`; routes/pages in `<routes dir>`; server/API logic in `<server dir>`; shared utils in `<lib dir>`.
- State: `<approach>`. Data fetching: `<approach>`.
- Reuse existing components/utilities before writing new ones.

## Shared systems — do not duplicate or break
- **API routes:** some are shared across features — check before adding/changing one.
- **Data model / migrations:** `<where>`. Never edit a shipped migration; add a new one.
- **Auth / access control (RLS):** `<how it works>` — respect it on every new endpoint.
- **Payments / credits / refunds:** `<system>` — do not reimplement; call the existing service.
- **Jobs / cron / queues, storage/buckets:** `<where>` — reuse the existing patterns.
- **Env vars:** reuse existing names (`<list key ones>`); never hardcode secrets.

## Guardrails
- Make the smallest change that satisfies the task; don't refactor unrelated code.
- Verify the feature you changed AND anything that depends on it still works.
- Don't commit secrets. Don't change deploy/CI config unless asked.
- If a change would touch a shared system above, flag it before proceeding.

## Testing / verification
- <how to run the app locally and what "working" looks like>
- <test command + where tests live>
