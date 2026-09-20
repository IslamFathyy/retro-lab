Sub-agent activity log (appended by postToolUse + subagentStop hooks).

Each line records: timestamp, source, agent name, status, duration, summary.

Triggered when these sub-agents complete: feedback-analyst, improvement-advisor, verifier, insights-visualizer.

Golden-path sign-off: docs/sub-agents-golden-path.md

Log path uses CURSOR_PROJECT_DIR (walk to .cursor/hooks.json), not process.cwd().

Debug/diagnostic skips: .cursor/logs/hook-events.log

This file is gitignored via `*.log`.
