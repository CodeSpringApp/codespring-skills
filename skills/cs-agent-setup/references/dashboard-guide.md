# CodeSpring Agents dashboard — plain-English guide

Use this guide when the person is looking at `agents.codespring.app`. Do not assume they know software terms.

## The whole product in one picture

```text
AI provider account
      ↓
Provider key gives CodeSpring permission to use it
      ↓
Model ID gives that AI brain a stable nickname
      ↓
Agent combines the brain + job instructions + knowledge + skills + tools
      ↓
Publish freezes a numbered version
      ↓
Playground tests that frozen version
      ↓
API key lets the person's own app use that version safely
```

The agent is not the chat box. The agent is the hosted worker behind the chat box. The person's app supplies the screen and sends messages to that worker.

## Words to translate before using them

| Product word | Say this first |
|---|---|
| Agent | “A saved AI worker with one job.” |
| Model | “The AI brain that decides and writes the answer.” |
| Provider | “The company supplying that AI brain, such as OpenAI, Anthropic or OpenRouter.” |
| Provider key | “The private password that lets CodeSpring use your provider account. That provider normally charges you for the model calls.” |
| Model ID | “A stable nickname for one chosen AI model. Your agent uses the nickname, so app code does not need the private key.” |
| Voice profile | “The separate settings for hearing speech and speaking back. It is not the conversation brain.” |
| Instructions | “The agent’s job description and rules.” |
| Skill | “A reusable playbook that teaches the agent how to do a kind of work. It is not a live data connection.” |
| Knowledge | “The trusted documents the agent can look up while answering. Adding knowledge does not retrain the AI model.” |
| Tool | “A safe action the agent is allowed to take, such as searching a database or saving a report.” |
| MCP server | “A plug that gives the agent a set of tools from another service.” |
| API | “A private doorway software uses to talk to other software.” |
| API key | “A private pass kept on your app’s server. It lets the app start approved agent sessions.” |
| Client token | “A short-lived visitor pass your server gives the browser. It expires quickly and is safer than exposing the API key.” |
| Draft | “Your editable working copy.” |
| Publish | “Freeze the working copy into a numbered version that can run.” |
| Revision/version | “One frozen copy, such as `research-agent@3`.” |
| Session | “One saved conversation with one frozen agent version.” |
| Playground | “The test chat inside CodeSpring.” |
| CLI | “A small command-line helper the coding agent uses. The person normally only approves its login code.” |
| SDK | “The CodeSpring code package installed inside the app so it can talk to the hosted agent.” |
| Codebase/repository | “The project’s code folder. GitHub is one place that folder can be stored online.” |
| Environment | “A separate room. Development is the practice room; production is the live customer room.” |

## The top bar comes first

The top bar contains two selectors:

1. **Workspace** — which business/account owns the resources.
2. **Environment** — which separate room you are editing, normally `development` or `production`.

Say both out loud before any change:

> We are in **Sebastian Agents / development**. Nothing we do here changes the live production setup.

If the person cannot find a resource, check these selectors before creating another copy.

## What every left-sidebar page is for

### Overview

This is the summary page. Use it to confirm the selected workspace/environment and see high-level runtime state. Do not use it as proof that one particular agent revision or tool works.

### Builder

This is the guided helper for planning an agent from a plain-language job. It can propose compatible resources and show changes before publication. It is useful for a new setup, but the final resources still live in Models, Agents, Skills, Knowledge, MCP servers and Agent tools.

### Agents

This is where the saved AI workers live.

An agent draft chooses:

- one conversation model ID;
- optional voice profile;
- instructions;
- knowledge bases;
- skills;
- MCP servers and enabled tools;
- CodeSpring agent tools;
- model-step and tool-call limits.

**Save draft** only changes the editable copy. **Publish version** freezes it into a runnable version. Existing versions and sessions do not change.

When guiding the person, say:

> Open **Agents**, open **Research agent**, click **Edit draft**, choose the model/skills/tools, then **Save draft**. That still is not live. Click **Publish changes** to create the new numbered version.

The agent detail page shows both **Draft model ID** and **Current version**. If it warns that Playground uses an older version, publish the draft before testing.

