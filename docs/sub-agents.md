# Sub-agents — Retrospective Lab

**Org goal:** Three focused roles — **Exploration**, **Execution**, **Verification** — with clear handoffs so the parent agent stays thin.

Profiles live in [`.cursor/agents/`](../.cursor/agents/). Parent launches via **Task** tool; skills/commands define when.

---

## Role mapping

| Org role | Agent | File | Job |
|----------|-------|------|-----|
| **Exploration** | `feedback-analyst` | [feedback-analyst.md](../.cursor/agents/feedback-analyst.md) | Themes, strengths, concerns from feedback |
| **Exploration** (report) | `insights-visualizer` | [insights-visualizer.md](../.cursor/agents/insights-visualizer.md) | Chart JSON for Insights at a Glance |
| **Execution** | `improvement-advisor` | [improvement-advisor.md](../.cursor/agents/improvement-advisor.md) | `suggestedActions` only |
| **Verification** | `verifier` | [verifier.md](../.cursor/agents/verifier.md) | Tests, schema, privacy pass/fail |

**Primary trio for org sign-off:** `feedback-analyst` → `improvement-advisor` → `verifier`.

`/review-actions` uses parent + checklist (no separate `action-reviewer` in v1).

---

## Profile template (each agent file)

Each profile answers five questions for the parent and humans, then pins contracts the orchestrator relies on.

| Section | Answers |
|---------|---------|
| **Role** | What is this agent responsible for? |
| **Scope** (**Do** / **Never**) | What it should and must not do |
| **Context** | Paths, contracts, rules, sibling agents |
| **Workflow** | Steps to run when invoked |
| **Input** | What parent must pass in the Task prompt |
| **Output** | Exact return shape (schemas, ID rules) |
| **Stop** | When to finish — do not over-delegate |
| **Escalation** | When to return to parent / human |
| **Handoff** | What parent does next (merge, API, next Task) |
| **Final response** | Required `SUBAGENT_SUMMARY:` line for hooks |

**YAML frontmatter** (Cursor + this repo):

| Field | Purpose |
|-------|---------|
| `name` | Matches Task `subagent_type` (defaults from filename if omitted) |
| `description` | Short trigger for delegation — include **when to use** (see [Cursor subagents](https://cursor.com/docs/subagents.md)) |
| `role` | `exploration`, `execution`, or `verification` (org convention) |
| `readonly` | `true` for read-only exploration/execution; `false` for **verifier** (`npm test`) |

Keep prompts focused (one job per file). Parent handoff diagrams below stay in this doc — agent files only describe that agent’s handoff line.

---

## Handoff: `/analyze-retro`

```text
Parent
  ├─ Task → feedback-analyst     (explore feedback)
  ├─ Task → improvement-advisor  (execute: suggestedActions)
  ├─ Parent merge + POST /analysis/import
  └─ Task → verifier               (verify import + npm test)
```

**Parent must not:** inline theme clustering, write suggested actions, or skip Task launches.

Skill: [analyze-retrospective](../.cursor/skills/analyze-retrospective/SKILL.md)  
Command: [analyze-retro.md](../.cursor/commands/analyze-retro.md)

---

## Handoff: `/generate-report`

```text
Parent
  ├─ Task → insights-visualizer  (explore chart data)
  ├─ Parent import insights + POST /report/generate
  └─ Task → verifier               (privacy + ID check)
```

Skill: [generate-retro-report](../.cursor/skills/generate-retro-report/SKILL.md)

---

## Observability

Hook `subagentStop` → [`.cursor/logs/subagent-activity.log`](../.cursor/logs/README.txt) (gitignored).

Each sub-agent ends with:

```text
SUBAGENT_SUMMARY: <one line>
```

---

## Golden-path evidence

End-to-end test checklist: [`sub-agents-golden-path.md`](sub-agents-golden-path.md).

Colleague runbook (analyze flow): [`skills/verify-analyze-retrospective.md`](skills/verify-analyze-retrospective.md).

---

## Parent rules

- One job per sub-agent — no circular re-delegation (analyst → advisor → analyst).
- Sub-agents do not call each other; parent passes outputs forward.
- Human gates stay in parent workflow: `/approve-suggestions`, archive, merge PRs.
