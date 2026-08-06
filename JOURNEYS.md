# Which skill do I run?

**You do not need to remember ten skill names.** You need to know which of two journeys you are on. Everything else follows.

If you are unsure, run **`cs-getting-started`** — it detects where the project actually is and names the single next step.

---

## Journey A — they have an idea

*A call, a recording, a rough description. No code yet.*

```
  cs-plan-app        the idea → core features, sub-features, notes, in CodeSpring
        ▼
  cs-ui-mockup       a clickable local mockup + style guide → review → corrections back into the plan
        ▼
  cs-create-prd      each feature → Frontend + Backend PRDs
        ▼
  cs-create-tasks    each feature → numbered, ordered, dependency-aware tasks
        ▼
  cs-handoff         the client pack: what we're building, the mockup, the plan link, what happens next
        ▼
  ─── they open it in CodeSpring, then in Ferb ───
        ▼
  cs-build-feature   they build, task by task
        ▼
  cs-resync-codebase keep the map honest as the code drifts from it
```

**The order matters in two places.** The mockup comes *before* the PRDs — a PRD generated from a plan nobody has looked at just encodes the misunderstanding in more detail. And the handoff comes *after* the tasks, because the tasks are most of what they are paying for.

---

## Journey B — they have a codebase

*An existing app, usually half-built, usually a mess.*

```
  cs-audit-codebase       is this any good? → plain-English findings + a rebuild-or-fix verdict
        ▼
  cs-import-codebase      the code → core features, sub-features, notes, in CodeSpring
                          (with an audit, it maps the CORRECTED TARGET and turns findings into fix tasks)
        ▼
  cs-create-prd           each feature → PRDs
        ▼
  cs-handoff              the client pack: what's wrong, what it costs, the plan to fix it
        ▼
  ─── they open it in CodeSpring, then in Ferb ───
        ▼
  cs-build-feature        they fix it, task by task
        ▼
  cs-resync-codebase
```

**Audit and import are different jobs and both are needed.**
- **Audit** asks *is this code doing its job?* → `FINDINGS.md` and a verdict. Nothing is written to CodeSpring.
- **Import** writes the map. Given an audit it maps what the app *should* be and turns the findings into fix tasks; without one it just documents what exists.

The audit alone is a sellable deliverable — it is a plain-English report on what is wrong and what it costs.

**`cs-ui-mockup` fits here too**, whenever the fix involves redesigning screens rather than just repairing logic.

---

## The whole pack, one line each

| Skill | Run it when |
|---|---|
| **`cs-getting-started`** | You don't know where you are. Connects, reports state, names one next step. |
| **`cs-plan-app`** | There's no code — just an idea, a call, a recording. |
| **`cs-audit-codebase`** | There's code and you need to know whether it's worth building on. |
| **`cs-import-codebase`** | There's code and you want it on the canvas as features and notes. |
| **`cs-ui-mockup`** | The map and notes exist and it has a user interface. **Before the PRDs.** |
| **`cs-create-prd`** | A feature has a good note and needs build instructions. |
| **`cs-create-tasks`** | A feature has PRDs and needs an ordered task list. |
| **`cs-handoff`** | The plan is done and a client is about to receive it. |
| **`cs-build-feature`** | There are tasks and it's time to write code. |
| **`cs-resync-codebase`** | Code has been built and the map has drifted from it. |
| **`codespring`** | Never directly — it's the shared knowledge the others read. |

---

## The two rules that decide almost everything

**1. Is there code?** No → `cs-plan-app`. Yes → question 2.

**2. Does it do the job?** Not *"do you trust it"* — five specific questions:

1. Does the app do what it actually needs to do?
2. Is it getting things wrong, or presenting made-up figures as fact?
3. Does the architecture allow it to do what it needs to do?
4. Can we build on it scalably?
5. Can users use it without it breaking?

**All five yes → `cs-import-codebase`. Any no → `cs-audit-codebase`.**

*"The code runs" is not the same as "the code does the job."* A vibe-coded app often runs fine and still fails 1–3.

---

## Where things go wrong

- **Generating PRDs before anyone has seen a mockup.** The client agrees to the words, then sees the screens and says something quite different. Everything downstream has to be redone.
- **Importing a broken codebase without auditing it first.** You get an accurate map of a mess, and nothing in it says which parts are wrong.
- **Skipping the notes.** A PRD is only as good as the note it reads. Thin note, thin PRD, thin tasks.
- **Handing over without a handoff.** The client gets a link to a canvas they have never used and no idea what to do with it. The plan is the product — deliver it like one.

---

## Running it as a service

Both journeys are the same shape: **understand → show → plan → hand over → they build.**

| Stage | Journey A (idea) | Journey B (codebase) |
|---|---|---|
| Understand | `cs-plan-app` | `cs-audit-codebase` → `cs-import-codebase` |
| Show | `cs-ui-mockup` | `cs-ui-mockup` (if screens change) |
| Plan | `cs-create-prd` → `cs-create-tasks` | `cs-create-prd` → `cs-create-tasks` |
| Hand over | `cs-handoff` | `cs-handoff` |
| They build | `cs-build-feature` in Ferb | `cs-build-feature` in Ferb |

The middle three are identical. Only the first stage differs, and it differs on one question: **is there code?**
