# Retrospective Management & Continuous Improvement System
## Complete Implementation Plan for Cursor

**Project status:** Planning  
**Primary purpose:** Learning and teaching Agentic AI concepts across the Software Development Life Cycle (SDLC) using a small real application.  
**Development environment:** Cursor  
**Source control:** GitHub  
**Primary storage:** Local file system  
**External integration:** Google Drive through Model Context Protocol (MCP) for knowledge access and retrospective archive/backup workflows  
**Frontend:** HTML, CSS, Vanilla JavaScript  
**Backend:** Node.js + Express  
**Database:** None  
**Deployment:** None required for Version 1; application runs locally  

---

# 1. Project Vision

Build a small **Retrospective Management & Continuous Improvement System** that helps a software team:

1. Create retrospectives.
2. Collect team feedback.
3. Support anonymous or named feedback.
4. Organize feedback into:
   - Went Well
   - Did Not Go Well
   - Improvement Idea
5. Analyze retrospective feedback.
6. Identify repeated themes.
7. Identify strengths, problems, risks, and improvement opportunities.
8. Suggest action items.
9. Allow humans to approve, edit, reject, assign, and track actions.
10. Generate a retrospective report.
11. Compare retrospectives over time.
12. Archive completed retrospective information to Google Drive.
13. Demonstrate Agentic AI engineering practices using Cursor.

The project is intentionally small. The main objective is **not frontend sophistication**. The objective is to create a realistic teaching example for:

- Multi-repository development
- `AGENTS.md`
- Cursor Rules
- Cursor Commands
- Agent Skills
- Hooks
- Sub-agents
- Model Context Protocol (MCP)
- Agent workflows
- Guardrails
- Cursor Automations
- GitHub integration
- Google Drive integration
- Human-in-the-loop approval

---

# 2. Important Design Principle

The project has two separate layers.

## 2.1 Application Layer

This is the normal web application:

```text
Browser
   |
   v
retro-web
HTML + CSS + JavaScript
   |
   | REST API
   v
retro-api
Node.js + Express
   |
   v
Local JSON + Markdown files
```

The application must work locally without requiring:

- Cloud hosting
- A database
- React
- TypeScript
- Docker
- An external Large Language Model (LLM) API key

## 2.2 Agentic Engineering Layer

Cursor provides the learning environment around the application:

```text
Developer
   |
   v
Cursor Parent Agent
   |
   +-- AGENTS.md
   +-- Rules
   +-- Commands
   +-- Skills
   +-- Sub-agents
   +-- Hooks
   +-- MCP
   +-- Guardrails
   +-- Workflows
   +-- Automations
   |
   v
GitHub + Google Drive + Application repositories
```

This distinction is important.

**Cursor's MCP tools are available to Cursor agents. They are not automatically callable by the running web application.**

Therefore:

- Local application storage is the primary source of truth.
- Cursor agents can use MCP to interact with Google Drive or GitHub.
- A later application-level Google Drive API integration can be added if direct browser/application backup is required.
- Version 1 uses Cursor + MCP for the Google Drive archive learning scenario.

---

# 3. Learning Objectives

By completing the project, the team should understand:

| Concept | What the team should learn |
|---|---|
| Multi-repository | How an agent reasons and works across separate frontend and backend repositories |
| `AGENTS.md` | How repository-level agent instructions are defined |
| Rules | How persistent architecture, coding, testing, privacy, and security constraints are enforced |
| Commands | How developers explicitly invoke repeatable workflows |
| Skills | How reusable agent capabilities are packaged |
| Sub-agents | How work is delegated to specialized agents with isolated context |
| Hooks | How deterministic checks run before/after agent actions |
| MCP | How agents access external systems such as Google Drive and GitHub |
| Workflow | How multiple agent capabilities are orchestrated in a controlled sequence |
| Guardrails | What AI/agents are allowed and not allowed to do |
| Cursor Automation | How events or schedules can start Cloud Agent workflows |
| Human-in-the-loop | Where humans approve plans, reports, actions, merges, and sensitive operations |

---

# 4. Project Scope

## 4.1 Version 1 Must Include

### Retrospective Management
- List retrospectives.
- Create retrospective.
- View retrospective.
- Open retrospective for feedback.
- Close retrospective.
- Archive retrospective.

### Feedback
- Submit feedback.
- Feedback types:
  - `went-well`
  - `did-not-go-well`
  - `improvement`
- Optional display name.
- Anonymous feedback.
- Original feedback text must never be modified.
- Display feedback on retrospective board.

### Analysis
- Generate deterministic baseline analysis from local feedback.
- Store analysis in `analysis.json`.
- Allow Cursor Agent analysis through a command/skill.
- Identify:
  - themes
  - strengths
  - concerns
  - improvement opportunities
  - suggested actions
- Human must review generated suggestions.

### Actions
- Create action manually.
- Create action from approved suggestion.
- Edit action.
- Assign owner as free text.
- Set target date.
- Status:
  - `open`
  - `in-progress`
  - `done`
  - `cancelled`
- Carry open actions into the next retrospective review.

### Reporting
- Generate `report.md`.
- Include:
  - retrospective metadata
  - feedback counts
  - themes
  - strengths
  - concerns
  - approved actions
  - previous action status
  - summary
- Provide a browser view of the report.

### Local Storage
- No database.
- Use JSON and Markdown files.
- One file per feedback item to reduce concurrent-write conflicts.

### Agentic SDLC
- `AGENTS.md`
- project Rules
- Commands
- Skills
- Sub-agents
- Hooks
- MCP configuration documentation
- Guardrails
- Workflow documentation
- GitHub Pull Request workflow
- Cursor Automation design/configuration instructions

---

# 5. Out of Scope for Version 1

Do not implement these unless explicitly requested later:

- React
- Vue
- Angular
- TypeScript
- SQL database
- NoSQL database
- Docker
- Kubernetes
- Cloud hosting
- Single Sign-On (SSO)
- Microsoft Entra ID
- Complex authentication
- Employee performance scoring
- Sentiment scoring of individual employees
- Automatic employee ranking
- Automatic retrospective action approval
- Automatic Pull Request merge
- Automatic production deployment
- Real-time WebSockets
- Mobile application
- Email notifications
- Slack or Microsoft Teams integration
- Production-grade multi-tenant architecture

Keep the project focused.

---

# 6. Repository Strategy

Use **two GitHub repositories**.

## Repository 1: `retro-web`

Purpose: browser user interface.

