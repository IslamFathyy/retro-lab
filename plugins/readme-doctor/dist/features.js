function groupApis(scan) {
    const groups = new Map();
    const prefix = scan.apiMountPrefix.replace(/\/$/, '') || '';
    for (const ep of scan.apis) {
        const full = ep.path.startsWith('/') ? ep.path : `/${ep.path}`;
        const segments = full.split('/').filter(Boolean);
        const key = segments[0] ?? 'root';
        if (!groups.has(key))
            groups.set(key, { methods: new Set(), paths: [] });
        const g = groups.get(key);
        g.methods.add(ep.method);
        const display = `${prefix}${full}`.replace(/\/+/g, '/');
        if (!g.paths.includes(display))
            g.paths.push(display);
    }
    return groups;
}
export function renderFeaturesSection(scan) {
    const lines = ['## Features', ''];
    if (scan.description) {
        lines.push(scan.description, '');
    }
    const apiGroups = groupApis(scan);
    if (apiGroups.size > 0) {
        lines.push('### HTTP API capabilities', '');
        for (const [group, info] of [...apiGroups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
            const methods = [...info.methods].sort().join(', ');
            lines.push(`- **${group}** — exposes ${methods} on ${info.paths.slice(0, 4).join(', ')}${info.paths.length > 4 ? ', …' : ''} (detected from route files).`);
        }
        lines.push('');
    }
    if (scan.htmlPages.length > 0) {
        lines.push('### User interface', '');
        for (const page of scan.htmlPages) {
            const label = page.title ?? page.file;
            lines.push(`- **${label}** — \`${page.file}\``);
        }
        lines.push('');
    }
    const notableScripts = Object.entries(scan.allScripts).filter(([name]) => /^(seed|reset|export|migrate|demo)/i.test(name));
    if (notableScripts.length > 0) {
        lines.push('### Operational scripts', '');
        for (const [name, cmd] of notableScripts) {
            lines.push(`- \`npm run ${name}\` — \`${cmd}\``);
        }
        lines.push('');
    }
    if (scan.workflowCommands.length > 0) {
        lines.push('### Agent / facilitator workflows', '');
        for (const cmd of scan.workflowCommands.slice(0, 15)) {
            const desc = cmd.description ? ` — ${cmd.description}` : '';
            lines.push(`- \`/${cmd.name}\`${desc}`);
        }
        if (scan.workflowCommands.length > 15) {
            lines.push(`- _(${scan.workflowCommands.length - 15} more commands in \`.cursor/commands/\`)_`);
        }
        lines.push('');
    }
    if (scan.hasDataDir) {
        lines.push('### Local data', '', '- File-backed storage under `data/` (no database detected).', '');
    }
    if (scan.hasCi) {
        const names = scan.ciWorkflowNames.length > 0 ? scan.ciWorkflowNames.join(', ') : 'workflows';
        lines.push('### Automation', '', `- CI runs on push/PR via GitHub Actions (\`${names}\`).`, '');
    }
    if (lines.length <= 3) {
        lines.push('- Core capabilities are defined in source under this repository; expand this section after review.', '');
    }
    return lines;
}
