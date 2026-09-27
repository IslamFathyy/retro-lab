import fs from 'node:fs';
import path from 'node:path';
import type { ImproveResult } from './types.js';
import { buildComprehensiveReadme } from './docs-generator.js';
import { scanProject } from './scan/index.js';
import { safeBackupReadme, safeWriteReadme } from './security.js';

/**
 * Scan the project and write a single comprehensive README.md (all sections inline).
 */
export function improveReadme(projectRoot: string): ImproveResult {
  const readmePath = path.join(projectRoot, 'README.md');
  const created = !fs.existsSync(readmePath);

  const scan = scanProject(projectRoot);
  const content = buildComprehensiveReadme(scan);

  const backupPath = safeBackupReadme(projectRoot);
  safeWriteReadme(projectRoot, content);

  return {
    success: true,
    message: created
      ? 'Created README.md with full project scan (single file, all sections inline).'
      : 'Updated README.md from project scan. Original saved to README.md.backup.',
    readmePath,
    backupPath,
    created,
    generatedDocs: [],
    scanSummary: {
      apiCount: scan.apis.length,
      cursorAssets: scan.cursor.length,
      topLevelDirs: Object.keys(scan.topLevelNotes).length,
    },
  };
}
