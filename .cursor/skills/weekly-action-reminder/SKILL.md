---
name: weekly-action-reminder
description: >-
  One HTML email lists open approved actions from the archived-retro snapshot on
  GitHub main; sending uses Gmail MCP, not Lokka, Outlook, or Slack.
---

# Weekly Action Reminder

## When to use

- `/weekly-action-reminder`
- Sunday Cursor Automation (reads committed snapshot on `main`)
- User asks for a weekly open-actions email

**Out of scope:** archiving, exporting snapshots, or changing action status in `retro-api`.

## Inputs

| Input | Source |
| --- | --- |
| Snapshot | `docs/reminders/latest-reminder.json` (includes `recipients.to`, `subjectPrefix` when present) |
| Recipients fallback | `docs/reminders/recipients.json` if snapshot has no `recipients` |
| Send | Gmail MCP (`user-gmail` → `send_message`) |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Email | Gmail `send_message` to resolved `to` addresses (or dry-run preview in chat only) |
| Content | Subject `{subjectPrefix} Open actions — {title} ({period})`; HTML body with open `ACT-####` rows and optional `reportExcerpt.themesSummary` |
| Empty set | Short “no open approved actions” message when `openActions` is empty |

## Workflow

1. Read `docs/reminders/latest-reminder.json`.
2. Resolve `to` from `snapshot.recipients.to` or `recipients.json` — **never** use action `teams` labels as email addresses.
3. Build subject and HTML body per **Output** (sprint metadata, action bullets, footer: Retrospective Lab; replies not monitored).
4. If dry-run or `--dry-run`: show subject and body in chat; **do not** call `send_message`.
5. Otherwise call Gmail `send_message` with `to`, `subject`, `htmlBody`, and plain `body` fallback.

**Automation:** Read committed files from `IslamFathyy/retro-lab` on `main`; do not merge PRs or edit repo files.

## Decision rules

| Situation | Action |
| --- | --- |
| `latest-reminder.json` missing or stale | **Stop** — archive + `npm run export:reminder` first. |
| Uncertain recipient | Snapshot `recipients.to`, else `recipients.json`; never invent addresses. |
| Modify retro data | **Forbidden** — email is read-only snapshot. |

[`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc) applies.

## Validation

- Snapshot parses as JSON (hook `validate-json.js` if edited in repo).
- `to` addresses match configured recipients, not team display names.

## Failure handling

| Failure | Action |
| --- | --- |
| No snapshot | Stop with export/archive instructions. |
| Gmail MCP error | Report error; do not retry with alternate mail APIs. |
| Dry-run requested | Never send. |

## References

- [docs/cursor-automation-weekly-reminder.md](../../../docs/cursor-automation-weekly-reminder.md)
- [docs/mcp-setup.md](../../../docs/mcp-setup.md)
