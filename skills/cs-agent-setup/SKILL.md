---
name: cs-agent-setup
description: >
  Set up or repair a CodeSpring Agents application end to end: select the exact
  workspace and environment, connect the installed @codespring-app/use-agent
  SDK, map provider connections and stable model IDs correctly, create and
  publish the agent revision, attach skills and executable tools, issue secure
  browser credentials, connect the React UI, and prove a real turn works. Use
  when someone says "set up a CodeSpring agent", "connect UseAgent", "why is my
  agent not showing", "why does the agent have no tools", "the agent is stuck",
  "connect an MCP", "add generative UI", or "make the local agent work".
allowed-tools: Bash(npx:*) Bash(npm:*) Bash(bun:*) Bash(node:*) Bash(curl:*) Bash(git:*) Bash(rg:*) Bash(sed:*) WebSearch WebFetch
metadata:
  author: codespring
  version: "0.1"
---

# Set up a working CodeSpring agent

Produce a working agent, not a dashboard-shaped collection of drafts. The completion artifact is a short `AGENT_SETUP.md` receipt in the application repo plus a real session whose replay proves the model and expected tools ran.

This skill complements the version-matched guidance bundled with `@codespring-app/use-agent`; it does not replace it. Read the installed package before copying an old example:

```bash
npx @codespring-app/use-agent skills get app-builder
npx @codespring-app/use-agent skills get control-plane
npx @codespring-app/use-agent skills get react-ui
```

Load `customer-tools` too when the app will expose its own API/database operation to the hosted agent.

## Read the relevant reference

| Reference | Read when |
|---|---|
| [`references/control-plane-and-models.md`](references/control-plane-and-models.md) | Always. Explains provider connections, model IDs, drafts, immutable revisions, environments and browser credentials. |
| [`references/tools-and-generative-ui.md`](references/tools-and-generative-ui.md) | The agent needs research, SEO, app/database actions, charts, choices, cards or dynamic report UI. |
| [`references/troubleshooting-and-proof.md`](references/troubleshooting-and-proof.md) | Setup is confusing, the UI waits forever, an agent/tool is missing, a revision changed, or before claiming completion. |

## 1. Establish the target before changing anything

Write down these six values first:

1. application repo and framework;
2. installed `@codespring-app/use-agent` version;
3. CodeSpring workspace/tenant;
4. environment: `development` or `production`;
5. intended stable model ID;
6. existing agent ID and published revision, if any.

Do not infer production from a deployed URL or development from localhost. Development and production are separate control planes. Repeat the workspace and environment in every status update involving a remote write.

Inspect before editing:

```bash
npm ls @codespring-app/use-agent
npx @codespring-app/use-agent auth status --json
npx @codespring-app/use-agent agents list --json
npx @codespring-app/use-agent tools list --json
```

If interactive auth is missing, run `npx @codespring-app/use-agent auth login` once and let the person approve the exact fresh device code. Never ask for a provider key, Agents API key, access token or refresh token in chat or source. A headless/CI API key belongs in a secret store.

## 2. Draw the resource chain

Before touching the dashboard or API, state the chain in one line:

```text
provider connection -> stable model ID -> agent draft -> published agent revision
                     + selected skills/tools/MCP snapshot
                     -> revision-authorized API key -> browser client token -> session
```

Use the terms precisely:

- **Provider connection** stores encrypted provider access. It is not selected by application code.
- **Stable model ID/profile** is the name the agent references. It routes to provider model candidates and policy.
- **Agent draft** is editable configuration. It is not what an existing session runs.
- **Published revision** is immutable and pins model policy, tools, MCP snapshots and skills.
- **Skill** is instructions/context. It cannot call an API by existing.
- **Tool/MCP tool** is executable capability.
- **Agents API key/client token** authorizes the application to open a session; it is not a model provider key.

If any link is unknown, inspect it. Do not create `-2`, `-3` resources merely to escape an unclear state.

## 3. Decide the smallest capability set

List what the agent must actually do in verbs. For each verb choose exactly one mechanism using `references/tools-and-generative-ui.md`:

- reason or follow a repeatable method -> skill/instructions;
- query a third-party service -> MCP tool when a suitable server exists;
- query the application's own data or perform its action -> customer-hosted tool;
- ask a typed question or render a chart/card -> React generative UI fed by structured data;
- embed a third-party interactive tool-owned view -> MCP App only when the server actually supplies one.

Keep first publication narrow. One reliable research action is better than attaching an entire catalogue the model cannot choose between.

## 4. Configure model routing

Reuse a stable model ID whose purpose matches the agent. Confirm that its provider connection is active and that the intended raw provider model is allowed. The app and agent should reference the stable model ID, never a raw provider model string.

If the route changes, inspect the model profile, update the **agent draft** if its stable ID changed, and publish a new agent revision. A changed model profile or a green provider connection does not retroactively rewrite an immutable agent revision.

## 5. Build and register capabilities