```text
retro-web/
|
+-- AGENTS.md
+-- README.md
+-- index.html
+-- retrospectives.html
+-- feedback.html
+-- board.html
+-- analysis.html
+-- actions.html
+-- report.html
+-- css/
|   +-- styles.css
+-- js/
|   +-- config.js
|   +-- api.js
|   +-- common.js
|   +-- retrospectives.js
|   +-- feedback.js
|   +-- board.js
|   +-- analysis.js
|   +-- actions.js
|   +-- report.js
+-- tests/
|   +-- ...
+-- .cursor/
    +-- rules/
    |   +-- architecture.mdc
    |   +-- frontend.mdc
    |   +-- testing.mdc
    |   +-- privacy.mdc
    +-- commands/
    |   +-- review-frontend.md
    +-- agents/
    |   +-- frontend-reviewer.md
    +-- skills/
    |   +-- review-ui/
    |       +-- SKILL.md
    +-- hooks.json
    +-- hooks/
        +-- check-files.js
        +-- block-dangerous-command.js
```

## Repository 2: `retro-api`

Purpose: REST API, local files, analysis, reports, actions, and agentic workflow assets.

```text
retro-api/
|
+-- AGENTS.md
+-- README.md
+-- package.json
+-- .env.example
+-- src/
|   +-- server.js
|   +-- app.js
|   +-- config/
|   |   +-- paths.js
|   +-- routes/
|   |   +-- retrospectives.routes.js
|   |   +-- feedback.routes.js
|   |   +-- analysis.routes.js
|   |   +-- actions.routes.js
|   |   +-- reports.routes.js
|   +-- controllers/
|   |   +-- retrospectives.controller.js
|   |   +-- feedback.controller.js
|   |   +-- analysis.controller.js
|   |   +-- actions.controller.js
|   |   +-- reports.controller.js
|   +-- services/
|   |   +-- retrospective.service.js
|   |   +-- feedback.service.js
|   |   +-- analysis.service.js
|   |   +-- action.service.js
|   |   +-- report.service.js
|   |   +-- file-storage.service.js
|   |   +-- id.service.js
|   +-- validators/
|   |   +-- retrospective.validator.js
|   |   +-- feedback.validator.js
|   |   +-- action.validator.js
|   +-- utils/
|       +-- json.js
|       +-- dates.js
|       +-- errors.js
+-- data/
|   +-- teams.json
|   +-- retrospectives/
|       +-- .gitkeep
+-- tests/
|   +-- unit/
|   +-- integration/
+-- docs/
|   +-- architecture.md
|   +-- data-model.md
|   +-- api.md
|   +-- workflow.md
|   +-- guardrails.md
|   +-- teaching-guide.md
+-- .cursor/
    +-- rules/
    |   +-- architecture.mdc
    |   +-- api.mdc
    |   +-- storage.mdc
    |   +-- testing.mdc
    |   +-- privacy.mdc
    |   +-- security.mdc
    +-- commands/
    |   +-- analyze-retro.md
    |   +-- generate-report.md
    |   +-- review-actions.md
    |   +-- prepare-next-retro.md
    |   +-- archive-retro.md
    |   +-- verify-project.md
    +-- skills/
    |   +-- analyze-retrospective/
    |   |   +-- SKILL.md
    |   |   +-- references/
    |   |       +-- analysis-contract.md
    |   +-- cluster-feedback/
    |   |   +-- SKILL.md
    |   +-- generate-actions/
    |   |   +-- SKILL.md
    |   +-- generate-retro-report/
    |   |   +-- SKILL.md
    |   |   +-- assets/
    |   |       +-- report-template.md
    |   +-- archive-retrospective/
    |       +-- SKILL.md
    +-- agents/
    |   +-- feedback-analyst.md
    |   +-- improvement-advisor.md
    |   +-- action-reviewer.md
    |   +-- verifier.md
    +-- hooks.json
    +-- hooks/
    |   +-- audit.js
    |   +-- block-dangerous-command.js
    |   +-- validate-json.js
    |   +-- protect-anonymous-data.js
    +-- mcp.example.json
```

---

# 7. Local Multi-Repository Workspace

Create a parent folder that is **not required to be a Git repository**:

```text
retro-lab/
|
+-- retro-web/
+-- retro-api/
```

Clone both GitHub repositories into `retro-lab`.

Open `retro-lab` in Cursor so the developer can inspect both repositories locally.

For Cursor Cloud Agents later, configure a multi-repository environment containing both GitHub repositories.

Teaching objective:

> One feature can require coordinated frontend and backend changes while each repository keeps its own instructions, rules, tests, and Git history.

---

# 8. Application User Roles

Version 1 does not require authentication. Roles are conceptual.

## Facilitator
Can:
- create retrospective
- close retrospective
- review analysis
- approve suggested actions
- edit actions
- generate report
- archive retrospective

## Team Member
Can:
- submit feedback
- view board after collection rules allow it
- participate in action discussion

Because there is no authentication in Version 1, do not pretend these permissions are secure. They are workflow roles only.

---

# 9. Retrospective Lifecycle

Use these statuses:

```text
draft
open
closed
analyzed
actioned
archived
```

Allowed transitions:

```text
draft
  |
  v
open
  |
  v
closed
  |
  v
analyzed
  |
  v
actioned
  |
  v
archived
```

Rules:

- Feedback can be submitted only when status is `open`.
- Analysis can be generated only when status is `closed`, `analyzed`, or `actioned`.
- Approved actions can be edited until archived.
- Archive is a human-approved operation.
- Archived retrospectives are read-only from normal application operations.

---

# 10. File-Based Storage Design

## 10.1 Root

```text
data/
+-- teams.json
+-- retrospectives/
```

## 10.2 Retrospective Folder

Example:

```text
data/retrospectives/RETRO-2026-001/
|
+-- retro.json
+-- feedback/
|   +-- FB-0001.json
|   +-- FB-0002.json
|   +-- FB-0003.json
+-- analysis.json
+-- actions.json
+-- report.md
+-- audit.jsonl
```

## 10.3 `retro.json`

```json
{
  "id": "RETRO-2026-001",
  "title": "Sprint 25 Retrospective",
  "team": "Demo Team",
  "period": "Sprint 25",
  "status": "open",
  "createdAt": "2026-09-05T12:00:00.000Z",
  "openedAt": "2026-09-05T12:05:00.000Z",
  "closedAt": null,
  "archivedAt": null
}
```

## 10.4 Feedback File

One file per feedback item.

