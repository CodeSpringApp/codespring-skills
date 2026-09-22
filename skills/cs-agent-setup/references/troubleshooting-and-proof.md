# Troubleshooting and end-to-end proof

Diagnose by layer. Do not keep editing agent instructions when the failing layer is authentication, environment, model routing or browser credentials.

## Symptom map

| Symptom | Inspect first | Likely cause |
|---|---|---|
| Agent is absent from dashboard | Workspace/environment selectors; `agents list --json` | Published in another boundary or only exists as local code |
| Dashboard shows agent but app says “connecting” | Browser network, token endpoint, API-key and delegated-token scope | Client token cannot be issued or does not permit this origin/revision |
| Message waits forever | Session replay, WebSocket/HTTP status, terminal turn event | UI hides `turn.failed`, session is stale, or model/tool has failed |
| Wrong model still answers | Published revision manifest and model profile revision | Draft/profile changed but agent was not republished, or app points at old revision |
| Tools page says zero | Published revision's ordinary tools and MCP tools separately | Only MCP tools are attached or the summary is being misread |
| Agent never calls a tool | Published selection, description/schema, limits and prompt | Tool is absent from revision, unclear to model, or max calls is zero |
| MCP exists but has no tools | Auth state and discovery snapshot | OAuth incomplete, refresh failed or endpoint/schema incompatible |
| Customer tool registers but never runs | Public endpoint, handler revision and signature/JWKS | Handler is localhost-only, unreachable, mismatched or old revision removed |
| UI disappears after submit | Browser console and React dependency graph | Render exception, duplicate React/hooks, malformed event reducer or missing error boundary |
| `m is not a function`/hook-style crash | `npm ls react react-dom @codespring-app/use-agent` and bundler aliases | Duplicate/mismatched React, especially with a linked local SDK; dedupe React in Vite |
| Device approval keeps opening | Terminal code, code expiry and credential-store result | Old code reused, CLI not waiting, or credential store inaccessible in execution context |
| Works in direct smoke but not localhost | API key, client-token route, env process, origin and session ownership | Revision/origin mismatch or dev server still has stale environment variables |

## Fast diagnostic order

1. **Target** — print workspace and environment.
2. **Auth** — run status in the same shell/context as the failed command.
3. **Published manifest** — agent revision, stable model ID, skills, ordinary tools, MCP tools and limits.
4. **Agents API key** — scopes, environment and allowed agent revisions.
5. **Direct runtime smoke** — remove the frontend from the equation.
6. **Event replay** — find the terminal failure rather than trusting the spinner.
7. **Browser token/network** — inspect token endpoint, origin, ownership and `/browser` connection.
8. **React render** — only now debug component state and CSS.

This order stops frontend work from masking a broken remote revision and stops remote republishing from masking a local React crash.

## Authentication failures

- Generate one fresh device code and approve exactly that code.
- Do not repeatedly open authorization pages.
- Confirm the CLI process reports completion.
- Re-run `auth status --json` from the same context that will create/update resources.
- On macOS, remember the refresh credential is in Keychain. A sandboxed process can fail to read it even when a normal terminal is authenticated.
- For CI, use a scoped secret-store API key; never a pasted CLI argument.

## Revision failures

When anything changes, ask whether it is revision-bound:

- agent instructions/model/tools/skills -> publish new agent revision;
- customer tool schema/endpoint/handler revision -> publish new tool revision and then agent revision;
- MCP discovery -> attach the intended snapshot/tools and publish new agent revision;
- Agents API key or delegated token restricted to revision -> allow the new revision;
- frontend environment -> restart local server.

Write the new revision everywhere once. A mixture of old agent ID/revision in `.env.local`, token endpoint and frontend session creation is a common cause of permanent connecting/waiting states.

## Direct smoke test

Before opening the UI, create one bounded session against the exact published revision. Use a prompt designed to test one thing:

- model-only: asks a short deterministic question;
- MCP: explicitly requires one attached research action;
- customer tool: supplies valid bounded input and requests that exact operation;
- skill: asks for a situation that should load its method.

`submit()` only admits the turn. Connect to live events or page through `session.events(after, limit)` and advance the returned cursor until a terminal event appears. Record:

```yaml
session_id: <id>
turn_id: <id>
agent_revision: <id/number>
model_profile: <stable-id>
started_at: <timestamp>
completed_at: <timestamp>
terminal_event: turn.completed
tools:
  - name: <tool>
    started: true
    completed: true
sources_or_result: <short description>
```

Failure is still useful evidence. Preserve the error class/status and replay cursor. Do not replace it with “still thinking.”

## UI smoke test

After the direct turn passes:

1. restart the app if environment/revision settings changed;
2. load the page from a clean tab;
3. verify the token endpoint response without printing the token;
4. create the session with the browser client for the authenticated user;
5. send one message and show the user bubble immediately;
6. show a bounded active state with elapsed time;
7. render the assistant or typed UI response;
8. ensure the page does not blank or lose the conversation;
9. refresh and confirm intended persistence/resume behavior;
10. force one safe failure and confirm a useful retry state replaces the spinner.

For a progressive report, verify the first message does not reveal every empty section. Each answer or tool result should add or replace one meaningful section.

## Completion receipt

Create `AGENT_SETUP.md` in the application repo:

```md
# Agent setup receipt

- Status: LIVE / VERIFIED
- Verified at: YYYY-MM-DD HH:MM TZ
- Workspace / environment: ... / development
- SDK version: ...
- Agent: ... @ revision ...
- Stable model ID: ...
- Skills: ...
- Ordinary tools: ...
- MCP servers / snapshots / enabled tools: ...
- Agents API key: scope and secret location only (never the value)
- Browser origin and delegated revision: ...
- Local command: ...
- Smoke session / turn: ... / ...
- Timing: first event ...s; completed ...s; tool ...s
- UI checks: ...
- Remaining blockers: none / exact blocker
```

Use **LIVE / VERIFIED** only when both direct runtime and application UI checks pass for the exact revision. Otherwise use **IN PROGRESS**, **AWAITING APPROVAL**, or **BLOCKED** and name the missing proof.
