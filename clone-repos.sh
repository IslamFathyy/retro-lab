#!/usr/bin/env bash
#
# Clone Retrospective Lab application repos into repos/
# Run from the retro-lab root after: git clone <retro-lab-url> && cd retro-lab
#
# Requires: git, bash (Git Bash on Windows is fine)
# URLs match repos.json — update both if remotes change.

set -euo pipefail

REPOS_DIR="repos"
DEFAULT_BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# name | clone URL
REPOS=(
  "retro-api|https://github.com/IslamFathyy/retro-api.git"
  "retro-web|https://github.com/IslamFathyy/retro-web.git"
)

echo -e "${GREEN}Retrospective Lab — clone child repositories${NC}"
echo "Root: ${SCRIPT_DIR}"
echo ""

mkdir -p "${SCRIPT_DIR}/${REPOS_DIR}"
cd "${SCRIPT_DIR}/${REPOS_DIR}"

clone_repo() {
  local repo_name="$1"
  local repo_url="$2"
  local branch="${3:-$DEFAULT_BRANCH}"

  echo -e "${YELLOW}Processing: ${repo_name}${NC}"

  if [ -d "${repo_name}/.git" ]; then
    echo "  Already cloned — skipping."
    echo "  To update: cd repos/${repo_name} && git pull origin ${branch}"
  elif [ -d "${repo_name}" ]; then
    echo -e "  ${RED}✗ Directory repos/${repo_name} exists but is not a git repo.${NC}"
    echo "  Remove or rename it, then re-run this script."
    return 1
  else
    echo "  Cloning ${repo_url} (branch ${branch})..."
    if git clone -b "${branch}" "${repo_url}" "${repo_name}"; then
      echo -e "  ${GREEN}✓ ${repo_name}${NC}"
    else
      echo -e "  ${RED}✗ Failed to clone ${repo_name}${NC}"
      return 1
    fi
  fi
  echo ""
}

for entry in "${REPOS[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  clone_repo "${name}" "${url}" "${DEFAULT_BRANCH}"
done

echo -e "${GREEN}Done.${NC} Child repos are under ${REPOS_DIR}/"
echo ""
echo "Next:"
echo "  cd repos/retro-api && npm install && npm start    # port 3001"
echo "  cd repos/retro-web && npm install && npm start   # port 8080"
echo "  Open retro-lab.code-workspace in Cursor"
echo "  See docs/cursor-test-workflow.md and /run-retro-workflow"