```json
{
  "id": "FB-0001",
  "retroId": "RETRO-2026-001",
  "type": "did-not-go-well",
  "text": "Code reviews were taking too long.",
  "anonymous": true,
  "displayName": null,
  "createdAt": "2026-09-05T12:10:00.000Z"
}
```

Rules:

- `text` is the exact original text.
- Never rewrite `text`.
- `displayName` must be `null` for anonymous feedback.
- Do not store hidden identity fields for anonymous feedback.
- Do not infer identity from content.

## 10.5 `analysis.json`

```json
{
  "retroId": "RETRO-2026-001",
  "version": 1,
  "generatedAt": "2026-09-05T13:00:00.000Z",
  "generatedBy": "deterministic-baseline",
  "feedbackCount": 10,
  "themes": [
    {
      "name": "Code Review",
      "feedbackIds": ["FB-0001", "FB-0006"],
      "summary": "Review turnaround was repeatedly mentioned."
    }
  ],
  "strengths": [],
  "concerns": [],
  "opportunities": [],
  "suggestedActions": [
    {
      "id": "SUG-001",
      "title": "Agree on a Pull Request review response target",
      "reason": "Review delays appeared in multiple feedback items.",
      "sourceFeedbackIds": ["FB-0001", "FB-0006"]
    }
  ],
  "limitations": [
    "Generated suggestions require human review."
  ]
}
```

## 10.6 `actions.json`

```json
{
  "retroId": "RETRO-2026-001",
  "actions": [
    {
      "id": "ACT-0001",
      "title": "Agree on a Pull Request review response target",
      "description": "Discuss and agree on a target response time.",
      "owner": "Team",
      "targetDate": "2026-09-20",
      "status": "open",
      "source": "approved-suggestion",
      "sourceSuggestionId": "SUG-001",
      "createdAt": "2026-09-05T13:30:00.000Z",
      "updatedAt": "2026-09-05T13:30:00.000Z"
    }
  ]
}
```

## 10.7 `audit.jsonl`

Append-only operational audit events.

Example:

```json
{"timestamp":"2026-09-05T12:05:00.000Z","event":"retro.opened","retroId":"RETRO-2026-001"}
{"timestamp":"2026-09-05T13:00:00.000Z","event":"analysis.generated","retroId":"RETRO-2026-001"}
```

Do not put anonymous author identity in audit data.

---

# 11. File Safety Requirements

All file operations must follow these rules:

1. Application code may only read/write under the configured `data/` directory.
2. Reject path traversal such as `../`.
3. IDs must match strict regular expressions.
4. JSON writes must be atomic where practical:
   - write temporary file
   - validate
   - rename over target
5. Never silently overwrite feedback.
6. Feedback IDs must be unique.
7. Invalid JSON must produce a controlled error.
8. The server must not expose arbitrary local files.
9. Archive must not delete local files.
10. Never write secrets into `data/`.

---

# 12. REST API

Base URL:

```text
http://localhost:3001/api
```

## 12.1 Retrospectives

### GET `/retrospectives`
Return retrospective summaries.

### POST `/retrospectives`
Create retrospective.

Request:

```json
{
  "title": "Sprint 25 Retrospective",
  "team": "Demo Team",
  "period": "Sprint 25"
}
```

### GET `/retrospectives/:retroId`
Return retrospective metadata.

### POST `/retrospectives/:retroId/open`
Change `draft` to `open`.

### POST `/retrospectives/:retroId/close`
Change `open` to `closed`.

### POST `/retrospectives/:retroId/archive`
Mark retrospective archived only after validations pass.

---

## 12.2 Feedback

### GET `/retrospectives/:retroId/feedback`
Return feedback items.

### POST `/retrospectives/:retroId/feedback`

Request:

```json
{
  "type": "went-well",
  "text": "Testing started earlier this sprint.",
  "anonymous": true,
  "displayName": null
}
```

Validation:
- retrospective must be `open`
- valid type
- non-empty text
- reasonable maximum length
- named feedback requires display name
- anonymous feedback forces display name to `null`

---

## 12.3 Analysis

### GET `/retrospectives/:retroId/analysis`
Return analysis if available.

### POST `/retrospectives/:retroId/analysis/generate`
Run deterministic baseline analysis.

This is not a claim of advanced Artificial Intelligence. It provides a working local fallback.

The Cursor Agent workflow can later create a richer `analysis.json` while respecting the same schema.

---

## 12.4 Actions

### GET `/retrospectives/:retroId/actions`

### POST `/retrospectives/:retroId/actions`

### PUT `/retrospectives/:retroId/actions/:actionId`

### POST `/retrospectives/:retroId/actions/from-suggestion/:suggestionId`

Human approval is required before a suggestion becomes an action.

---

## 12.5 Reports

### GET `/retrospectives/:retroId/report`
Return Markdown report text or structured representation.

### POST `/retrospectives/:retroId/report/generate`
Generate/update `report.md`.

---

# 13. Frontend Pages

Use plain HTML, CSS, and Vanilla JavaScript.

Use a simple consistent navigation bar.

## 13.1 `index.html`
Dashboard.

Show:
- total retrospectives
- current open retrospective
- open actions
- latest retrospective
- quick links

## 13.2 `retrospectives.html`
Show:
- list/table of retrospectives
- title
- period
- status
- feedback count
- action count
- View button
- Create Retrospective form

## 13.3 `feedback.html`
Show:
- retrospective title
- status
- feedback type selector
- feedback textarea
- anonymous checkbox
- display name only when not anonymous
- submit button
- validation messages

## 13.4 `board.html`
Three columns:

```text
Went Well | Did Not Go Well | Improvement Ideas
```

Display feedback cards.

Anonymous card must display:

```text
Anonymous
```

Never show hidden identity information.

## 13.5 `analysis.html`
Show:
- feedback count
- themes
- strengths
- concerns
- opportunities
- suggested actions
- generation metadata
- limitations
- "Generate Baseline Analysis" button
- buttons to approve selected suggestions into actions

## 13.6 `actions.html`
Show:
- action
- owner
- target date
- status
- source
- edit controls
- previous retrospective open actions section

## 13.7 `report.html`
Render `report.md` in a readable way.

A simple Markdown renderer dependency may be used only if needed. Otherwise generate HTML from known report sections on the frontend.

---

# 14. Baseline Analysis

The application must work without an external AI model.

Implement a deliberately simple deterministic analyzer.

Possible behavior:

1. Normalize text for matching without altering stored original feedback.
2. Use a small configurable keyword/theme dictionary.
3. Count repeated terms/themes.
4. Separate positive feedback from concerns based mainly on feedback type, not sentiment prediction.
5. Generate generic suggested actions from matched themes.
6. Always mark output as:
   - `generatedBy: "deterministic-baseline"`
