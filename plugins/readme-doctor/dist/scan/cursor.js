import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
const FRONTMATTER_DESC = /description:\s*(.+)/i;
export function scanCursor(projectRoot) {
    const cursorRoot = path.join(projectRoot, '.cursor');
    if (!fs.existsSync(cursorRoot))
        return [];
    const assets = [];
    scanRules(projectRoot, cursorRoot, assets);
    scanAgents(projectRoot, cursorRoot, assets);
    scanSkills(projectRoot, cursorRoot, assets);
    scanCommands(projectRoot, cursorRoot, assets);
    scanHooks(projectRoot, cursorRoot, assets);
    return assets;
}
function scanRules(projectRoot, cursorRoot, assets) {
    const rulesDir = path.join(cursorRoot, 'rules');
    if (!fs.existsSync(rulesDir))
        return;
    for (const name of fs.readdirSync(rulesDir)) {
        if (!/\.(mdc|md)$/.test(name))
            continue;
        const rel = path.relative(projectRoot, path.join(rulesDir, name)).replace(/\\/g, '/');
        const content = safeReadFile(projectRoot, rel) ?? '';
        assets.push({
            kind: 'rule',
            name: name.replace(/\.(mdc|md)$/, ''),
            path: rel,
            description: extractDescription(content),
        });
    }
}
function scanAgents(projectRoot, cursorRoot, assets) {
    const agentsDir = path.join(cursorRoot, 'agents');
    if (!fs.existsSync(agentsDir))
        return;
    for (const name of fs.readdirSync(agentsDir)) {
        if (!/\.(md|mdc)$/.test(name))
            continue;
        const rel = path.relative(projectRoot, path.join(agentsDir, name)).replace(/\\/g, '/');
        const content = safeReadFile(projectRoot, rel) ?? '';
        assets.push({
            kind: 'agent',
            name: name.replace(/\.(md|mdc)$/, ''),
            path: rel,
            description: extractDescription(content),
        });
    }
}
function scanSkills(projectRoot, cursorRoot, assets) {
    const skillsDir = path.join(cursorRoot, 'skills');
    if (!fs.existsSync(skillsDir))
        return;
    for (const name of fs.readdirSync(skillsDir)) {
        const skillFile = path.join(skillsDir, name, 'SKILL.md');
        if (!fs.existsSync(skillFile))
            continue;
        const rel = path.relative(projectRoot, skillFile).replace(/\\/g, '/');
        const content = safeReadFile(projectRoot, rel) ?? '';
        assets.push({
            kind: 'skill',
            name,
            path: rel,
            description: extractDescription(content),
        });
    }
}
function scanCommands(projectRoot, cursorRoot, assets) {
    const commandsDir = path.join(cursorRoot, 'commands');
    if (!fs.existsSync(commandsDir))
        return;
    for (const name of fs.readdirSync(commandsDir)) {
        if (!/\.(md|mdc|txt)$/.test(name))
            continue;
        const rel = path.relative(projectRoot, path.join(commandsDir, name)).replace(/\\/g, '/');
        const content = safeReadFile(projectRoot, rel) ?? '';
        assets.push({
            kind: 'command',
            name: name.replace(/\.(md|mdc|txt)$/, ''),
            path: rel,
            description: extractDescription(content),
        });
    }
}
function scanHooks(projectRoot, cursorRoot, assets) {
    const hooksJson = path.join(cursorRoot, 'hooks.json');
    const hooksDir = path.join(cursorRoot, 'hooks', 'hooks.json');
    const rel = fs.existsSync(hooksJson)
        ? '.cursor/hooks.json'
        : fs.existsSync(hooksDir)
            ? '.cursor/hooks/hooks.json'
            : null;
    if (!rel)
        return;
    assets.push({
        kind: 'hook',
        name: 'hooks',
        path: rel,
        description: 'Chat-time policy hooks (see hooks.json)',
    });
}
function extractDescription(content) {
    const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (fm) {
        const m = FRONTMATTER_DESC.exec(fm[1]);
        if (m)
            return m[1].trim();
    }
    const firstLine = content.split('\n').find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
    return firstLine?.trim().slice(0, 120);
}
