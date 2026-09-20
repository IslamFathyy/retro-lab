import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from './security.js';
const TYPE_MAP = [
    { file: 'package.json', type: 'Node.js' },
    { file: 'tsconfig.json', type: 'TypeScript' },
    { file: 'requirements.txt', type: 'Python' },
    { file: 'pyproject.toml', type: 'Python' },
    { file: 'Cargo.toml', type: 'Rust' },
    { file: 'go.mod', type: 'Go' },
    { file: 'pom.xml', type: 'Java' },
    { file: 'composer.json', type: 'PHP' },
    { file: 'Gemfile', type: 'Ruby' },
];
const SCRIPT_KEYS = ['dev', 'build', 'start', 'test', 'lint'];
export function detectProject(projectRoot) {
    let type = 'Unknown';
    for (const entry of TYPE_MAP) {
        if (fs.existsSync(path.join(projectRoot, entry.file))) {
            type = entry.type;
            break;
        }
    }
    let name = path.basename(projectRoot);
    const commands = {};
    const pkgRaw = safeReadFile(projectRoot, 'package.json');
    if (pkgRaw) {
        try {
            const pkg = JSON.parse(pkgRaw);
            if (pkg.name)
                name = pkg.name;
            if (pkg.scripts) {
                for (const key of SCRIPT_KEYS) {
                    if (pkg.scripts[key]) {
                        commands[key] = pkg.scripts[key];
                    }
                }
            }
        }
        catch {
            // ignore invalid package.json
        }
    }
    const envVarNames = detectEnvVarNames(projectRoot);
    return { name, type, commands, envVarNames };
}
/** Names only — never read .env values. */
export function detectEnvVarNames(projectRoot) {
    const names = new Set();
    const example = safeReadFile(projectRoot, '.env.example');
    if (example) {
        for (const line of example.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#'))
                continue;
            const eq = trimmed.indexOf('=');
            const key = (eq >= 0 ? trimmed.slice(0, eq) : trimmed).trim();
            if (/^[A-Z][A-Z0-9_]*$/i.test(key))
                names.add(key);
        }
    }
    // Optional: README env section keys from example only — never parse .env
    return [...names].sort();
}
