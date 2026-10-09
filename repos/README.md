# Application repositories

Child git repos for the **retro-lab** stack. Each folder has its **own** `.git` history and remote. They are **not** included when you clone the parent **retro-lab** repo (see root `.gitignore`).

## First-time setup

From the **retro-lab** root (after `git clone` of the parent):

```bash
./clone-repos.sh
```

On Windows (Git Bash): `bash clone-repos.sh`

The script creates `repos/retro-api` and `repos/retro-web` from GitHub. URLs and branches are listed in [`repos.json`](../repos.json).

| Folder | Role | Port |
| --- | --- | --- |
| [`retro-api/`](retro-api/) | REST API + local JSON storage | 3001 |
| [`retro-web/`](retro-web/) | Read-only validation UI | 8080 |

Orchestration (commands, skills, MCP workflows) lives in the parent **retro-lab** repo. See [`repos.json`](../repos.json) and root [`AGENTS.md`](../AGENTS.md).