For a customer-hosted tool:

1. define it with `defineTool`;
2. expose it with `createToolHandler` and durable idempotent execution storage;
3. deploy it to a public standard-port HTTPS endpoint;
4. verify health/signature configuration;
5. register the exact handler revision;
6. attach the tool ID to the agent draft.

The hosted CodeSpring runtime cannot call a handler that only exists on localhost.

For MCP:

1. register the server in the target environment;
2. complete OAuth/header authentication without exposing the secret;
3. refresh discovery and inspect the snapshot;
4. select only the required tools;
5. attach the selected snapshot/tools to the agent draft.

Current agent drafts attach MCP servers with a reviewed snapshot and enabled tool names; published revisions flatten that into pinned MCP tools. Use the installed SDK types and the live API response as the source of truth. Do not force an older `mcpToolIds` example when the deployed control plane expects server selections.

## 6. Create or update the agent, then publish deliberately

Agent instructions should define the job, decision policy, tool-use rules, response contract and stopping rules. They should not pretend a skill is a tool or claim unsourced figures are evidence.

Before publication, inspect the draft diff and record:

- agent ID;
- stable model ID;
- ordinary tool IDs;
- MCP server snapshot and enabled tool names;
- skill IDs;
- model/tool-call limits;
- target environment.

Publishing creates a new immutable revision. Call it **LIVE / VERIFIED** only after a real session proves it. Until then use **IN PROGRESS** or **AWAITING APPROVAL**.

## 7. Connect the application securely

Install `@codespring-app/use-agent`. `createAgent({ id, revision })` creates a local reference to an already-published agent; it does not create or update the hosted agent.

Server code may use the scoped Agents API key. Browser code may not. Implement `/api/agents/token` in the application server: authenticate the app user, request a five-minute client token from CodeSpring with the exact browser origin, session scopes and allowed published agent revision, then return only `{ token, expiresAt }` with `Cache-Control: no-store`.

Initialize one cached React client:

```tsx
const client = createAgentClient({
  endpoint: "https://api.agents.codespring.app/browser",
  clientTokenEndpoint: "/api/agents/token",
});
```

Mount `AgentProvider`, create the session with the browser client for that authenticated user, and render either `AgentChat` or a custom interface built from SDK hooks. An arbitrary server-created session is not automatically owned by the browser user. Keep client creation outside render or memoized. After changing environment variables, API-key access, agent ID or revision, restart the dev server rather than testing a stale process.

## 8. Make the interface progressive

Do not open a half-empty report after the first message. Keep the primary task obvious:

1. conversation begins with one useful question;
2. typed choices appear inline when they reduce typing;
3. report sections appear only when the agent has material for them;
4. research state names the active action;
5. sourced cards/charts appear when tools return evidence;
6. verdict appears only after its prerequisites are checked.

The model supplies typed data, not HTML/CSS/JavaScript. React owns the design system and rendering. Use `AgentGenerativeUI` for bounded choices or build typed local renderers for the report schema. See `references/tools-and-generative-ui.md`.

## 9. Prove the whole chain

`session.submit()` returns admission, not the final answer. Connect to live events or page through replay until `turn.completed`, `turn.failed` or `turn.cancelled`.

Run the bounded verification in `references/troubleshooting-and-proof.md`. At minimum:

- one real session reaches `turn.completed`;
- replay identifies the intended agent revision and model profile;
- an expected tool produces `tool.started` and `tool.completed` when the test requires it;
- output contains real structured/sourced data rather than placeholder copy;
- no `turn.failed` is hidden behind a permanent spinner;
- the local UI submits, survives the response, renders progressive state and recovers from a forced error.

Then write or update `AGENT_SETUP.md` with the exact environment, IDs/revisions, capabilities, API-key scope/location, smoke session/turn IDs, timings, remaining blockers and commands to run locally. Never put secrets in the receipt.

## Approval boundaries

- Reading source, installed SDK types and control-plane state is safe.
- Device authorization always requires the human to approve the fresh displayed code.
- Creating/updating development resources is allowed when the user asked to set the agent up in development; report each remote mutation.
- Provider credential changes, paid service activation, production publication, disabling/archiving, spend changes and customer-data access require explicit authority for the exact target.
- Never automate around an OAuth consent screen or credential-store permission.

## Status language

- **DRAFT** — local definition or unpublished control-plane draft.
- **IN PROGRESS** — setup is being changed or has not passed the smoke test.
- **AWAITING APPROVAL** — a human consent, credential, spend or production write is required.
- **BLOCKED** — a named external requirement prevents further safe progress.
- **LIVE / VERIFIED** — the exact published revision completed the expected real session/tool flow and the application UI was checked.

## Handoff

Once setup is **LIVE / VERIFIED**, use `cs-build-feature` for wider application implementation. If the product UI has not been agreed, use `cs-build-ui-mockup` before hardening it. A successful development smoke test is not production readiness.
