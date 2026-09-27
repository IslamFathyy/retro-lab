import { safeReadFile } from '../security.js';
const INFERRED = {
    PORT: 'HTTP server listen port (e.g. 3001)',
    DATA_ROOT: 'Root directory for local JSON/file storage',
    NODE_ENV: 'Runtime mode: development, test, or production',
    DATABASE_URL: 'Database connection string (set locally; never commit real values)',
    API_KEY: 'API key for external service (set locally; never commit real values)',
    SECRET_KEY: 'Signing/encryption secret (set locally; never commit real values)',
    GUARDRAILS_CONFIG: 'Optional path override for guardrails.json',
    ACTION_TEAMS_CONFIG: 'Optional path override for action-teams.json',
};
export function scanEnvVars(projectRoot) {
    const example = safeReadFile(projectRoot, '.env.example');
    if (!example)
        return [];
    const docs = [];
    const lines = example.split('\n');
    let pendingComment = null;
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            pendingComment = null;
            continue;
        }
        if (trimmed.startsWith('#')) {
            pendingComment = trimmed.replace(/^#\s*/, '');
            continue;
        }
        const eq = trimmed.indexOf('=');
        const key = (eq >= 0 ? trimmed.slice(0, eq) : trimmed).trim();
        if (!/^[A-Z][A-Z0-9_]*$/i.test(key))
            continue;
        const exampleVal = eq >= 0 ? trimmed.slice(eq + 1).trim() : undefined;
        const description = pendingComment ||
            INFERRED[key] ||
            `Configuration value for ${key} (see source code or .env.example)`;
        docs.push({
            name: key,
            example: exampleVal || undefined,
            description,
            source: pendingComment ? '.env.example' : INFERRED[key] ? 'inferred' : '.env.example',
        });
        pendingComment = null;
    }
    return docs;
}
