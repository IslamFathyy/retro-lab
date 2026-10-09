import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
export function scanWorkflowCommands(projectRoot) {
    const commandsDir = path.join(projectRoot, '.cursor', 'commands');
    if (!fs.existsSync(commandsDir))
        return [];
    const out = [];
    for (const name of fs.readdirSync(commandsDir)) {
        if (!name.endsWith('.md'))
            continue;
        const rel = path.join('.cursor', 'commands', name).replace(/\\/g, '/');
        const content = safeReadFile(projectRoot, rel);
        if (!content)
            continue;
        const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let cmdName = name.replace(/\.md$/, '');
        let description = '';
        if (fm) {
            const nameLine = fm[1].match(/^name:\s*(.+)$/m);
            const descLine = fm[1].match(/^description:\s*(.+)$/m);
            if (nameLine)
                cmdName = nameLine[1].trim();
            if (descLine)
                description = descLine[1].trim();
        }
        if (!description) {
            const body = content.replace(/^---[\s\S]*?---\r?\n?/, '').trim();
            description = body.split('\n').find((l) => l.trim() && !l.startsWith('#'))?.trim() ?? '';
        }
        out.push({ name: cmdName, description, path: rel });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
}
export function scanMakefileTargets(projectRoot) {
    const makefile = safeReadFile(projectRoot, 'Makefile') ?? safeReadFile(projectRoot, 'makefile');
    if (!makefile)
        return [];
    const targets = [];
    for (const line of makefile.split('\n')) {
        const m = line.match(/^([a-zA-Z0-9_.-]+):/);
        if (m && !m[1].startsWith('.'))
            targets.push(m[1]);
    }
    return targets.slice(0, 12);
}
export function scanCiWorkflowNames(projectRoot) {
    const dir = path.join(projectRoot, '.github', 'workflows');
    if (!fs.existsSync(dir))
        return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
        .map((f) => f.replace(/\.(ya?ml)$/, ''))
        .sort();
}
export function scanDocMarkdown(projectRoot) {
    const docs = path.join(projectRoot, 'docs');
    if (!fs.existsSync(docs))
        return [];
    const files = [];
    for (const name of fs.readdirSync(docs)) {
        if (name.endsWith('.md'))
            files.push(`docs/${name}`);
    }
    return files.sort();
}
