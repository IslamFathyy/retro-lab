# README Doctor

Small Cursor plugin + MCP server that **analyzes** and **safely improves** project `README.md` files.

## Features

- **`analyze_readme`** — read-only score, section checklist, suggestions (JSON + human text)
- **`improve_readme`** — scans the project tree, generates `docs/API.md`, `docs/PROJECT-MAP.md`, `docs/CURSOR.md`, and writes an onboarding `README.md` (from detected routes, git remote, `.cursor/` assets, env vars, and scripts)
- Project type detection (Node.js, Python, Rust, Go, Java, PHP, Ruby)
- Security: no `.env` values, path traversal blocked, only `README.md` + backup modified

## Requirements

- Node.js 18+
- Cursor with plugin + MCP support

## Cursor integration (current mechanism)

README Doctor ships as a **Cursor Plugin** (`.cursor-plugin/plugin.json`) with an MCP server in `mcp.json`. This matches the [Cursor Plugins reference](https://cursor.com/docs/reference/plugins): MCP is auto-discovered from `mcp.json` at the plugin root; `${CURSOR_PLUGIN_ROOT}` points at the installed plugin folder.

**Not assumed:** a separate marketplace API — install from this repo folder or your org marketplace manifest.

### Install (local / teaching)

1. `cd plugins/readme-doctor && npm install` (runs `build` via `postinstall`)
2. Cursor → **Settings → Plugins** → Install from folder → select `plugins/readme-doctor`
3. Reload window; confirm **readme-doctor** MCP server is enabled (Customize → MCP)
4. Run `/check-readme` or ask the agent to call `analyze_readme`

### Multi-plugin repo (this monorepo)

Root [`.cursor-plugin/marketplace.json`](../../.cursor-plugin/marketplace.json) lists `readme-doctor` with `source: plugins/readme-doctor`.

### Publish

1. Push to public GitHub
2. Submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
3. Or register the marketplace manifest for your org catalog

## Usage examples

**Check (read-only)**

```json
{ "project_path": "D:/my-app" }
```

Call MCP tool `analyze_readme`. Empty `project_path` uses the MCP process cwd.

**Fix (writes README.md)**

```json
{ "project_path": "D:/my-app" }
```

Call `improve_readme`. Existing `README.md` → `README.md.backup` first.

## Local development

```bash
cd plugins/readme-doctor
npm install
npm test
npm start   # stdio MCP server (for debugging)
```

## Testing

```bash
npm test
```

Covers analyzer scoring, project detection, backup/write safety, and improver behavior.

## Security

| Rule | Implementation |
|------|----------------|
| No `.env` values | Only parses `.env.example` keys |
| No path escape | `safeReadFile` / resolved project root |
| Limited writes | `README.md`, `README.md.backup` only |
| No invented APIs | Improver uses headings + detected scripts only |

## How to contribute

1. Fork / branch
2. `npm test` must pass
3. Keep dependencies minimal
4. Open a PR with a short description

## License

MIT — see [LICENSE](LICENSE).
