import fs from 'node:fs';
import path from 'node:path';
const SKIP_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    '__pycache__',
    '.venv',
    'vendor',
]);
const FOLDER_NOTES = {
    src: 'Application source code',
    tests: 'Automated tests',
    test: 'Automated tests',
    data: 'Local data / file storage',
    scripts: 'Maintenance and utility scripts',
    config: 'Runtime configuration (JSON/YAML)',
    docs: 'Project documentation',
    '.cursor': 'Cursor IDE rules, agents, and workflow assets',
    '.github': 'GitHub Actions and repository automation',
    public: 'Static assets served to clients',
    routes: 'HTTP route definitions',
    controllers: 'Request/response handlers',
    services: 'Business logic layer',
    validators: 'Input validation',
    utils: 'Shared utilities',
};
const MAX_DEPTH = 3;
const MAX_CHILDREN = 40;
export function scanTree(projectRoot) {
    return walkDir(projectRoot, projectRoot, 0);
}
export function topLevelNotes(projectRoot) {
    const notes = {};
    if (!fs.existsSync(projectRoot))
        return notes;
    for (const name of fs.readdirSync(projectRoot)) {
        if (SKIP_DIRS.has(name))
            continue;
        const full = path.join(projectRoot, name);
        if (!fs.statSync(full).isDirectory())
            continue;
        notes[name] = FOLDER_NOTES[name] ?? 'Project directory';
    }
    return notes;
}
function walkDir(projectRoot, dir, depth) {
    if (depth > MAX_DEPTH)
        return [];
    let names;
    try {
        names = fs.readdirSync(dir);
    }
    catch {
        return [];
    }
    names.sort((a, b) => a.localeCompare(b));
    const entries = [];
    for (const name of names.slice(0, MAX_CHILDREN)) {
        if (SKIP_DIRS.has(name))
            continue;
        if (name.startsWith('.') && name !== '.cursor' && name !== '.github')
            continue;
        const full = path.join(dir, name);
        let stat;
        try {
            stat = fs.statSync(full);
        }
        catch {
            continue;
        }
        const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
        if (stat.isDirectory()) {
            const note = depth === 0 ? FOLDER_NOTES[name] : FOLDER_NOTES[name.split('/').pop() ?? ''];
            entries.push({
                path: rel,
                type: 'directory',
                note,
                children: walkDir(projectRoot, full, depth + 1),
            });
        }
        else if (depth < MAX_DEPTH) {
            entries.push({ path: rel, type: 'file' });
        }
    }
    return entries;
}
export function renderTree(entries, indent = '') {
    const lines = [];
    for (const entry of entries) {
        const suffix = entry.type === 'directory' ? '/' : '';
        const note = entry.note ? ` — ${entry.note}` : '';
        lines.push(`${indent}- \`${entry.path}${suffix}\`${note}`);
        if (entry.children?.length) {
            lines.push(renderTree(entry.children, indent + '  '));
        }
    }
    return lines.join('\n');
}