7. Add a limitation explaining that human review is required.

Example theme dictionary:

```json
{
  "code-review": ["code review", "pull request", "pr review", "review delay"],
  "testing": ["test", "testing", "regression", "qa"],
  "deployment": ["deploy", "deployment", "release", "pipeline"],
  "requirements": ["requirement", "acceptance criteria", "scope", "refinement"],
  "communication": ["communication", "meeting", "handoff", "alignment"]
}
```

This analyzer exists only to keep the application fully functional.

A Cursor Agent can later produce a richer analysis using Skills/Sub-agents.

---

# 15. Retrospective Report

Generate Markdown with this structure:

```markdown
# Sprint 25 Retrospective Report

## Overview

## Participation
- Total feedback:
- Went well:
- Did not go well:
- Improvement ideas:

## What Went Well

## Main Themes

## Concerns

## Improvement Opportunities

## Approved Actions

## Previous Actions Follow-up

## Observations Across Retrospectives

## Limitations

## Generated Information
```

Rules:
- Do not name anonymous feedback authors.
- Do not include unsupported personal conclusions.
- Clearly distinguish raw feedback, generated summaries, and approved human actions.
- Preserve references to feedback IDs where useful for traceability.

---

# 16. Historical Improvement View

After at least two retrospectives exist, implement a basic comparison service.

Questions it should answer deterministically:

- Which theme appeared in multiple retrospectives?
- Which actions remain open?
- Which actions were completed?
- How many actions were created vs completed?
- Which feedback categories changed in count?
- What topics repeated?

Do not claim causality.

Bad:

> "Action ACT-001 caused testing quality to improve."

Better:

> "Testing-related negative feedback decreased after ACT-001 was completed. This is an observation, not proof of causality."

---

# 17. `AGENTS.md`

Each repository must have its own `AGENTS.md`.

## 17.1 `retro-web/AGENTS.md`

Must explain:

- repository purpose
- technology stack
- no React/TypeScript
- frontend must use API, never direct local file access
- accessibility expectations
- no secrets
- keep JavaScript modular
- error handling
- tests required for important behavior
- do not introduce a framework without approval
- preserve simple teaching-oriented code

## 17.2 `retro-api/AGENTS.md`

Must explain:

- repository purpose
- architecture boundaries
- routes -> controllers -> services -> storage
- file storage restrictions
- anonymous feedback protections
- no database
- no direct Google Drive dependency in core application
- no production deployment
- tests required
- human approval rules
- report/analysis contracts
- exact original feedback must never be rewritten

Teaching point:

> `AGENTS.md` explains how an agent should work in a repository.

---

# 18. Cursor Rules

Current Cursor project Rules belong in:

```text
.cursor/rules/*.mdc
```

Use focused rules.

## 18.1 `architecture.mdc`
Always apply.

Enforce:
- repository responsibility
- layering
- no circular dependencies
- no business logic in route files

## 18.2 `storage.mdc`
Apply to storage/service files.

Enforce:
- data directory boundary
- safe IDs
- atomic writes
- no database
- no arbitrary path access

## 18.3 `privacy.mdc`
Always apply.

Enforce:
- never deanonymize anonymous feedback
- no hidden identity fields
- no employee ranking
- no performance evaluation inference
- no blame attribution

## 18.4 `testing.mdc`
Apply to source/test changes.

Enforce:
- bug fixes require regression test
- new service behavior requires unit tests
- API changes require integration test
- tests must not be deleted merely to make build pass

## 18.5 `security.mdc`
Always apply.

Enforce:
- no hardcoded secrets
- validate external input
- block path traversal
- no `eval`
- avoid command construction from user input

## 18.6 `frontend.mdc`
Frontend only.

Enforce:
- Vanilla JavaScript
- semantic HTML
- accessible labels
- visible error states
- no direct filesystem access

Teaching point:

> Rules define persistent constraints and standards.

---

# 19. Cursor Commands

Custom commands belong in:

```text
.cursor/commands/
```

Create the following explicit commands.

## `/analyze-retro`

Purpose:
- analyze one closed retrospective
- read local feedback
- use analysis Skills
- delegate to Feedback Analyst when useful
- produce analysis output matching `analysis.json`
- do not create approved actions

Required argument:
- retrospective ID

## `/generate-report`

Purpose:
- generate/update `report.md`
- use current analysis and approved actions
- preserve traceability
- verify privacy rules

## `/review-actions`

Purpose:
- review proposed/approved actions
- check they are specific and measurable
- identify duplicates or vague actions
- make recommendations only
- never close/cancel an action automatically

## `/prepare-next-retro`

Purpose:
- inspect previous retrospective
- list unfinished actions
- identify recurring themes
- prepare a facilitator briefing

## `/archive-retro`

Purpose:
- validate retrospective is ready
- generate final report
- use Google Drive MCP if configured
- upload/archive retrospective files
- do not delete local files
- report exactly what succeeded/failed

## `/verify-project`

Purpose:
- run tests
- validate JSON
- check required files
- inspect guardrails
- report incomplete items

Teaching point:

> Commands are explicit developer-triggered entry points.

---

# 20. Agent Skills

Use:

```text
.cursor/skills/<skill-name>/SKILL.md
```

Each `SKILL.md` should contain YAML frontmatter with at least:

```yaml
---
name: skill-name
description: Describe what the skill does and when it should be used.
---
```

## 20.1 `analyze-retrospective`

Responsibilities:
- validate retrospective state
- read feedback
- preserve originals
- identify themes
- distinguish observations from assumptions
- produce structured analysis
- include limitations
- never infer anonymous authors

## 20.2 `cluster-feedback`

Responsibilities:
- group semantically similar feedback
- preserve feedback IDs
- do not combine contradictory feedback into one statement without noting disagreement
- return cluster title, evidence IDs, and concise summary

## 20.3 `generate-actions`

Responsibilities:
- turn issues into suggested actions
- action must be specific
- action should have measurable completion condition where possible
- never assign an employee unless the human already selected the owner
- never approve suggestions

## 20.4 `generate-retro-report`

Responsibilities:
- use report template
- include evidence/IDs
- distinguish:
  - original feedback
  - analysis
  - suggested actions
  - approved actions
- apply privacy guardrails

## 20.5 `archive-retrospective`

Responsibilities:
- validate archive readiness
- generate final report first
- use Google Drive MCP only when configured
- create predictable folder naming
- verify upload result
- never delete local source files
- never place credentials in the repository

