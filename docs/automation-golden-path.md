# Automation golden path — Cursor tiers

**Purpose:** One proven run (or explicit fallback) per adopted Cursor tier.

**Last updated:** 2026-09-19

---

## Tier 1 — Cursor IDE (interactive)

| Check | Result | Evidence |
|-------|--------|----------|
| `/weekly-action-reminder --dry-run` | ☑ PASS | Composed subject/body from `latest-reminder.json` in chat |
| `/weekly-action-reminder` (live IDE) | ☑ PASS | Gmail send via IDE OAuth (session prior to 2026-09-19) |
| Sub-agents on `/analyze-retro` | ☑ PASS | See [`sub-agents-golden-path.md`](sub-agents-golden-path.md) |

**Rollback:** Stop command; no scheduled side effects.

---

## Tier 2 — Cursor Automation (scheduled)

| Check | Result | Evidence |
|-------|--------|----------|
| Prefill + instructions committed | ☑ PASS | `docs/automations/weekly-retro-action-reminder.prefill.json`, `weekly-reminder-agent-instructions.txt` |
| Snapshot on `main` | ☐ Verify | Run `/commit-latest-report` after archive |
| Manual **Run now** in Automations UI | ☐ PENDING | Record run id + Gmail message id below |
| Sunday cron `0 9 * * 0` | ☐ PENDING | Confirm after manual run succeeds |

**Manual run record (fill when done):**

| Field | Value |
|-------|-------|
| Date | |
| Automation name | Weekly Retro Action Reminder |
| Run id / link | |
| Gmail message id | |
| Recipient | |

**Rollback:** Disable automation schedule → use `/weekly-action-reminder` in IDE.

**Setup:** [`cursor-automation-weekly-reminder.md`](cursor-automation-weekly-reminder.md)

---

## Tier 3 — Cursor Cloud Agent (runtime)

Same runs as Tier 2 — cloud VM executes the automation prompt.

| Check | Result | Evidence |
|-------|--------|----------|
| Cloud Gmail OAuth at cursor.com/agents | ☐ Verify | Separate from IDE OAuth |
| Reads `latest-email-payload.json` only | ☑ PASS | Agent instructions enforce verbatim copy |
| Does not modify repo files | ☑ PASS | Instructions: read + send only |

**Escalation:** If cloud Gmail fails → IDE `/weekly-action-reminder` fallback (documented in automation runbook).

---

## Tier 4 — GitHub Actions CI

| Check | Result | Evidence |
|-------|--------|----------|
| Workflow file | ☑ PASS | `retro-api/.github/workflows/test.yml` |
| Local `npm test` | ☑ PASS | 26/26 tests (2026-09-19) |
| Green run on GitHub | ☐ PENDING | Push workflow; attach Actions URL |

**CI run record (fill after push):**

| Field | Value |
|-------|-------|
| Date | |
| Workflow run URL | |
| Result | |

**Rollback:** Revert failing commit; fix tests locally with `cd retro-api && npm test`.

---

## Skipped (documented)

| Tier | Decision |
|------|----------|
| Claude Routine | Not adopted — Cursor-only Q3 |
| PR review Automation | Deferred — see [`automation-tiers.md`](automation-tiers.md) |

---

## Sign-off

| Owner | Date | Cursor tiers |
|-------|------|--------------|
| Islam Fathy | 2026-09-19 | ☑ Documented — ☐ Automation Run now + CI remote run pending |
