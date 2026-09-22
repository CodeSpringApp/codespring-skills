# Control plane, environments and model routing

Read this before creating resources. Most setup confusion comes from treating several separate layers as one thing.

## The seven layers

| Layer | What it owns | What it does not mean |
|---|---|---|
| Workspace/tenant | Ownership and access boundary | Not an environment |
| Environment | Separate development or production resources | A resource in development does not automatically appear in production |
| Provider connection | Encrypted credential and allowed provider models | Not an agent and not safe for browser code |
| Stable model ID/profile | App-facing route to provider candidates, fallback, budget and policy | Not necessarily one raw provider model forever |
| Agent draft | Editable instructions and resource selections | Not the revision existing sessions run |
| Published agent revision | Immutable pinned model policy, tools, MCP snapshots and skills | Cannot be silently rewritten in place |
| Agents API key/client token | Server permission and short-lived browser delegation | Neither is a model-provider key |

## Environment rule

Always print this before a remote mutation:

```text
Target: <workspace> / <development|production>
Action: <resource and intended change>
```

If a resource appears missing, first check the selected workspace and environment. Do not recreate it until both match the place where it was originally published.

Every workspace has a protected production environment and at least one development environment. A new environment is intentionally empty: it does not copy API keys, provider connections, models, agents, sessions, allowed origins or data from another environment.

## Authentication rule

Interactive device authentication has three actors: CLI, browser approval page and operating-system credential store.

1. Run one login command.
2. Compare the fresh browser code to the terminal code.
3. Approve only that request.
4. Wait for the CLI to finish.
5. Run `auth status --json` in the same execution context that will perform control-plane work.

Expired codes are disposable. Generate a new code; never keep reopening an old approval URL. The JSON config does not contain the refresh credential. On macOS it normally lives in Keychain, so a sandboxed shell can appear logged out even when a normal terminal works. Do not work around this by copying tokens into source.

## Model routing rule

The durable relationship is:

```text
agent -> stable model ID -> policy revision -> provider candidate(s) -> provider connection
```

This keeps application code stable while operations rotate credentials or change provider candidates. A stable model ID may represent one provider today and a fallback policy later.

Changing one layer does not necessarily update the others:

- Rotating the secret on the same provider connection is credential maintenance.
- Editing a model profile changes routing policy.
- A published agent pins a model policy revision. Republish the agent when it must use a changed profile revision.
- If the agent changes to a different stable model ID, update its draft and publish a new agent revision.
- If the Agents API key is restricted to agent revisions, permit the new revision before testing the app.

Avoid creating `agent-model-2`, `agent-model-3` without recording why the existing stable route could not be updated. Temporary names obscure which revision is authoritative.

## Draft and publish rule

`Save`, `create`, `update draft`, `publish`, and `run` are different states:

```text
local code -> control-plane draft -> published immutable revision -> session -> replay evidence
```

Dashboard presence proves only that a resource exists in the currently selected environment. A green badge does not prove a turn used it.

Before publish, record a compact draft manifest:

```yaml
workspace: <slug>
environment: development
agent_id: <id>
model_profile_id: <stable-id>
ordinary_tools: []
mcp:
  - server_id: <id>
    snapshot_id: <id>
    enabled_tools: [<name>]
skills: [<id>]
limits:
  model_steps: <n>
  tool_calls: <n>
```

After publish, replace the draft status with the immutable revision ID/number and smoke evidence.

## Version source of truth

The SDK's bundled skills are useful but deliberately narrow. Always compare four things:

1. installed package version;
2. package-exported TypeScript types;
3. version-matched bundled skills/examples;
4. live control-plane validation response.

The installed package and live API outrank a copied README or an old project script. If the bundled skill catalogue's package metadata differs from the installed package, report the drift and do not assume the examples cover the current backend. If public SDK types and deployed validation disagree, preserve the response, use the accepted live shape, and file the mismatch as SDK/control-plane DX evidence. Isolate compatibility code in one trusted server module instead of scattering untyped requests through the app.

## Server and browser credentials

Keep these separate:

- Provider key: stored by the control plane; never in the app.
- Agents API key: trusted server or CI only; scoped to the environment, actions and allowed published agent revisions.
- Browser client token: short-lived, origin-bound, minted by the app's server and held in memory by the React client.

The app's `/api/agents/token` route is implemented by the customer application. It is not a ready-made dashboard endpoint. The route must derive the external user and allowed origin on the server, request only the needed `sessions:read`/`sessions:write` scopes, include the exact published revision IDs, return `{ token, expiresAt }`, and set `Cache-Control: no-store`.

If a new revision publishes successfully but the browser cannot connect, inspect the Agents API key's scopes/agent allowlist, the delegated token's origin and allowed revision, and session ownership before changing the model or instructions.