Teaching point:

> A Skill defines **how a reusable capability is performed**.

---

# 21. Sub-agents

Project sub-agents belong in:

```text
.cursor/agents/
```

Start with four only.

## 21.1 `feedback-analyst.md`

Role:
- analyze feedback
- detect themes
- cite feedback IDs
- highlight contradictory feedback
- avoid personal conclusions

Output contract:
- themes
- strengths
- concerns
- opportunities
- evidence IDs
- limitations

## 21.2 `improvement-advisor.md`

Role:
- receive analysis, not raw identity data
- suggest improvement options
- explain rationale
- produce multiple possible actions when appropriate
- never approve or assign actions

## 21.3 `action-reviewer.md`

Role:
- inspect proposed actions
- identify vague wording
- check measurable completion
- identify duplicates
- check whether action addresses evidence

## 21.4 `verifier.md`

Role:
- independently verify completed development work
- run tests
- inspect acceptance criteria
- identify unimplemented claims
- be skeptical
- report pass/fail evidence

Teaching point:

> Sub-agents provide specialization and context isolation. Do not create a sub-agent for a one-step task that belongs in a Skill.

---

# 22. Parent-Agent Workflow

Use an orchestrator pattern.

Example analysis workflow:

```text
Developer runs /analyze-retro RETRO-2026-001
        |
        v
Parent Agent
        |
        +-- Validate retrospective
        |
        +-- Invoke analyze-retrospective Skill
        |
        +-- Delegate theme analysis
        |      to feedback-analyst
        |
        +-- Delegate improvement ideas
        |      to improvement-advisor
        |
        +-- Validate result against schema
        |
        +-- Apply privacy guardrails
        |
        +-- Write analysis.json
        |
        +-- Delegate verification
               to verifier
        |
        v
Developer reviews output
```

Human approval comes after agent recommendations.

---

# 23. Hooks

Project hooks use:

```text
.cursor/hooks.json
```

Hook scripts:

```text
.cursor/hooks/
```

Implement hooks gradually.

## 23.1 `beforeShellExecution`

Script:
`block-dangerous-command.js`

Block or require manual handling for examples such as:
- destructive recursive deletes
- force push
- commands targeting parent directories
- commands attempting to expose environment secrets

Do not rely on string matching as the only enterprise security control. This is a teaching guardrail.

## 23.2 `afterFileEdit`

Script:
`validate-json.js`

When agent changes relevant JSON fixtures/data/schema examples:
- validate JSON syntax
- fail clearly on invalid structure

Do not run expensive full tests after every single edit.

## 23.3 `beforeMCPExecution`

Script:
`audit.js`

Record:
- time
- MCP server/tool metadata if supplied by hook input
- purpose category

Never log credentials or sensitive payloads.

## 23.4 `afterMCPExecution`

Script:
`audit.js`

Record success/failure metadata only.

## 23.5 `subagentStart` / `subagentStop`

Use audit hook to demonstrate sub-agent lifecycle visibility.

## 23.6 `stop`

Run a lightweight final verification:
- changed JSON files valid
- no forbidden secret files added
- summarize if tests still need running

Teaching point:

> Hooks are deterministic controls around probabilistic agent behavior.

---

# 24. Guardrails

Guardrails exist at multiple layers.

## 24.1 Domain Guardrails

AI/agents must never:

- attempt to identify anonymous authors
- rank employees
- classify employee performance
- assign blame to individuals
- recommend employment actions
- fabricate evidence
- modify original feedback
- automatically approve actions
- automatically close actions
- hide contradictory feedback
- claim causality without evidence

## 24.2 Development Guardrails

Agents must never:

- push directly to protected `main`
- force push without explicit human instruction
- merge Pull Requests automatically
- delete repository history
- commit secrets
- remove failing tests just to pass
- change architecture/stack without explicit approval
- add a database in Version 1
- introduce React/TypeScript in Version 1

## 24.3 MCP Guardrails

- Use minimum required permissions.
- Never hardcode OAuth tokens or secrets in `.cursor/mcp.json`.
- Prefer environment variables / secure Cursor configuration.
- Review third-party MCP server code and permissions before use.
- Google Drive archive operations must be limited to the intended folder.
- Archive must be copy/upload, never move/delete local source.
- MCP output must be treated as external data and validated.

## 24.4 Human Approval Gates

Required before:
- converting suggested action to approved action
- archiving a retrospective
- merging Pull Requests
- changing project architecture
- adding a new external integration

---

# 25. Model Context Protocol (MCP)

MCP is used for learning how agents access external tools/data.

Cursor can configure project MCP servers with:

```text
.cursor/mcp.json
```

or personal MCP servers with:

```text
~/.cursor/mcp.json
```

## 25.1 Google Drive MCP Use Cases

Use Google Drive MCP for:

- read retrospective guidelines
- read team working agreements
- read retrospective templates
- archive final report
- archive final retrospective data files
- retrieve previous archived reports when explicitly needed

Suggested Google Drive structure:

```text
Retrospective Management/
|
+-- Knowledge/
|   +-- Retrospective Guidelines
|   +-- Team Working Agreement
|   +-- Action Item Guidelines
|
+-- Archive/
    +-- 2026/
        +-- RETRO-2026-001/
        +-- RETRO-2026-002/
```

## 25.2 Google Drive Is Not the Live Database

Do not make Google Drive the application's primary storage.

Primary:

```text
retro-api/data/
```

Backup/archive:

```text
Google Drive
```

## 25.3 GitHub Integration

GitHub is used for:
- both repositories
- issues
- Pull Requests
- code review
- branch protection
- Cursor Cloud Agent / Automation triggers when available/configured

## 25.4 MCP Configuration Security

Commit:

```text
.cursor/mcp.example.json
```

Do not commit secrets.

If actual `.cursor/mcp.json` contains secrets, add it to `.gitignore`.

Prefer a configuration approach that references environment variables or uses an OAuth flow supported by the selected MCP server.

Because Google Drive MCP servers can be third-party implementations, validate the selected server and its permissions before enabling write access.

---

# 26. Google Drive Archive Workflow

The teaching workflow:

```text
Retrospective status = actioned
        |
        v
Developer runs /archive-retro RETRO-2026-001
        |
        v
Validate local files
        |
        v
Generate final report
        |
        v
Human confirms archive operation
        |
        v
archive-retrospective Skill
        |
        v
Google Drive MCP
        |
        v
Create/use archive folder
        |
        v
Upload:
retro.json
feedback/*.json
analysis.json
actions.json
report.md
        |
        v
Verify files exist
        |
        v
Update local archive metadata/status
```

