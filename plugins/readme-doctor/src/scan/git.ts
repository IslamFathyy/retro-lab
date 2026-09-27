import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { GitInfo } from './types.js';

export function scanGit(projectRoot: string): GitInfo {
  const gitDir = path.join(projectRoot, '.git');
  if (!fs.existsSync(gitDir)) {
    return { isRepo: false, remoteUrl: null, branch: null };
  }

  let remoteUrl: string | null = null;
  let branch: string | null = null;

  try {
    remoteUrl = execFileSync('git', ['-C', projectRoot, 'remote', 'get-url', 'origin'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    remoteUrl = null;
  }

  try {
    branch = execFileSync('git', ['-C', projectRoot, 'branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    branch = null;
  }

  return { isRepo: true, remoteUrl, branch };
}
