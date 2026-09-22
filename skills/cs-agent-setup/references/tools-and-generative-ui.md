# Tools, research data and generative UI

The agent needs executable capabilities for facts and application actions. A skill alone cannot fetch current data.

## Pick the correct mechanism

| Need | Mechanism | Example |
|---|---|---|
| Repeatable reasoning/process | Agent instructions or skill | Interview sequence, evidence standard, verdict rules |
| External live data | MCP tool | Search, SEO metrics, reviews, CRM APIs |
| Application-owned data/action | Customer-hosted tool | Read project record, save a report, book a call |
| Typed chat choice or report card | React generative UI | Buyer options, competitor cards, demand chart |
| Server-owned interactive mini-app | MCP App | A compatible MCP server returns a `ui://` resource |

Do not add a fake “UI tool” merely to draw a card. The model/tool returns typed data; React renders it. Add a customer-hosted UI-oriented tool only when the runtime genuinely needs to emit or persist a typed application event.

## SEO and market research

For search-volume, keyword, SERP or competitor evidence, use one of these paths:

1. **Official MCP server** — verify the provider's current endpoint, register it, complete its required authentication, refresh discovery, inspect the current tool schema, attach only the useful tools, then publish a new agent revision.
2. **Customer-hosted adapter** — create a narrow read-only tool around the provider API when no suitable MCP exists or the app needs a normalized contract.

Do not let the model invent search volume. If a provider is unavailable, say the metric is unavailable and continue with other evidence. Search snippets are discovery evidence, not proof of revenue.

Useful first research tools are usually narrow:

- search the web for the product/problem and recent discussion;
- retrieve keyword/volume/trend data;
- find direct competitors and pricing;
- collect review complaints with URLs and dates;
- save normalized evidence to the report.

Keep raw API/provider data separate from the agent's interpretation. A report card should show source, retrieved-at date, metric definition and caveat where relevant.

## Customer-hosted tool requirements

Use the installed SDK's `customer-tools` skill and example. Non-negotiables:

- model-visible name and description say exactly when to call it;
- bounded JSON schema with `additionalProperties: false` where appropriate;
- read/write risk is honest;
- signed CodeSpring invocation is verified;
- execution is replay-safe by operation ID;
- downstream writes are idempotent too;
- response is bounded and structured;
- secrets and raw sensitive payloads are not logged;
- exact handler revision remains deployed while a published agent or resumable session references it.

The handler must be reachable from the hosted runtime over public HTTPS. A local-only Vite/Next dev route is suitable for local UI, not for hosted tool execution.

## MCP setup checklist

1. Verify the current official endpoint and auth method from the provider.
2. Register in the exact CodeSpring environment.
3. Finish OAuth or add the bounded secret/header connection.
4. Refresh/discover tools and capture the snapshot ID.
5. Inspect names, descriptions and JSON schemas.
6. Select the minimum tool set.
7. Attach the server, reviewed snapshot and enabled tool names to the agent draft.
8. Publish a new agent revision.
9. Run a prompt that unambiguously requires one selected tool.
10. Verify `tool.started`, `tool.completed`, returned evidence and the final answer in replay.

Refreshing a server does not silently change an existing agent draft or published revision. Adopting a new snapshot is an explicit review action. A dashboard count of ordinary tools can be zero while the published revision has MCP tools; inspect its MCP selection rather than relying on one summary badge.

## Progressive report contract

Do not ask the model for a giant report on every turn. Use a small state contract and reveal only populated sections. A typical shape:

```ts
type ResearchPatch = {
  currentRead?: {
    buyer?: string;
    painfulMoment?: string;
    narrowOpening?: string;
  };
  choices?: {
    question: string;
    options: Array<{ id: string; label: string; hint?: string }>;
  };
  demand?: {
    summary: string;
    series?: Array<{ label: string; value: number }>;
    sources: Evidence[];
  };
  competitors?: Array<{
    name: string;
    positioning: string;
    price?: string;
    sourceUrl: string;
  }>;
  evidence?: Evidence[];
  verdict?: {
    state: "not_ready" | "worth_narrowing" | "ready_to_design" | "do_not_build";
    reason: string;
    nextAction: string;
  };
};
```

Validate structured patches at the server boundary. Merge them into application state by section. The React component owns all markup, spacing, colours, charts and interactions.

## Chat choices

Use `AgentGenerativeUI` for bounded prompts such as buyer, problem priority or experience level. The request contains typed options and the user's selection is sent back as normal agent input/state. It never evaluates model-authored HTML, CSS, URLs, handlers or code.

Good choice UI:

- asks one question;
- has two to five plain-language options;
- includes an escape hatch when the set is not truly closed;
- disappears or shows the selected answer after submission;
- advances the report by one visible fact.

## Dynamic report pacing

Stage the report rather than exposing empty furniture:

1. **Idea received** — show the user's one-sentence idea and one next question.
2. **Buyer/problem narrowed** — show a compact current-read card.
3. **Research running** — name the exact tool/action and keep chat usable.
4. **Evidence found** — add competitor, demand or complaint cards with sources.
5. **Recommendation ready** — show a plain verdict, scope and next action.

Empty tabs, arbitrary opportunity scores and decorative charts make the result look finished before it is trustworthy. Hide sections until real data exists.
