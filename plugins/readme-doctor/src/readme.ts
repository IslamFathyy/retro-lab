import fs from 'node:fs';
import path from 'node:path';
import type { ImproveResult } from './types.js';
import { buildCanonicalReadme, extractTaglineFromReadme } from './canonical-readme.js';
import { scanProject } from './scan/index.js';
import { safeBackupReadme, safeReadFile, safeWriteReadme } from './security.js';

function writeReadmeResult(
  projectRoot: string,
  created: boolean,
  scan: ReturnType<typeof scanProject>
): ImproveResult {
  const readmePath = path.join(projectRoot, 'README.md');
  return {
    success: true,
    message: created
      ? 'Created README.md with company canonical structure (scan-derived content).'
      : 'Aligned README.md to canonical structure. Original saved to README.md.backup.',
    readmePath,
    backupPath: created ? null : path.join(projectRoot, 'README.md.backup'),
    created,
    generatedDocs: [],
    scanSummary: {
      apiCount: scan.apis.length,
      cursorAssets: scan.cursor.length,
      topLevelDirs: Object.keys(scan.topLevelNotes).length,
    },
  };
}

export function generateReadme(projectRoot: string): ImproveResult {
  const readmePath = path.join(projectRoot, 'README.md');
  if (fs.existsSync(readmePath)) {
    throw new Error(
      'README.md already exists. Use align_readme (/check-readme) to update the existing file, or remove it before generate_readme.'
    );
  }

  const scan = scanProject(projectRoot);
  const content = buildCanonicalReadme(scan);
  safeWriteReadme(projectRoot, content);
  return writeReadmeResult(projectRoot, true, scan);
}

export function alignReadme(projectRoot: string): ImproveResult {
  const readmePath = path.join(projectRoot, 'README.md');
  if (!fs.existsSync(readmePath)) {
    throw new Error('README.md not found. Use generate_readme (/generate-readme) to create a new file.');
  }

  const existing = safeReadFile(projectRoot, 'README.md') ?? '';
  const preservedTagline = extractTaglineFromReadme(existing);

  const backupPath = safeBackupReadme(projectRoot);
  const scan = scanProject(projectRoot);
  const content = buildCanonicalReadme(scan, { preservedTagline });
  safeWriteReadme(projectRoot, content);

  const result = writeReadmeResult(projectRoot, false, scan);
  result.backupPath = backupPath;
  return result;
}

/** @deprecated Use alignReadme or generateReadme */
export function improveReadme(projectRoot: string): ImproveResult {
  const readmePath = path.join(projectRoot, 'README.md');
  if (fs.existsSync(readmePath)) {
    return alignReadme(projectRoot);
  }
  return generateReadme(projectRoot);
}
