# Weekly Action Reminder

Email open approved actions from the latest archived retrospective snapshot.

## Arguments

- `--dry-run` (optional) — compose subject/body only; do not send

## Prerequisites

- `docs/reminders/latest-reminder.json` exists (run `cd retro-api && npm run export:reminder` after archive)
- `docs/reminders/recipients.json` configured
- Cursor **Gmail plugin** connected

## Steps

1. Use skill `weekly-action-reminder`.
2. Read `docs/reminders/latest-reminder.json` and `docs/reminders/recipients.json`.
3. Compose HTML email with open actions from the snapshot.
4. Unless `--dry-run`, send via Gmail `send_message` to addresses in `recipients.to`.
5. Report message id or dry-run preview.

## Test recipient

Default test user: `islam.fathy@integrant.com` (Outlook / Integrant M365).

## Related

- Export: `npm run export:reminder` in `retro-api`
- Automation setup: `docs/cursor-automation-weekly-reminder.md`
