#!/usr/bin/env bash
# Load .env into the shell user profile (when possible) and copy mcp-config.json -> .cursor/mcp.json
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT}/.env"
TEMPLATE="${ROOT}/mcp-config.json"
TARGET_DIR="${ROOT}/.cursor"
TARGET="${TARGET_DIR}/mcp.json"

echo "Retrospective Lab — MCP setup"
echo "Root: ${ROOT}"
echo ""

if [[ ! -f "${TEMPLATE}" ]]; then
  echo "ERROR: Missing mcp-config.json at ${TEMPLATE}" >&2
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "WARNING: .env not found." >&2
  echo "  cp env.example .env"
  echo "  Edit .env, then re-run this script."
  exit 1
fi

load_env() {
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(echo "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    [[ -z "$line" ]] && continue
    if [[ "$line" != *=* ]]; then continue; fi
    key="${line%%=*}"
    val="${line#*=}"
    key="$(echo "$key" | sed -e 's/[[:space:]]*$//')"
    val="$(echo "$val" | sed -e 's/^[[:space:]]*//')"
    if [[ "$val" =~ ^\".*\"$ ]]; then val="${val:1:${#val}-2}"; fi
    if [[ "$val" =~ ^\'.*\'$ ]]; then val="${val:1:${#val}-2}"; fi
    export "${key}=${val}"
    echo "  - ${key}"
  done < "${ENV_FILE}"
}

echo "Loaded variables from .env:"
load_env

mkdir -p "${TARGET_DIR}"
cp -f "${TEMPLATE}" "${TARGET}"

echo ""
echo "SUCCESS: Copied mcp-config.json -> .cursor/mcp.json"
echo ""
echo "Next steps:"
echo "  1. Persist exports for GUI apps (add to ~/.bashrc / ~/.zshrc or use direnv), then restart Cursor."
echo "  2. Or launch Cursor from this terminal after: source .env"
echo "  3. Settings -> MCP — confirm project servers are enabled."
echo ""
echo "On macOS/Linux set MCP_NPX_PATH=npx in .env (Windows: full path to npx.cmd)."
