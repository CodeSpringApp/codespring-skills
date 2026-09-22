# Development and production — plain-English and technical guide

## The simple explanation

Development and production are two separate rooms:

- **Development is the practice room.** Build, break and test here.
- **Production is the live customer room.** Only put a tested setup here.

They live in the same workspace, but they do not share resources. Creating or publishing something in development does not create or publish it in production.

The separation exists so a broken test, cheap experimental model, unsafe tool or unfinished instruction cannot accidentally affect customers.

## How to see the active room

At the top of the dashboard:

```text
use-agent / <workspace> / <environment>
```

The final selector might say `development`, `production`, `staging` or another environment. Check it before every credential, model, agent, tool, skill, knowledge or channel change.

Use this sentence with the person:

> The top bar says **VolkisAI’s Agents / development**. We are changing the practice copy. The live production copy will not change.

## What is separate

Every environment has its own:

- provider keys/connections;
- model IDs and their revisions;
- voice profiles;
- agent drafts and published versions;
- knowledge bases, sources and snapshots;
- skills and skill revisions;
- MCP server connections, credentials and discovery snapshots;
- agent tools and tool revisions;
- API keys;
- allowed browser origins;
- sessions and run history;
- channel deployments/routes;
- environment-bound usage and audit records where applicable.

A resource may use the same friendly ID in both environments, but it is still a separate object with separate credentials and versions.

## What never copies automatically

Creating a new environment starts empty. CodeSpring does not copy secrets, models, agents, knowledge, skills, tools, sessions, API keys, origins or channels from another environment.

This is deliberate. Never solve it by copying a development API key into production. Production needs its own scoped keys and approved origins.

## Who can change what

- Workspace owners/admins can manage sensitive workspace and production setup.
- Developers can normally create/change resources in non-production environments, but production writes are restricted.
- Viewers can inspect but not change.
- Billing roles manage billing access, not agent design.

If a button is missing or disabled, check the active environment and role before assuming the feature is broken.

## Environment types

- A workspace has one protected production environment.
- It has at least one development environment.
- Owners/admins can add non-production development, test or staging environments.
- Production cannot be created again or archived from the dashboard.
- Non-production environments can be archived and restored. Archiving is recoverable; it is not permanent deletion.

## Localhost is not the development environment

These are different ideas:

- **Localhost** is the app running on the person's computer, such as `http://localhost:5173`.
- **Development environment** is the hosted CodeSpring resource room the local app talks to.

A local app can talk to the development runtime when:

1. Settings includes the exact local origin;
2. the server uses a development Agents API key;
3. the key/token permits the exact development agent revision;
4. the frontend uses the CodeSpring browser endpoint and its own `/api/agents/token` server route.

The hosted runtime cannot call a customer tool that exists only on localhost. Customer-hosted tool handlers need public HTTPS even while the chat UI is local.

## Publishing does not mean production

“Publish” means “freeze a numbered version inside the current environment.”

- Publish while `development` is selected -> a development agent version.
- Publish while `production` is selected -> a production agent version.

Publishing in development is not deploying to production. Always say which environment was published.

## Promotion is a checklist, not a button

Current environments are independent. Promote by recreating/reviewing the tested setup in production, not by assuming it copied.

### Before touching production

Create a development receipt containing:

- exact provider/model choices;
- model and voice profile IDs;
- agent instructions and limits;
- knowledge source names/snapshot IDs;
- skill IDs/revisions;
- MCP server IDs, reviewed snapshots and enabled tools;
- agent tool IDs/revisions;
- successful Playground session and event replay;
- successful local application smoke;
- expected cost/risk and rollback plan.

### Production promotion order

1. Switch the top bar to the correct workspace and **production**. Say this aloud.
2. Add/validate production provider credentials through the secure form.
3. Create/publish the intended production model ID revisions.
4. Create/publish voice profiles if required.
5. Create the production knowledge bases and add/review sources.
6. Upload/install the production skill revisions.
7. Add and authorize production MCP servers; review discovered tool snapshots.
8. Deploy/register production customer-hosted tool handlers and exact revisions.
9. Create/update the production agent draft with the reviewed resources.
10. Publish the production agent version.
11. Run a production Playground smoke with non-sensitive test data.
12. Inspect Sessions for terminal events, expected model and tool evidence.
13. Add only the real HTTPS customer origins in Settings.
14. Create a production application-backend API key with the minimum scopes and exact allowed agent revision.
15. Put that key in the production host's secret settings—not source control.
16. Deploy/update the application to reference the production agent version.
17. Smoke the real production UI and one safe error path.
18. Only then update channels/routes to the new production agent version.

## Keeping the rooms lined up

“Lined up” should mean the intended behavior matches, not that every ID happens to look the same.

Maintain an environment table in `AGENT_SETUP.md`:

| Resource | Development | Production | In sync? |
|---|---|---|---|
| Model ID | `research-chat` rev … | `research-chat` rev … | yes/no |
| Agent | `research-agent@…` | `research-agent@…` | yes/no |
| Knowledge | snapshot … | snapshot … | yes/no |
| Skills | IDs/revisions | IDs/revisions | yes/no |
| MCP | server/snapshot/tools | server/snapshot/tools | yes/no |
| Agent tools | IDs/revisions | IDs/revisions | yes/no |
| Browser origins | local URLs | real HTTPS URLs | intentionally different |
| API key | secret location/scopes | secret location/scopes | intentionally different |
| Last smoke | session/turn/time | session/turn/time | yes/no |

Never put secret values in this table.

## What to say when the person asks “Why is it missing?”

Say:

> You are looking in **production**, but we built that agent in **development**. CodeSpring keeps those rooms separate so tests cannot break the live app. Nothing has been deleted. Switch the top environment menu back to **development** to see it. When it is fully tested, we will set up and verify the production copy carefully.

## What to say when the person asks “Why must I publish again?”

Say:

> The editable draft changed, but the running version is frozen so old conversations do not change underneath people. Publishing creates a new numbered version. Then we point a new test session—or the live app—at that version on purpose.