### Playground

This is CodeSpring’s test bench.

- It lists active agents that have a published version.
- It starts a real, metered session.
- It tests the current **published** version, not unpublished draft changes.
- It tests hosted behavior: instructions, model, skills, knowledge and tools.
- It does not prove the person's custom local page, left-hand report, charts or app token endpoint work. Test those in the actual app afterward.

When a skill, model, knowledge base or tool changes: publish the changed resource if needed, republish the agent, then start a **new Playground session** against the new version. An existing session remains pinned to the old agent version.

### Sessions

This is the black-box recorder for conversations.

Use it when the chat appears stuck or wrong. Filter by the exact agent revision, open the session, then inspect run state and event history. Look for a terminal event:

- `turn.completed` — the turn finished;
- `turn.failed` — it failed; capture the failure code/message;
- `turn.cancelled` — it was stopped.

“Waiting for the agent” is a screen state, not a diagnosis. The Sessions page tells you what actually happened.

### Channels

This connects a published agent to places such as Slack or a phone route. A channel is pinned to an agent version. Publishing a newer agent does not silently move an existing channel to it; inspect/update the channel deployment deliberately.

### Models

This page has three different sections. They are not interchangeable.

#### Provider keys

This stores the private provider credential and the list of raw provider models that credential is allowed to use.

Plain English:

> This connects the AI shop account. It does not yet tell an agent which brain to use.

Add the key only through the secure password field. Give it a human label such as `Sebastian OpenRouter`. Enter full provider model IDs in **Allowed model IDs**. Success is a row marked `active`. `pending validation` is not ready; `invalid` means calls will fail.

Rotating replaces the secret behind the same connection. Revoking stops future calls that depend on it.

#### Model IDs

This creates the stable nickname an agent selects.

Current dashboard behavior: one model ID revision selects one provider key and one provider model. One agent draft selects one conversation model ID. To use different conversation models for different jobs, create separate model IDs and assign them to different agents or publish a new agent version after switching. Do not promise automatic multi-model routing/fallback unless the current model-ID form explicitly offers it.

Example:

```text
Provider key: Sebastian OpenRouter
Raw provider model: openai/gpt-5.6-luna
Stable model ID: research-chat
Agent draft chooses: research-chat
```

Publishing a new model-ID revision does not rewrite an already-published agent version. Republish the agent so it pins the intended model-profile revision.

#### Voice profiles

This is separate from the conversation model. It pins:

- speech-to-text model: turns audio into words;
- text-to-speech model: turns the answer into audio;
- voice;
- interruption and endpointing behavior;
- audio/transcript retention settings.

A text chat agent does not need one. Attach it to the agent draft only when speech is required, then republish the agent.

### Knowledge

Knowledge is a private searchable library of trusted documents. It does **not** train or change the base AI model.

Basic flow:

1. Click **New knowledge base**.
2. Choose the engine and give it a clear name/description.
3. Open **Sources** and upload a supported file or paste reviewed Markdown.
4. Use **Test** to search the library and inspect the exact passages/citations returned.
5. Open the agent, attach the knowledge base to its draft, save and publish the agent.

Adding/removing a source creates a new knowledge snapshot. Old published agents keep their pinned snapshot. Republish the agent to use the updated knowledge.

Use Skills for “how to work”; use Knowledge for “facts to look up.”

### Skills

A skill is a folder with a root `SKILL.md` and optional references/assets/scripts. It is a reusable playbook, not model training and not an API connection.

Create one by:

- uploading a complete skill folder;
- uploading a ZIP;
- pasting a standalone `SKILL.md` when there are no extra files;
- or installing one from Marketplace.

The dashboard validates it and publishes an immutable skill revision. To update it, open the skill, click **Publish revision**, upload the new package, then republish every agent that should pin the new skill revision. Existing agent versions do not silently change.

The activation context budget limits how much skill text can be loaded into a turn. Keep the main `SKILL.md` concise and put detailed conditional material in references.

### Marketplace

This is a catalogue of ready-made skills or agent blueprints. Installing one creates a resource in the current environment. Review it before attaching/publishing; installation does not automatically grant tools or production access.

### MCP servers

