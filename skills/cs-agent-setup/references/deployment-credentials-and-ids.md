# Deployment credentials, IDs and environment mapping

Read this when a CodeSpring Agents application is moving from localhost to a
host such as Vercel, Netlify, Railway or Render, or when the person asks which
key/ID belongs in a deployment form.

## Keep the three meanings of “production” separate

1. **CodeSpring production environment** is the protected live resource room in
   the CodeSpring dashboard.
2. **Hosting production deployment** is the public website selected as
   “Production” by Vercel or another host.
3. **Production-ready** is a verification claim: the exact hosted UI and agent
   revision completed a real smoke test.

These do not imply one another. A Vercel Production deployment may temporarily
point to a CodeSpring development agent. Call this a **development-backed public
beta**. It is a valid short-term choice when the user explicitly accepts that:

- development agent changes affect public visitors immediately;
- development usage, sessions and limits carry the public traffic;
- the live HTTPS origin is allowed in the CodeSpring development environment;
- the deployment uses a development-scoped Application backend key;
- production promotion is still unfinished.

Do not copy resources merely because the website is public. First record the
intended pairing:

```text
Hosting target: Vercel / Production
CodeSpring target: <workspace> / development
Agent revision: <agent-id>@<number>
Release status: development-backed public beta
```

## Which credential is which

| Credential | What it does | Where to create/find it | Where it belongs |
|---|---|---|---|
| Provider key | Pays for and authorizes model calls | **Models → Provider keys** in the selected CodeSpring environment | CodeSpring secure form only |
| MCP credential | Lets one MCP server call an outside service | **MCP servers → connection/authentication** | CodeSpring secure form/OAuth only |
| Agents API key — Application backend | Runs approved agent revisions and mints short-lived browser tokens | **API keys → Create key → Application backend** in the same CodeSpring environment as the agent | Hosting provider's server-side secret settings |
| Control plane — read only | Inspects agents/models/tools/configuration | **API keys** | Trusted administration/CI only; not the web app |
| Control plane — publish | Creates or publishes resources | **API keys** | Trusted deployment automation only; not the web app |
| Browser client token | A five-minute, origin-bound visitor pass | Minted by the application's `/api/agents/token` server route | Browser memory only; never a deployment variable |

An Application backend key must permit the exact published agent revision and
normally needs `client_tokens:write`, `sessions:read` and `sessions:write`.
Create a separate key for the deployed app rather than reusing a local/testing
key. The secret is shown once. Ask the person to place it directly in the host's
secret field; never request it in chat, print it, or commit it.

## What the IDs mean and where to find them

| Name | Example | Meaning | Where to find it |
|---|---|---|---|
| Workspace/tenant | `VolkisAI's Agents` / opaque tenant ID | Owner and access boundary | Workspace selector in the top bar; workspace settings for the opaque ID |
| Environment slug/ID | `development` / opaque environment ID | Separate resource and credential boundary | Environment selector in the top bar; environment settings for the opaque ID |
| Stable model ID | `buildproof-chat2` | Nickname the agent uses for a model route | **Models → Model IDs** |
| Agent ID | `buildproof-research-guide` | Stable name of the saved worker | **Agents → agent detail** |
| Agent revision ID | `buildproof-research-guide@27` | Immutable published version used by sessions and key allowlists | **Agents → Current version** or the publish response |
| Skill ID/revision | `research-evidence` / `research-evidence@4` | Reusable playbook and one frozen package version | **Skills → skill detail** |
| MCP server/snapshot/tool | `firecrawl-2`, `firecrawl-2@1`, `firecrawl_search` | Connection, reviewed discovery snapshot and enabled action | **MCP servers → server detail/tool list**; published agent manifest |
| API key record ID | Safe dashboard identifier | Identifies a key without revealing the secret | **API keys** list |
| API key secret | One-time secret value | Authorizes trusted server requests | Shown once at creation; then only in the hosting secret store |
| Allowed origin | `https://app.example.com` | Exact browser site allowed to receive client tokens | **Settings → Allowed browser origins** |

Do not confuse an **agent ID** with an **agent revision ID**. Application keys,
client tokens and application configuration should pin the revision ID when the
API expects a published version.

## Standard hosted application variables

Use server-side environment variables with these names unless the application
already defines a documented equivalent:

```text
CODESPRING_AGENTS_ENDPOINT=https://api.agents.codespring.app
CODESPRING_AGENTS_API_KEY=<Application backend secret from the selected CodeSpring environment>
CODESPRING_AGENT_REVISION_ID=<agent-id>@<published revision number>
```

Never prefix the API key with `VITE_`, `NEXT_PUBLIC_`, `PUBLIC_` or another
browser-exposed prefix. Provider keys and MCP credentials are not application
deployment variables when CodeSpring owns those connections.

Hosting environment selection is separate. If Vercel says “Production and
Preview”, remember that each browser origin must be permitted by CodeSpring.
Prefer Production only for a first launch. Add Preview only when an exact,
stable preview origin is intentionally allowed or the architecture has a safe
preview-domain strategy; do not assume wildcard preview URLs are accepted.

## Public-beta safety and deployability checks

Before publishing a site against a development agent:

1. Confirm the development agent revision and tools have already passed direct
   and local-UI smokes.
2. Add the exact public HTTPS origin to **development → Settings → Allowed
   browser origins**.
3. Create a dedicated development **Application backend** key restricted to the
   exact revision.
4. Put the three variables above in the host's server-side Production secrets.
5. Ensure `/api/agents/config` and `/api/agents/token` are real deployed server
   routes or serverless functions. Vite `configureServer` and
   `configurePreviewServer` middleware exist only in local dev/preview and do
   not become hosting functions automatically.
6. Derive a separate `externalUserId` for each authenticated user. For an
   anonymous beta, use an unpredictable server-issued HTTP-only cookie. Never
   give every visitor one shared identity.
7. Use a registry dependency such as `@codespring-app/use-agent@0.13.0` in a
   deployable repository. A `file:../use-agent-sdk` dependency works only when
   that sibling folder is also present on the build machine.
8. Deploy, then test the config endpoint, token endpoint, one model-only turn,
   one required-tool turn, refresh/resume behavior and one safe failure path.

If the host build cannot resolve `@codespring-app/use-agent`, inspect
`package.json` and the lockfile for a local `file:`/symlink dependency before
changing TypeScript code. Missing SDK types often cause secondary implicit-`any`
errors; fix the dependency first and re-run the build.

## Promotion later

A development-backed public beta does not remove the real production work.
Production needs its own provider connection, stable model ID, skills, MCP
credentials/snapshots, agent revision, Application backend key and allowed
origin. Do not reuse the development API key. When production is ready, update
the hosting secrets to the production key and production agent revision, deploy
again, then run a fresh end-to-end smoke.
