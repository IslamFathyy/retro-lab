# README Doctor

Cursor plugin + MCP server for **company-standard** `README.md` files on any repository. Same section outline everywhere; content comes from project scan (routes, HTML pages, scripts, `.cursor/` assets, env names, git remote).

## MCP tools

| Tool | Use |
| --- | --- |
| **`analyze_readme`** | Read-only canonical section score and suggestions |
| **`align_readme`** | Existing README → backup + align structure (`/check-readme`) |
| **`generate_readme`** | Create README only when missing (`/generate-readme`) |
| **`improve_readme`** | Deprecated alias (align or generate) |

Outline reference: [references/canonical-readme-outline.md](references/canonical-readme-outline.md).

## Requirements

- Node.js 18+
- Cursor with plugin + MCP support

## Install

1. `cd plugins/readme-doctor && npm install`
2. Cursor → **Settings → Plugins** → install this folder
3. Enable MCP server **readme-doctor**
4. `/check-readme` or `/generate-readme` on any project root (`project_path`)

## Local development

```bash
cd plugins/readme-doctor
npm install
npm test
npm start   # stdio MCP server
```

## Security

| Rule | Implementation |
|------|----------------|
| No `.env` values | Only `.env.example` keys |
| No path escape | Resolved project root |
| Limited writes | `README.md`, `README.md.backup` only |
| No invented APIs | Routes from source scan only |

## License

MIT — see [LICENSE](LICENSE).