An MCP server is a plug supplied by another service. One server can expose many live tools.

Basic flow:

1. Add the server using the provider's current official endpoint.
2. Complete its login/secret step.
3. Refresh discovery so CodeSpring can see the server's tool list.
4. Open the agent draft, attach the server and enable only the needed tools.
5. Save and publish the agent.
6. Test a prompt that clearly requires one selected tool.

Refreshing the server does not silently give an agent new tools. The agent stays pinned to the reviewed snapshot until a new snapshot/tool selection is adopted and the agent is republished.

### Agent tools

These are individual tools the product team exposes itself.

- **HTTPS read** calls a bounded public HTTPS endpoint for read-only data.
- **Customer-hosted Node tool** calls signed code running on the customer's server and can support safe reads or idempotent writes.

The hosted runtime cannot call `localhost`. Deploy the handler first, register its exact HTTPS URL and revision, attach it to the agent draft, then publish the agent.

Use Agent tools for the customer's own app/database. Prefer MCP when an outside service already supplies a suitable MCP server.

### API keys

These are passes for trusted server code and automation. They are not provider keys.

Common presets:

- **Application backend** — run sessions and mint short-lived browser tokens.
- **Control plane — read only** — inspect resources without changing them.
- **Control plane — publish** — automation that can create/publish resources and run smoke sessions.

Restrict keys to the minimum scopes and agent revisions. Show the secret once, store it in the app's secret/environment settings, and never paste it into chat, browser code or Git.

### Usage and credits

This shows CodeSpring runtime usage/credit state. It is separate from charges billed directly by the model provider through the provider key. A positive CodeSpring balance does not prove the provider key is valid or free from provider-side rate limits.

### Members

This controls who can access the workspace and their role. Owners/admins can manage more sensitive resources. Developers can usually write in non-production environments but not production.

### Settings

This controls workspace identity, environments and allowed browser origins.

Allowed origin means the exact website allowed to request browser tokens, for example `http://localhost:5173` in development or `https://app.example.com` in production. Production origins require HTTPS. Scheme and port matter; `http://localhost:5173` is different from `http://127.0.0.1:5173`.

## The safest setup order

Do this in **development** first:

1. Top bar: select the correct workspace and `development`.
2. **Models → Provider keys:** add/validate provider access.
3. **Models → Model IDs:** create the stable conversation-model nickname.
4. **Models → Voice profiles:** only if the agent must hear/speak.
5. **Knowledge:** create/test trusted facts if needed.
6. **Skills/Marketplace:** add reusable playbooks if needed.
7. **MCP servers/Agent tools:** add real capabilities if needed.
8. **Agents:** create/edit the draft and attach the chosen resources.
9. **Agents:** publish a version.
10. **Playground:** start a new session and test one capability at a time.
11. **Sessions:** inspect the replay if anything is slow or wrong.
12. **Settings:** add the exact local browser origin.
13. **API keys:** create an application-backend key restricted to the published agent version.
14. Install/connect the SDK in the app and test the actual local UI.
15. Repeat the controlled promotion checklist for production; development resources are not copied automatically.

## Local app versus dashboard

Keep these two halves separate:

| Dashboard/hosted half | Local app half |
|---|---|
| Model routes, agent instructions, knowledge, skills, tools, published versions, sessions | The chat panel, report/cards/charts, `/api/agents/token`, app login, database and local styling |

Changing local React code does not update the hosted agent. Changing the hosted draft does not update the local app's selected revision. After publishing a new agent version:

1. allow that revision in the application API key/client-token request;
2. update the app's agent reference if the revision is explicit;
3. restart the local dev server after environment changes;
4. start a fresh session;
5. test the app UI separately from Playground.

## How to guide a non-technical person

Bad:

> Publish the model ID and connect the MCP, then update your client token endpoint.

Good:

> We are in **development**, so this cannot affect customers. Open **Models**. Under **Model IDs**, find `research-chat` and click **Publish**. This freezes the AI brain choice into a version. When the row shows **active**, tell me and I will handle the next connection.

Do not give the next five steps until this one is complete. Keep the full technical checklist privately and move the person through it one visible result at a time.
