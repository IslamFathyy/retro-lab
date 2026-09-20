README Doctor plugin
Goal

Build a small, open-source developer tool for Cursor called README Doctor.

README Doctor analyzes the current project and tells the developer what is missing or weak in their README.md. It can optionally improve the README safely.

The project is intentionally small and should be easy for another developer to understand, install, and contribute to.

Important First Step

Before writing code, research the current official Cursor-supported mechanism for building and distributing developer tools/plugins.

Do not assume an old Cursor plugin API or marketplace format.

Use the currently supported approach, such as the appropriate MCP/tool/extension mechanism if that is what Cursor currently recommends.

Document the chosen approach in the project's README.md.

MVP

Implement exactly two tools.

1. analyze_readme

Read-only operation.

Input:

{
  "project_path": "string"
}


If project_path is empty, use the current working directory.

Analyze:

Whether a README exists

Project name

Project type

Installation documentation

Usage documentation

Development instructions

Environment variable documentation

Testing documentation

API documentation

Deployment documentation

Return structured data similar to:

{
  "project": {
    "name": "my-app",
    "type": "Node.js"
  },
  "readme": {
    "exists": true,
    "path": "README.md"
  },
  "sections": {
    "description": "present",
    "installation": "present",
    "usage": "missing",
    "development": "present",
    "environment": "missing",
    "testing": "present",
    "api": "optional",
    "deployment": "missing"
  },
  "score": 4,
  "maxScore": 6,
  "suggestions": [
    "Add usage instructions.",
    "Document environment variables.",
    "Add deployment instructions."
  ]
}


Use simple Markdown heading heuristics. Do not build a complex AI system.

2. improve_readme

Modify README.md based on the repository.

Input:

{
  "project_path": "string"
}


Rules:

Preserve useful existing content.

Add useful missing sections.

Never invent commands.

Never invent environment variables.

Never invent APIs.

If information cannot be determined, say so instead of making it up.

Only modify README.md.

If README.md already exists, create README.md.backup before modifying it.

Never expose environment variable values or secrets.

Project Detection

Detect the project type using common files:

package.json
tsconfig.json
requirements.txt
pyproject.toml
Cargo.toml
go.mod
pom.xml
composer.json
Gemfile


Examples:

package.json       → Node.js
requirements.txt   → Python
pyproject.toml     → Python
Cargo.toml         → Rust
go.mod             → Go
pom.xml            → Java
composer.json      → PHP
Gemfile            → Ruby


Also detect useful commands from project configuration where possible.

For Node.js, inspect package.json scripts such as:

dev
build
start
test
lint


Never invent commands.

Security

The tool must:

Never expose .env values.

Never print secrets.

Never execute arbitrary commands from user input.

Never access files outside the requested project.

Prevent path traversal.

Never modify files other than README.md and its backup.

Avoid unnecessary external services.

Keep dependencies minimal.

Environment-variable detection may report:

DATABASE_URL
API_KEY
STRIPE_SECRET_KEY


but must never report their values.

Suggested Structure

Use the simplest structure appropriate for the current Cursor-supported integration.

Prefer TypeScript if appropriate.

Example:

readme-doctor/
├── README.md
├── IMPLEMENTATION_PLAN.md
├── package.json
├── src/
│   ├── index.ts
│   ├── analyzer.ts
│   ├── detector.ts
│   ├── readme.ts
│   └── types.ts
├── tests/
│   ├── analyzer.test.ts
│   ├── detector.test.ts
│   └── readme.test.ts
├── .gitignore
└── LICENSE


Adjust this structure if the current Cursor integration requires something different.

Implementation Steps
Step 1 — Research

Determine the current official Cursor mechanism for creating and distributing developer tools.

Document the decision.

Step 2 — Setup

Create the project and install only necessary dependencies.

Step 3 — Project Detector

Implement:

detectProject()


It should detect project type, name, and useful commands.

Step 4 — README Analyzer

Implement:

analyzeReadme()


It should detect README sections and generate a simple score.

Step 5 — README Improver

Implement:

improveReadme()


It should safely update the README and create a backup.

Step 6 — Cursor Integration

Expose:

analyze_readme
improve_readme


Make the tool descriptions clear about which operation is read-only and which modifies files.

Step 7 — Tests

Add tests for:

README exists

README missing

section detection

project detection

score calculation

backup creation

README creation

README modification

invalid paths

path traversal

secret protection

Run all tests and fix failures.

Example User Experience

The final tool should support:

Developer:
Check my README.


Result:

README Doctor

Project: my-app
Type: Node.js

✓ Description
✓ Installation
✗ Usage
✓ Development
✗ Environment Variables
✓ Testing
✗ Deployment

Score: 4/6

Suggestions:
- Add usage instructions.
- Document environment variables.
- Add deployment instructions.


Then:

Developer:
Fix my README.


Result:

README Doctor

README.md updated successfully.

Backup:
README.md.backup

README Requirements

The project's README must explain:

What README Doctor is.

Features.

Requirements.

Installation.

Cursor configuration.

Usage examples.

Local development.

Testing.

Security.

How to contribute.

License.

Do not document an imaginary Cursor marketplace.

If an official distribution/marketplace exists, document the verified current process.

Otherwise, explain how developers can install/use the project from its public repository.

Definition of Done

The project is complete when:

 It builds successfully.

 All tests pass.

 analyze_readme works.

 improve_readme works.

 README backups work.

 Secrets are protected.

 Path traversal is prevented.

 Only intended files are modified.

 Cursor setup is documented.

 Another developer can clone and use the project.

 The repository contains no secrets.

 The code is simple enough for a beginner to understand.

Final Cursor Instruction

Implement this plan from beginning to end.

Work incrementally and run tests after each major step.

Do not ask unnecessary questions.

If the Cursor integration mechanism differs from the example structure above, adapt the architecture to the current officially supported mechanism.

Do not invent Cursor APIs.

Before finishing, verify:

Build succeeds.

Tests pass.

Tool can be run locally.

README instructions are accurate.

No secrets are committed.

The project is ready to publish as an open-source repository.

At the end, provide a concise summary of:

What was implemented.

Files created.

Tests executed.

How to run locally.

How another developer can install it.

How it can be published.

Any remaining limitations.