If MCP is unavailable:
- archive command must fail safely
- local data remains unchanged
- report clearly says Google Drive backup was not completed

Never pretend a backup succeeded.

---

# 27. Cursor Automation

Cursor Automations run Cloud Agents from events or schedules.

Do not make Automation mandatory for local Version 1.

Add it after repositories and GitHub integration work.

## Automation A: Pull Request Review

Trigger:

```text
Pull Request opened or updated
```

Scope:
- `retro-web`
- `retro-api`
- preferably multi-repository environment when the change spans both

Automation prompt should:
1. inspect changed files
2. read applicable `AGENTS.md`
3. apply Rules
4. run relevant tests
5. invoke verifier/review skill
6. check privacy/security/storage constraints
7. comment with findings
8. never merge automatically

## Automation B: Retrospective Action Reminder (weekly email)

Schedule: **Sunday 9:00** — cron `0 9 * * 0`

Data bridge: at archive time, `npm run export:reminder` writes `docs/reminders/latest-reminder.json` to the orchestration repo (committed to git). Cloud Agent cannot read gitignored `retro-api/data/`.

Behavior:

- Read committed snapshot from `IslamFathyy/retro-lab` on `main`
- Email **open approved actions** from the most recently archived retro (`archivedAt` max)
- Send via **Cursor Gmail plugin** (`send_message`) to addresses in `docs/reminders/recipients.json`
- Do not alter action status automatically

Setup: see `docs/cursor-automation-weekly-reminder.md` and skill `weekly-action-reminder`.

For the first teaching implementation, **Automation A is enough**; Automation B is optional after archive + Gmail cloud auth are verified.

---

# 28. GitHub Workflow

Branches:

```text
main
feature/<short-name>
fix/<short-name>
chore/<short-name>
```

Rules:
- no direct feature work on `main`
- Pull Request required
- tests must pass
- human review required
- agent may prepare Pull Request
- human merges

Pull Request template should contain:

```markdown
## Change

## Why

## Repositories Affected

## Tests

## Privacy / Guardrail Check

## File Storage Impact

## Screenshots

## Agentic Assets Changed
- [ ] AGENTS.md
- [ ] Rules
- [ ] Commands
- [ ] Skills
- [ ] Sub-agents
- [ ] Hooks
- [ ] MCP configuration
```

---

# 29. Testing Strategy

Keep testing simple but meaningful.

## 29.1 Backend Unit Tests

Test:
- ID generation
- validators
- storage path safety
- retrospective status transitions
- feedback validation
- anonymous feedback behavior
- analysis baseline
- action status changes
- report generation

## 29.2 Backend Integration Tests

Test:
- create retrospective
- open retrospective
- submit feedback
- close retrospective
- generate analysis
- approve suggestion into action
- update action
- generate report
- archive validation

Use temporary test directories. Tests must never write to real `data/`.

## 29.3 Frontend Tests

Keep lightweight.

Test important functions:
- API error handling
- feedback form validation
- anonymous display-name behavior
- rendering data safely

## 29.4 Manual Acceptance Test

Execute full scenario:

```text
Create Retro
-> Open
-> Submit 6+ feedback items
-> Close
-> Generate analysis
-> Review suggestions
-> Approve 2 actions
-> Update one action
-> Generate report
-> Review previous action behavior
-> Archive through MCP when configured
```

---

# 30. Security and Privacy Tests

Required tests/checks:

1. Reject `../` path traversal in IDs.
2. Anonymous submission persists no display name.
3. API does not expose arbitrary files.
4. HTML rendering escapes user feedback to reduce cross-site scripting risk.
5. Invalid status transitions return errors.
6. Original feedback text remains unchanged after analysis.
7. Archive failure does not delete/change source data.
8. Secrets are absent from Git-tracked files.
9. Hooks do not log secret values.
10. Generated analysis references existing feedback IDs only.

---

# 31. Error Handling

API error format:

```json
{
  "error": {
    "code": "RETRO_NOT_OPEN",
    "message": "Feedback can only be submitted to an open retrospective."
  }
}
```

Use consistent codes.

Examples:

```text
VALIDATION_ERROR
RETRO_NOT_FOUND
RETRO_NOT_OPEN
INVALID_STATUS_TRANSITION
FEEDBACK_NOT_FOUND
ANALYSIS_NOT_AVAILABLE
ACTION_NOT_FOUND
REPORT_GENERATION_FAILED
FILE_STORAGE_ERROR
ARCHIVE_NOT_READY
```

Do not expose stack traces to frontend responses.

---

# 32. Logging

Simple console logging is sufficient for Version 1.

Log:
- request method/path
- result status
- application errors
- retrospective lifecycle changes

Do not log:
- secret values
- OAuth tokens
- full anonymous feedback unnecessarily
- hidden identity metadata

---

# 33. UI Principles

The UI should be:

- simple
- readable
- responsive enough for desktop/tablet
- accessible
- no unnecessary animation
- no UI framework required

Use:
- semantic HTML
- labels for fields
- keyboard-accessible controls
- clear error/success messages
- visible status badges
- confirmation for destructive/state-changing actions

Do not over-design.

---

# 34. Teaching Guide

Create:

```text
docs/teaching-guide.md
```

For every Agentic concept document:

## Concept
Example: Skill

## Simple Definition
A reusable capability that teaches the agent how to perform a specific task.

## Project Example
`analyze-retrospective`

## Why It Is Not a Rule
A rule constrains behavior; a skill teaches a workflow/capability.

## Demo
Show command invoking analysis and Skill usage.

## Lesson
When should engineers use this concept?

Use the same format for:
- Multi-repo
- `AGENTS.md`
- Rules
- Commands
- Skills
- Sub-agents
- Hooks
- MCP
- Workflow
- Guardrails
- Automation

---

# 35. Concept Comparison

Keep this table in the teaching guide:

| Concept | Main Question |
|---|---|
| `AGENTS.md` | How should the agent work in this repository? |
| Rule | What constraint or standard must be followed? |
| Command | What workflow does the developer explicitly want to start? |
| Skill | How should a reusable capability be performed? |
| Sub-agent | Which specialized agent should handle this complex/context-heavy part? |
| Hook | What deterministic code should run before/after an agent event? |
| MCP | What external tool or data source can the agent access? |
| Workflow | In what sequence should work happen? |
| Guardrail | What is the agent allowed or forbidden to do? |
| Automation | What event or schedule should start a Cloud Agent workflow automatically? |

