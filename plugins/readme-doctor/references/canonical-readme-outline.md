# Canonical README outline (company standard)

This is the **Integrant default** onboarding README shape. [retro-lab README.md](../../../README.md) is the reference example. The readme-doctor plugin emits the same **section order and H2 titles** on any repository; body content comes from project scan only.

## Section order

| ID | H2 title | Included when |
| --- | --- | --- |
| `tagline` | (blockquote under `# title`) | Always |
| `toc` | Table of contents | Always |
| `quick_start` | Quick start | `package.json` scripts or Makefile/docker start |
| `setup_5min` | 5-minute setup | Same as quick_start |
| `team_onboarding` | Team onboarding | Multi-repo / workspace hints |
| `prerequisites` | Prerequisites | Always |
| `repository_structure` | Repository structure | Always |
| `development_ports` | Development ports | Always |
| `features` | **Features** | Always |
| `mcp_optional` | MCP Integration Setup (optional) | MCP template or env MCP vars |
| `ai_agent_integration` | AI Agent Integration | `.cursor/commands` or skills |
| `ai_concepts` | AI concepts in this repo | `.cursor/` assets |
| `typical_workflow` | Typical workflow | Commands or Makefile targets |
| `documentation_map` | Documentation map | `docs/*.md` |
| `security` | Security | Always |
| `links` | Links | Always |

**Features** must appear immediately after **Development ports**.

## Commands

| Command | MCP tool | README |
| --- | --- | --- |
| `/check-readme` | `align_readme` | Must exist — backup then align |
| `/generate-readme` | `generate_readme` | Must not exist — create only |
