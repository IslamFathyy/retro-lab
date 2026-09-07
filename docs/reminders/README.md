# Reminder snapshots for weekly email automation

Cloud Cursor Automations cannot read gitignored `retro-api/data/`. At archive time, export a committed snapshot here.

## Files

| File | Purpose |
|------|---------|
| `latest-reminder.json` | Open approved actions from the most recently archived retro |
| `recipients.example.json` | Template for recipient list |
| `recipients.json` | Live recipient list (optional gitignore) |

## Export

```bash
cd retro-api
npm run export:reminder
```

Commit `latest-reminder.json` after each archive so Sunday automation can read it from GitHub.

## Recipients

`to` may include any valid email (Gmail, Outlook, corporate M365). Sender is your connected Gmail account via the Cursor Gmail plugin.