---

# 36. Implementation Phases

Cursor must implement in phases.

Do not implement everything in one uncontrolled change.

## Phase 0 — Repository Bootstrap

### `retro-api`
- initialize npm
- Express
- basic app/server
- health endpoint
- folders
- `.gitignore`
- README
- `AGENTS.md`

### `retro-web`
- base HTML/CSS/JS
- navigation
- API configuration
- README
- `AGENTS.md`

### Acceptance
- API runs
- frontend opens
- frontend can call health endpoint

---

## Phase 1 — File Storage Foundation

Implement:
- path config
- ID validation
- atomic JSON helpers
- retrospective folder creation
- audit append helper
- tests

### Acceptance
- safe local writes
- no path traversal
- tests use temporary directory

---

## Phase 2 — Retrospective CRUD/Lifecycle

Implement:
- create
- list
- get
- open
- close
- status validation
- frontend pages

### Acceptance
- lifecycle works from UI
- invalid transitions rejected

---

## Phase 3 — Feedback Collection

Implement:
- one-file-per-feedback
- anonymous/named
- three categories
- board view
- validation
- tests

### Acceptance
- exact original feedback preserved
- anonymous feedback stores no display name
- closed retrospectives reject new feedback

---

## Phase 4 — Actions

Implement:
- actions file
- create/edit/status
- owner
- target date
- UI
- tests

### Acceptance
- actions persist
- invalid statuses rejected

---

## Phase 5 — Baseline Analysis

Implement:
- deterministic theme dictionary
- analysis service
- `analysis.json`
- suggested actions
- analysis UI
- limitations

### Acceptance
- works without LLM
- original feedback unchanged
- suggestions are not approved automatically

---

## Phase 6 — Report Generation

Implement:
- Markdown report
- report endpoint
- report UI
- tests

### Acceptance
- report reproducible from stored files
- approved actions clearly distinguished

---

## Phase 7 — Historical Comparison

Implement:
- load previous retrospectives
- recurring theme counts
- action completion counts
- previous open actions
- no causal claims

### Acceptance
- comparison works for 2+ retrospectives

---

## Phase 8 — Cursor Rules

Create `.cursor/rules/*.mdc`.

### Acceptance
- correct Cursor rule format
- focused responsibilities
- privacy/security/storage rules included
- Rules checked into Git

---

## Phase 9 — Cursor Commands and Skills

Create:
- commands
- Skills
- references/templates

### Acceptance
- commands have narrow purposes
- Skills have `SKILL.md`
- skills do not duplicate global Rules
- report Skill uses template asset

---

## Phase 10 — Sub-agents

Create four agents.

### Acceptance
- clear name/description
- specialized responsibilities
- structured output expectations
- verifier independently checks work

---

## Phase 11 — Hooks

Implement:
- `hooks.json`
- audit
- dangerous shell blocking
- JSON validation
- lightweight final verification

### Acceptance
- hooks are project-level
- hook failure messages are understandable
- no secrets logged

---

## Phase 12 — MCP

Create:
- `mcp.example.json`
- MCP setup section in README
- Google Drive archive Skill
- `/archive-retro`

### Acceptance
- no credentials committed
- archive operation safe if MCP missing
- Google Drive is backup/archive only
- local source preserved

---

## Phase 13 — GitHub Multi-Repo Workflow

Implement:
- branch convention
- Pull Request template
- cross-repository feature example
- documentation

Feature example:

> Add `teamMood` optional retrospective-level field.

Require:
- backend change
- API change
- frontend change
- tests in both repos
- two Pull Requests or coordinated repository changes

### Acceptance
- demonstrates real multi-repository reasoning

---

## Phase 14 — Cursor Automation

Configure/document Pull Request review Automation.

### Acceptance
- triggered by Pull Request event
- reviews but never merges
- checks relevant rules/tests
- produces actionable review result

---

## Phase 15 — Final Teaching Scenario

Prepare demo retrospective with sample data.

Run:

```text
1. Create retrospective.
2. Submit feedback.
3. Close.
4. Run baseline analysis.
5. Run /analyze-retro through Cursor.
6. Compare outputs.
7. Approve actions manually.
8. Run /review-actions.
9. Generate report.
10. Run verifier.
11. Archive through Google Drive MCP.
12. Open a multi-repo change.
13. Create Pull Requests.
14. Show Automation review.
```

### Acceptance
Every target concept is demonstrable.

---

# 37. Sample Demo Data

Create an optional development seed script, not production data.

Feedback examples:

### Went Well
- "QA joined refinement earlier and caught missing acceptance criteria."
- "The deployment pipeline was stable this sprint."
- "Pair programming helped us finish the API change faster."

### Did Not Go Well
- "Code reviews were waiting too long before someone responded."
- "Two stories entered the sprint without clear acceptance criteria."
- "We manually checked configuration after deployment."
- "A regression was found late because the integration tests did not cover the scenario."

### Improvement
- "Define a review response target for Pull Requests."
- "Add a readiness checklist before stories enter the sprint."
- "Automate configuration validation in the deployment pipeline."

Use fictional team names only.

---

# 38. Definition of Done

The project is complete when:

## Application
- local frontend works
- local backend works
- no database
- file persistence works
- feedback works
- analysis works
- actions work
- reporting works
- history comparison works

## Quality
- tests pass
- input validation exists
- path safety exists
- anonymous feedback protection exists
- original feedback is immutable after submission except explicit facilitator correction feature, which is not included in Version 1

## Agentic Engineering
- both repositories have `AGENTS.md`
- Rules exist
- Commands exist
- Skills exist
- Sub-agents exist
- Hooks exist
- MCP example/configuration docs exist
- Guardrails documented and represented in code/rules/hooks
- workflow documented
- Cursor Automation documented/configured when account capabilities allow

## Source Control
- repositories exist in GitHub
- `main` remains protected by team practice/settings
- Pull Requests used
- no secrets committed

## Teaching
- `docs/teaching-guide.md` exists
- one full demo scenario exists
- each requested concept has a concrete example

---

# 39. Cursor Implementation Instructions

When this file is given to Cursor Agent, use the following working behavior.

## Before Coding

1. Read this entire plan.
2. Inspect both repositories.
3. Read all existing `AGENTS.md` and applicable Rules.
4. Do not change the selected stack.
5. Do not add hosting.
6. Do not add a database.
7. Do not add React or TypeScript.
8. Identify the current implementation phase.
9. Make a short implementation checklist for that phase.

