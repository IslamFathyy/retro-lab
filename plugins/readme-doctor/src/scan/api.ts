import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
import type { ApiEndpoint } from './types.js';

const ROUTE_RE =
  /router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
const APP_MOUNT_RE = /app\.use\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\w+)/g;

export function scanApis(projectRoot: string): { endpoints: ApiEndpoint[]; mountPrefix: string } {
  const endpoints: ApiEndpoint[] = [];
  let mountPrefix = '/api';

  const routeFiles = findRouteFiles(projectRoot);
  for (const rel of routeFiles) {
    const content = safeReadFile(projectRoot, rel);
    if (!content) continue;
    let match: RegExpExecArray | null;
    ROUTE_RE.lastIndex = 0;
    while ((match = ROUTE_RE.exec(content)) !== null) {
      endpoints.push({
        method: match[1].toUpperCase(),
        path: match[2],
        sourceFile: rel,
      });
    }
  }

  const appFiles = findFiles(projectRoot, (p) => /app\.(js|ts|mjs|cjs)$/.test(p));
  for (const rel of appFiles) {
    const content = safeReadFile(projectRoot, rel);
    if (!content) continue;
    let match: RegExpExecArray | null;
    APP_MOUNT_RE.lastIndex = 0;
    while ((match = APP_MOUNT_RE.exec(content)) !== null) {
      if (match[1].startsWith('/')) {
        mountPrefix = match[1].replace(/\/$/, '') || '/api';
      }
    }
  }

  const normalized = endpoints.map((e) => ({
    ...e,
    path: `${mountPrefix}${e.path.startsWith('/') ? e.path : `/${e.path}`}`,
  }));

  normalized.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  return { endpoints: normalized, mountPrefix };
}

function findRouteFiles(projectRoot: string): string[] {
  const found: string[] = [];
  const routesDir = path.join(projectRoot, 'src', 'routes');
  if (fs.existsSync(routesDir)) {
    for (const name of fs.readdirSync(routesDir)) {
      if (/\.(js|ts|mjs|cjs)$/.test(name)) {
        found.push(path.join('src', 'routes', name).replace(/\\/g, '/'));
      }
    }
  }
  findFiles(projectRoot, (p) => /\.routes\.(js|ts|mjs|cjs)$/.test(p) || p.includes('/routes/')).forEach(
    (f) => {
      if (!found.includes(f)) found.push(f);
    }
  );
  return found;
}

function findFiles(projectRoot: string, predicate: (rel: string) => boolean): string[] {
  const results: string[] = [];
  walk(projectRoot, projectRoot, results, predicate, 0);
  return results;
}

function walk(
  projectRoot: string,
  dir: string,
  results: string[],
  predicate: (rel: string) => boolean,
  depth: number
): void {
  if (depth > 6 || results.length > 50) return;
  let names: string[];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
    const full = path.join(dir, name);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
    if (stat.isDirectory()) {
      walk(projectRoot, full, results, predicate, depth + 1);
    } else if (predicate(rel)) {
      results.push(rel);
    }
  }
}
