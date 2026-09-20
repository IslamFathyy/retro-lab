import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolve and validate project_path. Rejects traversal and non-directories.
 */
export function resolveProjectPath(projectPath: string, cwd: string = process.cwd()): string {
  const base = projectPath?.trim() ? path.resolve(projectPath) : path.resolve(cwd);
  const normalized = path.normalize(base);

  if (!fs.existsSync(normalized)) {
    throw new Error(`Project path does not exist: ${normalized}`);
  }

  const stat = fs.statSync(normalized);
  if (!stat.isDirectory()) {
    throw new Error(`Project path is not a directory: ${normalized}`);
  }

  return normalized;
}

/** Read file only if it is under projectRoot (no escape via symlinks beyond simple check). */
export function safeReadFile(projectRoot: string, relativePath: string): string | null {
  const full = path.resolve(projectRoot, relativePath);
  const rel = path.relative(projectRoot, full);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('Access outside project path is not allowed.');
  }
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return null;
  }
  return fs.readFileSync(full, 'utf8');
}

export function safeWriteReadme(projectRoot: string, content: string): void {
  const readmePath = path.join(projectRoot, 'README.md');
  const rel = path.relative(projectRoot, readmePath);
  if (rel.startsWith('..')) {
    throw new Error('Cannot write outside project path.');
  }
  fs.writeFileSync(readmePath, content, 'utf8');
}

export function safeBackupReadme(projectRoot: string): string | null {
  const readmePath = path.join(projectRoot, 'README.md');
  if (!fs.existsSync(readmePath)) {
    return null;
  }
  const backupPath = path.join(projectRoot, 'README.md.backup');
  fs.copyFileSync(readmePath, backupPath);
  return backupPath;
}
