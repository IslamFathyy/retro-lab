---
name: generate-retro-report
description: Generate markdown retrospective report from stored local files. Use with /generate-report command.
---

# Generate Retro Report Skill

Use template structure from PLAN.md section 15.

Include: Overview, Participation counts, **Insights at a Glance**, Themes, Concerns, Approved Actions, Previous Actions, Limitations.

## Insights at a Glance (required)

1. **Task → insights-visualizer** with current + prior retro context.
2. Import JSON per [report-insights-contract.md](references/report-insights-contract.md).
3. Call `POST .../report/generate` — API renders tables and Mermaid from stored insights.

Never name anonymous feedback authors.

Reference feedback IDs for traceability where helpful.