## During Coding

1. Keep changes small and reviewable.
2. Follow repository boundaries.
3. Add/update tests with behavior.
4. Validate all file paths.
5. Preserve exact feedback text.
6. Apply anonymous-feedback guardrails.
7. Do not claim an external integration succeeded unless verified.
8. Do not silently skip acceptance criteria.
9. If a plan item is impossible because of unavailable account capability, implement/document the local fallback and clearly mark the limitation.

## After Each Phase

1. Run relevant tests.
2. Run lint/format checks if configured.
3. Use verifier sub-agent when available.
4. Compare implementation against phase acceptance criteria.
5. Update README/documentation.
6. Report:
   - completed
   - tests executed
   - remaining
   - limitations
7. Do not proceed by hiding failed tests.

---

# 40. Recommended First Cursor Prompt

After creating/cloning both repositories and opening the parent folder in Cursor, give Cursor this instruction:

```text
Read PLAN.md completely.

We are implementing the Retrospective Management & Continuous Improvement System as a teaching project for Agentic AI across the SDLC.

First inspect both repositories and identify what already exists.

Then implement Phase 0 only.

Follow these constraints:
- Frontend: HTML, CSS, Vanilla JavaScript.
- Backend: Node.js + Express.
- Storage: local JSON/Markdown files; no database.
- No React.
- No TypeScript.
- No hosting.
- Do not implement later phases yet.
- Create or update AGENTS.md as described.
- Add the minimum tests needed for Phase 0.
- At the end, run verification and report the Phase 0 acceptance criteria one by one.
```

After Phase 0 is verified, continue with:

```text
Read PLAN.md again and implement Phase 1 only.
Do not start Phase 2 until Phase 1 acceptance criteria are verified.
```

Repeat phase by phase.

This staged approach is strongly preferred to asking one agent to implement all phases in one run.

---

# 41. Suggested Development Commands

Backend `package.json` should eventually expose simple scripts such as:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "node --test",
    "verify": "npm test"
  }
}
```

Prefer the Node.js built-in test runner to reduce dependencies unless a stronger reason emerges.

Frontend can be served using a very small local static server dependency or another simple local development method.

Do not introduce a full frontend build system.

---

# 42. Environment Configuration

Backend environment variables may include:

```text
PORT=3001
DATA_ROOT=./data
```

Create `.env.example`.

Never commit `.env`.

For Google Drive MCP, follow the chosen MCP server's authentication mechanism and keep credentials outside Git.

---

# 43. Architecture Decision Records

Create a small:

```text
docs/architecture.md
```

Record these decisions:

## ADR-001: Two repositories
Reason: teach multi-repository Agentic development.

## ADR-002: Vanilla frontend
Reason: reduce framework complexity.

## ADR-003: Node.js/Express backend
Reason: simple JavaScript end-to-end stack.

## ADR-004: File storage
Reason: avoid database complexity and make agent-visible artifacts easy to inspect.

## ADR-005: Google Drive as archive, not primary storage
Reason: keep local app deterministic and use MCP as a teaching integration.

## ADR-006: Human approval for AI suggestions
Reason: retrospectives involve people and potentially sensitive interpretation.

## ADR-007: No runtime LLM dependency in Version 1
Reason: project must work without external model credentials; Cursor Agent workflows demonstrate Agentic AI concepts separately.

---

# 44. Privacy Philosophy

The system supports team improvement, not employee surveillance.

The application and all agent instructions must reinforce:

> Analyze process patterns, not people.

Preferred language:
- "The team mentioned..."
- "Several feedback items indicate..."
- "A recurring theme is..."
- "One possible improvement is..."

Avoid:
- "Person X is the problem."
- "The weakest developer is..."
- "This person caused..."
- inferred author identity
- psychological/personality profiling
- performance scoring

---

# 45. Future Extensions — Not Version 1

Only consider these after the teaching project is complete:

- real authentication
- hosted deployment
- Google Drive API from the application
- Microsoft Teams integration
- Slack integration
- GitHub metrics as retrospective evidence
- Azure DevOps integration
- runtime LLM provider
- embeddings / semantic search
- richer dashboards
- team-level permissions
- export to PDF
- action reminders
- sprint metrics
- anonymous voting
- facilitator mode
- retrospective templates

Do not let future extensions expand Version 1 scope.

---

# 46. Current Cursor Convention Notes

The plan intentionally follows current Cursor conventions verified in September 2026:

- Project Rules: `.cursor/rules/*.mdc`
- `AGENTS.md`: repository root and nested directories are supported
- Project Skills: `.cursor/skills/<skill>/SKILL.md`
- Project Sub-agents: `.cursor/agents/*.md`
- Project Hooks: `.cursor/hooks.json`
- Custom Commands: `.cursor/commands/`
- Project MCP configuration: `.cursor/mcp.json`
- Cursor Automations can run Cloud Agents from events such as GitHub Pull Request events
- Cursor Cloud Agent environments support multiple repositories

Always re-check Cursor documentation if these conventions change.

---

# 47. Reference Links

Current Cursor documentation used to shape this plan:

- Rules and `AGENTS.md`: https://cursor.com/docs/rules
- Agent Skills: https://cursor.com/docs/skills
- Sub-agents: https://cursor.com/docs/subagents
- Hooks: https://cursor.com/docs/hooks
- Model Context Protocol (MCP): https://cursor.com/docs/mcp
- Cloud Agents: https://cursor.com/docs/cloud-agent
- Cloud Agent setup / multi-repository environments: https://cursor.com/docs/cloud-agent/setup
- Automations: https://cursor.com/help/ai-features/automations
- Custom command deeplinks / `.cursor/commands`: https://cursor.com/docs/reference/deeplinks
- Google Drive API upload reference for a future application-level integration: https://developers.google.com/workspace/drive/api/guides/manage-uploads

---

# 48. Final Project Principle

The final teaching story should be:

```text
Simple Retrospective Web Application
        |
        v
Clean Multi-Repository Architecture
        |
        v
AGENTS.md + Rules
        |
        v
Commands + Skills
        |
        v
Specialized Sub-agents
        |
        v
MCP External Context / Google Drive
        |
        v
Hooks + Guardrails
        |
        v
Human-Approved Workflow
        |
        v
GitHub Pull Requests
        |
        v
Cursor Automation
        |
        v
Practical Agentic SDLC Example
```

The team should finish the project understanding not only **how to use AI**, but **how to engineer controlled, reusable, observable Agentic workflows inside the Software Development Life Cycle**.
