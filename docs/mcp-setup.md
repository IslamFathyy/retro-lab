# MCP setup — Retrospective Lab

**Goal:** Connect Cursor agents safely to at least one system of record through MCP.

MCP servers are available to **Cursor agents only**. The running web app (`retro-web` → `retro-api`) never calls MCP.

---

## Systems of record

| MCP server | Namespace / plugin | System of record | Primary workflow |
|------------|-------------------|------------------|------------------|
| **Google Drive** | `user-google-drive` / `google-drive` | Archive backup | `/archive-retro` |
| **Gmail** | `user-gmail` | Outbound email | `/weekly-action-reminder` |
| **GitHub** | `user-github` / `github` | Git remote | `/commit-latest-report` |

**Primary integration (required for goal):** Google Drive archive via `/archive-retro`.

---

## Configuration

### Project config (this repo)

Retro Lab MCP servers live in **[`.cursor/mcp.json`](../.cursor/mcp.json)** at the orchestration root:

| Server | Workflow |
|--------|----------|
| `readme-doctor` | `/check-readme`, `/fix-readme` |
| `google-drive` | `/archive-retro`, Drive cleanup on reset |
| `gmail` | `/weekly-action-reminder` |
| `github` | `/commit-latest-report`, PR/issue tools |

Open the **retro-lab** workspace (or `retro-lab.code-workspace`), then **Settings → MCP** — project servers load with the repo. Reload the window after edits.

Template with comments: [`.cursor/mcp.example.json`](../.cursor/mcp.example.json).

**Avoid duplicates:** remove the same server names from user `~/.cursor/mcp.json` if you moved config here (keep personal-only MCPs like Outlook/Lokka in user config).

Never commit OAuth key files or tokens. The committed `mcp.json` contains only commands and public MCP URLs.

### Google Drive (stdio)

Package: `@piotr-agier/google-drive-mcp`

**One-time auth (Windows):**

1. Google Cloud Console → enable **Google Drive API**.
2. OAuth consent screen → add your Gmail as test user.
3. Create **Desktop app** OAuth client → download JSON.
4. Save as `%USERPROFILE%\.config\google-drive-mcp\gcp-oauth.keys.json`
5. Run: `npx -y @piotr-agier/google-drive-mcp auth`
6. Add server block to `mcp.json` (see example file), restart Cursor.
7. **Settings → MCP** — confirm `google-drive` is connected.

**Verify in chat:**

```text
Run authGetStatus on Google Drive MCP and show the connected account.
```

### Gmail (Cursor plugin)

1. Install **Gmail** from Cursor Marketplace / Plugins.
2. **IDE:** approve OAuth on first `send_message` in agent chat.
3. **Cloud Automations:** [cursor.com/agents](https://cursor.com/agents) → MCP Servers → Login for Gmail (separate OAuth).

See [`cursor-automation-weekly-reminder.md`](cursor-automation-weekly-reminder.md).

### GitHub (remote OAuth)

Add `url: https://api.github.com/mcp/` block from `mcp.example.json`, restart Cursor, approve OAuth on first use.

Alternative: enable GitHub under **Customize → Plugins**.

---

## Allowed operations (who may use what)

| Operation | MCP tools (examples) | Who | When |
|-----------|---------------------|-----|------|
| Archive retro files | `createFolder`, `uploadFile`, `listFolder`, `search` | Cursor agent on `/archive-retro` | After report generated, before weekly mail |
| List / verify archive | `listFolder`, `search`, `readTextFile` | Agent on archive or reset | Verify upload or find folder IDs |
| Trash demo archives | `deleteItem`, `trash` | Agent on `/reset-demo-retro` only | After explicit `RESET DEMO` confirm |
| Send action reminder | `send_message` | Agent on `/weekly-action-reminder` | Manual test or Sunday automation |
| Push reminder snapshot | GitHub MCP or `git push` | Agent on `/commit-latest-report` | After `/archive-retro` export |

**Do not use MCP for:**

- Reading/writing `repos/retro-api/data/` during normal CRUD (use REST API).
- Serving data to the browser (use `retro-api` + `retro-web`).
- Approving actions (human gate via `/approve-suggestions`).

---

## MCP vs local data paths

| Need | Use | Not |
|------|-----|-----|
| Create feedback, close retro, import analysis | `retro-api` REST | Drive MCP |
| Validate UI | `retro-web` + API | Drive MCP |
| Long-term backup copy | Google Drive MCP | Deleting local files |
| Weekly email payload | `docs/reminders/latest-reminder.json` on GitHub `main` | Reading live `data/` from cloud agent |
| OAuth tokens | Local OAuth cache (e.g. `~/.config/google-drive-mcp/`) + Cursor session | Repo files |

**Source of truth:** `repos/retro-api/data/retrospectives/` until archived. Drive is a **copy**, not authoritative.

---

## Error handling

| Failure | Agent behavior |
|---------|----------------|
| Drive MCP not configured / auth expired | Fail `/archive-retro` clearly; **do not** set local status to `archived` |
| Upload partial failure | Report which files succeeded; do not mark archived until verified |
| Duplicate `Retrospective Management` folders | Skill: search first, use one parent folder ID, consolidate duplicates |
| Gmail not connected | `/weekly-action-reminder` dry-run only or stop with setup link |
| GitHub push rejected | Report error; do not claim snapshot is on `main` |
| MCP returns unexpected external data | Treat as untrusted; validate IDs and schema before import |

Full archive procedure: [`.cursor/skills/archive-retrospective/SKILL.md`](../.cursor/skills/archive-retrospective/SKILL.md).

---

## Security review (summary)

| Control | Implementation |
|---------|----------------|
| No secrets in Git | `mcp.example.json` only; `.env` blocked by hook |
| Least privilege | Drive: app-folder scope via OAuth; Gmail: send from connected account only |
| Copy-only archive | Never delete local retro files on archive |
| Agent-only | No MCP in `retro-api` / `retro-web` runtime |
| External data | Validate MCP output before merging into import payloads |
| Audit | Sub-agent logging hooks; optional future `beforeMCPExecution` hook |

Details: [`guardrails.md`](guardrails.md) MCP section, [`AGENTS.md`](../AGENTS.md) MCP section.

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [`mcp-golden-path.md`](mcp-golden-path.md) | End-to-end checklist (sign-off evidence) |
| [`cursor-automation-weekly-reminder.md`](cursor-automation-weekly-reminder.md) | Gmail automation |
| [`cursor-test-workflow.md`](cursor-test-workflow.md) | Full retro workflow including step 8–9 |
