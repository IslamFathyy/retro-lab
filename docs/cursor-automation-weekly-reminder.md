# Weekly Retro Action Reminder — Cursor Automation

Sunday 9:00 AM email of open approved actions from the most recently archived retrospective.

## Architecture

Local archive exports a committed snapshot; Cloud Automation reads it from GitHub and sends via Gmail.

```text
/archive-retro → npm run export:reminder → commit docs/reminders/latest-reminder.json
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

## Export snapshot (local)

```bash
cd retro-api
npm run export:reminder
git add docs/reminders/latest-reminder.json
git commit -m "chore: update reminder snapshot"
git push
```

Run after each `/archive-retro`.

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
