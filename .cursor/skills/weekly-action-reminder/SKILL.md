---
name: weekly-action-reminder
description: >-
  Email open approved actions from the latest archived retro using Gmail MCP and
  docs/reminders/latest-reminder.json. Use for /weekly-action-reminder, Sunday
  Cursor Automation, or when the user asks for a weekly action email. Do not use
  Lokka, Outlook, or Slack for this workflow.
---

# Weekly Action Reminder

## Purpose

Send one HTML email listing **open approved actions** from the committed reminder snapshot (latest archived retrospective).

## When to use

- Command `/weekly-action-reminder`
- Sunday Cursor Automation (reads `main` on GitHub)
- User asks for weekly open-actions email

**Do not use** for archiving, exporting snapshots, or changing action status in `retro-api`.

## Inputs

| Input | Source |
| --- | --- |
| Snapshot | `docs/reminders/latest-reminder.json` (preferred; includes `recipients.to`, `subjectPrefix`) |
| Recipients fallback | `docs/reminders/recipients.json` if snapshot has no `recipients` |
| Send | Gmail MCP (`user-gmail` → `send_message`) |

## Workflow

1. Read `docs/reminders/latest-reminder.json`.
2. Resolve `to` from `snapshot.recipients.to` or `recipients.json` — **never** use action `teams` labels as email addresses.
3. Build **subject:** `{subjectPrefix} Open actions — {title} ({period})`.
4. Build **body (HTML):** sprint title, period, team, archived date; bullets for open actions (`ACT-####`, title, teams, target date, description); optional `reportExcerpt.themesSummary`; footer (Retrospective Lab; replies not monitored).
5. If `openActions` is empty, send a short “no open approved actions” message.
6. Call Gmail `send_message` with `to`, `subject`, `htmlBody`, plain `body` fallback.

**Dry-run:** If user asks dry-run or `--dry-run` — show subject and body in chat; **do not** call `send_message`.

**Automation:** Read committed files from `IslamFathyy/retro-lab` on `main`; send via Gmail MCP; do not merge PRs or edit repo files.

## Decision rules

| Situation | Action |
| --- | --- |
| `latest-reminder.json` missing or stale | **Stop** — run archive + `cd retro-api && npm run export:reminder` first. |
| Uncertain recipient | Use snapshot `recipients.to`; else `recipients.json`; never invent addresses. |
| Modify retro data | **Forbidden** — email is read-only snapshot. |

Follow [`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc).

## Validation

- Snapshot parses as JSON (hook `validate-json.js` if edited in repo).
- `to` addresses match configured recipients, not team display names.

## Failure handling

| Failure | Action |
| --- | --- |
| No snapshot | Stop with export/archive instructions. |
| Gmail MCP error | Report error; do not retry with alternate mail APIs. |
| Dry-run requested | Never send. |

## Completion criteria

**Done when:** email sent (or dry-run output shown), user informed of recipient and action count.

## References

- Automation: [docs/cursor-automation-weekly-reminder.md](../../../docs/cursor-automation-weekly-reminder.md)
- MCP: [docs/mcp-setup.md](../../../docs/mcp-setup.md)
