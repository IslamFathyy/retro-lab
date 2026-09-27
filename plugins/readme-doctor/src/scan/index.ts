import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
import { scanApis } from './api.js';
import { scanCursor } from './cursor.js';
import { scanEnvVars } from './env.js';
import { scanGit } from './git.js';
import { scanTree, topLevelNotes } from './tree.js';
import type { ProjectScan } from './types.js';

const TYPE_MAP: Array<{ file: string; type: string }> = [
  { file: 'package.json', type: 'Node.js' },
  { file: 'tsconfig.json', type: 'TypeScript' },
  { file: 'requirements.txt', type: 'Python' },
  { file: 'pyproject.toml', type: 'Python' },
  { file: 'Cargo.toml', type: 'Rust' },
  { file: 'go.mod', type: 'Go' },
];

export function scanProject(projectRoot: string): ProjectScan {
  let type = 'Unknown';
  for (const entry of TYPE_MAP) {
    if (fs.existsSync(path.join(projectRoot, entry.file))) {
      type = entry.type;
      break;
    }
  }

  let name = path.basename(projectRoot);
  let description = '';
  const allScripts: Record<string, string> = {};

  const pkgRaw = safeReadFile(projectRoot, 'package.json');
  if (pkgRaw) {
    try {
      const pkg = JSON.parse(pkgRaw) as {
        name?: string;
        description?: string;
        scripts?: Record<string, string>;
      };
      if (pkg.name) name = pkg.name;
      if (pkg.description) description = pkg.description;
      if (pkg.scripts) Object.assign(allScripts, pkg.scripts);
    } catch {
      // ignore
    }
  }

  const { endpoints, mountPrefix } = scanApis(projectRoot);

  return {
    root: projectRoot,
    name,
    type,
    description,
    tree: scanTree(projectRoot),
    topLevelNotes: topLevelNotes(projectRoot),
    apis: endpoints,
    apiMountPrefix: mountPrefix,
    git: scanGit(projectRoot),
    cursor: scanCursor(projectRoot),
    envVars: scanEnvVars(projectRoot),
    allScripts,
    hasTests: fs.existsSync(path.join(projectRoot, 'tests')) || fs.existsSync(path.join(projectRoot, 'test')),
    hasCi: fs.existsSync(path.join(projectRoot, '.github', 'workflows')),
    hasDataDir: fs.existsSync(path.join(projectRoot, 'data')),
    hasConfigDir: fs.existsSync(path.join(projectRoot, 'config')),
    agentsMdPath: fs.existsSync(path.join(projectRoot, 'AGENTS.md')) ? 'AGENTS.md' : null,
  };
}
