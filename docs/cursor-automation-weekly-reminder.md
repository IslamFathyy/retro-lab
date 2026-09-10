# Weekly Retro Action Reminder — Cursor Automation

Sunday 9:00 AM email of open approved actions from the most recently archived retrospective.

## Architecture

Local archive exports a committed snapshot; Cloud Automation reads it from GitHub and sends via Gmail.

```text
/archive-retro → export:reminder → /commit-latest-report (step 9) → on GitHub main
Sunday cron → Cloud Agent → read snapshot + recipients → Gmail send_message
```

## Prerequisites

1. **Gmail plugin** installed (Cursor Marketplace → Gmail).
2. **IDE OAuth** — Gmail works in agent chat.
3. **Cloud OAuth** — [cursor.com/agents](https://cursor.com/agents) → MCP Servers → Login for Gmail (separate from IDE).
4. **Snapshot on `main`** — at least one `latest-reminder.json` committed after archive.
5. **Recipients** — `docs/reminders/recipients.json` (test: `islam.fathy@integrant.com`).

## Sender vs recipients

| Role | Value |
|------|--------|
| From | Your connected Gmail account |
| To | Any address in `recipients.json` (Outlook/M365 OK) |

Corporate Outlook may filter external Gmail — test Inbox vs Junk before enabling cron.

## Export and publish snapshot

Step 8 exports locally; step 9 pushes to GitHub:

```text
/archive-retro {retroId}
/commit-latest-report
```

Manual equivalent:

```bash
cd retro-api && npm run export:reminder
git add docs/reminders/latest-reminder.json
git commit -m "chore: update reminder snapshot for weekly automation"
git push origin main
```

## Manual test in chat

```
/weekly-action-reminder --dry-run
/weekly-action-reminder
```

Confirm delivery to `islam.fathy@integrant.com`.

## Cursor Automation draft

| Field | Value |
|-------|--------|
| Name | Weekly Retro Action Reminder |
| Trigger | Cron `0 9 * * 0` (Sunday 9:00) |
| Repository | `IslamFathyy/retro-lab` / `main` |
| Tools | MCP: **Gmail** (dashboard plugin) |
| Instructions | Follow `weekly-action-reminder` skill: read `docs/reminders/latest-reminder.json` and `docs/reminders/recipients.json`, email open approved actions, do not modify data |

**Prefill file:** [`docs/automations/weekly-retro-action-reminder.prefill.json`](automations/weekly-retro-action-reminder.prefill.json) — use in Agents Window → Automations → create new → import or paste workflow fields.

**Create in UI:**
1. Open **Agents** window → **Automations** → **New automation**
2. Trigger: **On a schedule** → custom cron `0 9 * * 0`
3. Repository: `IslamFathyy/retro-lab`, branch `main`
4. Tools: enable **MCP** → select **Gmail**
5. Paste instructions from the prefill file `workflow.prompts[0].text`
6. Save → **Run now** once before enabling schedule

### Agent prompt essentials

1. Open `docs/reminders/latest-reminder.json` — if missing, stop with clear error.
2. Build concise HTML: sprint name, period, bullet list of open approved actions with IDs.
3. Read recipients from `docs/reminders/recipients.json`.
4. Send via Gmail `send_message`.
5. Do not merge PRs, change retro files, or close actions.

## Cloud Gmail caveat

Scheduled Cloud Automations may fail to resolve Gmail MCP even when the editor shows Connected. Before trusting the cron:

1. Run a **manual** automation trigger in the UI.
2. If cloud Gmail fails, use `/weekly-action-reminder` in IDE chat as fallback until cloud auth is fixed.

## Lokka / Outlook send

Not used — org blocks Microsoft Graph. Gmail sends **to** Outlook addresses; it does not send **as** your org identity.
