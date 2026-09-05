---
name: analyze-retrospective
description: Analyze retrospective feedback into themes, strengths, concerns, and suggested actions. Use when running /analyze-retro or when the user asks for AI-assisted retrospective analysis.
---

# Analyze Retrospective Skill

## Input
- Retrospective ID
- Feedback JSON files under `retro-api/data/retrospectives/{id}/feedback/`

## Output
Write `analysis.json` matching PLAN.md schema:
- themes (with feedbackIds)
- strengths, concerns, opportunities
- suggestedActions (NOT approved — human review required)
- limitations array

## Rules
- Preserve exact feedback text in source files; only summarize in analysis fields.
- Never infer anonymous authors.
- Include at least one limitation about human review.
