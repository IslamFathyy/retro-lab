import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
import type { HtmlPage } from './types.js';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);

export function scanHtmlPages(projectRoot: string): HtmlPage[] {
  const pages: HtmlPage[] = [];
  collectHtml(projectRoot, projectRoot, pages, 0);
  const publicDir = path.join(projectRoot, 'public');
  if (fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory()) {
    collectHtml(projectRoot, publicDir, pages, 0);
  }
  return pages.sort((a, b) => a.file.localeCompare(b.file));
}

function collectHtml(projectRoot: string, dir: string, out: HtmlPage[], depth: number): void {
  if (depth > 2) return;
  let names: string[];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      collectHtml(projectRoot, full, out, depth + 1);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
    const content = safeReadFile(projectRoot, rel);
    let title: string | null = null;
    if (content) {
      const m = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (m) title = m[1].trim();
    }
    out.push({ file: rel, title });
  }
}
