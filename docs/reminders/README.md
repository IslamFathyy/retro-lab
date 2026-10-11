# Reminder snapshots for weekly email automation

Cloud Cursor Automations cannot read gitignored `repos/retro-api/data/`. At archive time, export a committed snapshot here.

## Files

| File | Purpose |
|------|---------|
| `latest-reminder.json` | Open approved actions and excerpts from the most recently archived retro |
| `latest-email-payload.json` | Pre-built Gmail `send_message` fields for Cloud Automation (copy verbatim) |
| `latest-analysis.json` | Full `analysis.json` copy for the latest archived retro |
| `latest-report.md` | Full `report.md` copy for the latest archived retro |
| `recipients.example.json` | Template for recipient list |
| `recipients.json` | Live recipient list (optional gitignore) |

## Export

```bash
cd repos/retro-api
npm run export:reminder
```

After each archive, run **`/commit-latest-report`** (workflow step 9) to push all four `latest-*` snapshot files to GitHub `main` (Sunday mail reads `latest-email-payload.json`).

## Recipients

`to` may include any valid email (Gmail, Outlook, corporate M365). Sender is your connected Gmail account via the Cursor Gmail plugin.
