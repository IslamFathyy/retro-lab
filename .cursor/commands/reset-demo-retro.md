# Reset Demo Retrospective Environment

Clear **all** demo data for a fresh team walkthrough: local retrospectives, reminder snapshot, and Google Drive archives.

**Destructive.** Requires explicit human confirmation before running.

## Arguments

- `--local-only` (optional) — skip Google Drive cleanup; only run local `npm run reset:demo`

## Human confirmation (required)

Ask the user to reply with **`RESET DEMO`** before executing. Do not proceed on vague assent.

## Steps

1. Use skill `reset-demo-environment`.
2. Unless `--local-only`, confirm **google-drive** MCP is available.
3. Run local reset:

```bash
cd retro-api
npm run reset:demo
```

4. Unless `--local-only`, trash all child folders inside Drive **`Retrospective Management`** (see skill). Keep the parent folder.
5. Report what was deleted/trashed and any failures.
6. **Next step:** `/seed-demo-retro` then `/close-retro RETRO-2026-001` or full `/run-retro-workflow`.

## What this does not do

- Does not re-seed automatically (run `/seed-demo-retro` after reset)
- Does not empty Google Drive trash permanently (items are restorable)
- Does not delete the `Retrospective Management` root folder

## Demo flow

```text
/reset-demo-retro          ← confirm RESET DEMO
/seed-demo-retro
/run-retro-workflow        ← or step through manually
```
