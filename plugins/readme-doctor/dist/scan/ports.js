import { safeReadFile } from '../security.js';
export function scanPortHints(projectRoot, envVars) {
    const hints = [];
    const seen = new Set();
    for (const v of envVars) {
        if (!/PORT/i.test(v.name))
            continue;
        const raw = v.example?.replace(/['"]/g, '').trim() ?? '';
        if (raw && /^\d+$/.test(raw)) {
            const key = `${v.name}:${raw}`;
            if (!seen.has(key)) {
                seen.add(key);
                hints.push({ port: raw, label: v.name, source: '.env.example' });
            }
        }
    }
    const compose = safeReadFile(projectRoot, 'docker-compose.yml') ?? safeReadFile(projectRoot, 'docker-compose.yaml');
    if (compose) {
        const portRe = /['"]?(\d{2,5}):(\d{2,5})['"]?/g;
        let m;
        while ((m = portRe.exec(compose)) !== null) {
            const host = m[1];
            if (!seen.has(`compose:${host}`)) {
                seen.add(`compose:${host}`);
                hints.push({ port: host, label: 'docker-compose published port', source: 'docker-compose' });
            }
        }
    }
    const pkgRaw = safeReadFile(projectRoot, 'package.json');
    if (pkgRaw) {
        try {
            const pkg = JSON.parse(pkgRaw);
            const start = pkg.scripts?.start ?? '';
            const portMatch = start.match(/(?:PORT=|--port[=\s])(\d{2,5})/);
            if (portMatch && !seen.has(`script:${portMatch[1]}`)) {
                seen.add(`script:${portMatch[1]}`);
                hints.push({ port: portMatch[1], label: 'npm start', source: 'package.json' });
            }
        }
        catch {
            // ignore
        }
    }
    if (hints.length === 0) {
        hints.push({ port: '3000', label: 'default (configure in .env)', source: 'inferred' });
    }
    return hints;
}
