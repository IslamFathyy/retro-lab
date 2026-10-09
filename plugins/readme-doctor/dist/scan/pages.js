import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);
export function scanHtmlPages(projectRoot) {
    const pages = [];
    collectHtml(projectRoot, projectRoot, pages, 0);
    const publicDir = path.join(projectRoot, 'public');
    if (fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory()) {
        collectHtml(projectRoot, publicDir, pages, 0);
    }
    return pages.sort((a, b) => a.file.localeCompare(b.file));
}
function collectHtml(projectRoot, dir, out, depth) {
    if (depth > 2)
        return;
    let names;
    try {
        names = fs.readdirSync(dir);
    }
    catch {
        return;
    }
    for (const name of names) {
        if (SKIP.has(name))
            continue;
        const full = path.join(dir, name);
        let stat;
        try {
            stat = fs.statSync(full);
        }
        catch {
            continue;
        }
        if (stat.isDirectory()) {
            collectHtml(projectRoot, full, out, depth + 1);
            continue;
        }
        if (!name.endsWith('.html'))
            continue;
        const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
        const content = safeReadFile(projectRoot, rel);
        let title = null;
        if (content) {
            const m = content.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (m)
                title = m[1].trim();
        }
        out.push({ file: rel, title });
    }
}
