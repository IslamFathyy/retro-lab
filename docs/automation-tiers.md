# Automation tiers — Cursor stack (Q3 2026)

**Goal:** Non-interactive agent work is explicit, auditable, and matched to the right product — not a vague “automation” checkbox.

**Scope:** Cursor-related tiers only. Claude Routine / other vendors are **out of scope** for this project (see [Skipped tiers](#skipped-tiers)).

---

## How the tiers differ

```text
INTERACTIVE (human in chat)          NON-INTERACTIVE (runs without chat)
────────────────────────────         ───────────────────────────────────
Cursor IDE — commands/skills         Cursor Automation — cron / triggers
  + sub-agents + MCP (local)           → Cloud Agent runtime on GitHub
                                       GitHub Actions CI — npm test only
```

**Do not treat these as interchangeable:** local IDE chat cannot read `main` on schedule; cloud automation cannot reach `localhost:3001` or gitignored `retro-api/data/`.

---

## Tier matrix

| Tier | Adopted | Trigger | Scope | Secrets / MCP policy | Review path | Monitoring | Rollback |
|------|---------|---------|-------|----------------------|-------------|------------|----------|
| **Cursor IDE (interactive)** | Yes | Human runs command in chat | Local workspace + `retro-api/data/` via API | User `~/.cursor/mcp.json`; no secrets in repo; hooks enforce policy | Human validates UI; `/approve-suggestions` gate | `.cursor/logs/subagent-activity.log` | Stop chat; revert git changes |
| **Cursor Automation** | Yes | Cron `0 9 * * 0` (Sun 9:00) | `IslamFathyy/retro-lab` branch `main` | **Gmail plugin only**; read `docs/reminders/latest-email-payload.json`; never use team labels as `to` | Human checks inbox; automation does not merge or edit retro data | Cursor **Agents → Automations** run history | Disable schedule; fallback: `/weekly-action-reminder` in IDE |
| **Cursor Cloud Agent** | Yes (runtime) | Same as Automation (“Run now” or schedule) | GitHub repo clone in cloud VM | **Separate** cloud OAuth at [cursor.com/agents](https://cursor.com/agents) for Gmail | Human reviews email / PR comments before acting | Automation run log + reported Gmail message id | Disable automation; use IDE tier |
| **GitHub Actions CI** | Yes | `push` / `pull_request` on `retro-api` | `retro-api/` only — `npm test` | No MCP; no `.env`; no `data/` in CI | Human merges PR after green check | GitHub Actions tab on `retro-api` repo | Revert commit; fix tests locally |

---

## Selection criteria

| Need | Use | Do not use |
|------|-----|------------|
| AI analysis, archive, approve flow | **Cursor IDE** + skills | Automation (no local API) |
| Weekly email, no human at keyboard | **Cursor Automation** + snapshot on `main` | IDE-only if schedule required |
| Deterministic regression gate | **GitHub Actions CI** | Verifier sub-agent alone |
| Read live retro JSON files | **IDE** + `retro-api` REST | Cloud agent (data gitignored) |

---

## Data bridge (Automation ↔ local app)

Cloud tiers cannot read `retro-api/data/`. Publish committed snapshots instead:

```text
/archive-retro → npm run export:reminder → /commit-latest-report → main
Automation reads docs/reminders/latest-email-payload.json
```

See [`reminders/README.md`](reminders/README.md).

---

## Runbooks

| Tier | Doc |
|------|-----|
| Cursor Automation (weekly email) | [`cursor-automation-weekly-reminder.md`](cursor-automation-weekly-reminder.md) |
| IDE weekly fallback | `.cursor/skills/weekly-action-reminder/SKILL.md` |
| CI workflow | [`retro-api/.github/workflows/test.yml`](../retro-api/.github/workflows/test.yml) |
| Golden-path evidence | [`automation-golden-path.md`](automation-golden-path.md) |

---

## Skipped tiers

| Tier | Decision | Date | Reason |
|------|----------|------|--------|
| **Claude Routine** | Not adopted | 2026-09-19 | Project uses **Cursor-only** stack for Q3 teaching; no Anthropic Routine configured. |
| **PR review Automation** (PLAN §27A) | Deferred | 2026-09-19 | Optional follow-up; weekly email automation prioritized. |

---

## Sign-off

| Owner | Date | Matrix complete |
|-------|------|-----------------|
| Islam Fathy | 2026-09-19 | ☑ Cursor tiers documented |
