import fs from 'node:fs';
import path from 'node:path';
import { safeReadFile } from '../security.js';
import { scanApis } from './api.js';
import { scanCursor } from './cursor.js';
import { scanEnvVars } from './env.js';
import { scanGit } from './git.js';
import { scanHtmlPages } from './pages.js';
import { scanPortHints } from './ports.js';
import { scanCiWorkflowNames, scanDocMarkdown, scanMakefileTargets, scanWorkflowCommands } from './workflows.js';
import { scanTree, topLevelNotes } from './tree.js';
const TYPE_MAP = [
    { file: 'package.json', type: 'Node.js' },
    { file: 'tsconfig.json', type: 'TypeScript' },
    { file: 'requirements.txt', type: 'Python' },
    { file: 'pyproject.toml', type: 'Python' },
    { file: 'Cargo.toml', type: 'Rust' },
    { file: 'go.mod', type: 'Go' },
];
export function scanProject(projectRoot) {
    let type = 'Unknown';
    for (const entry of TYPE_MAP) {
        if (fs.existsSync(path.join(projectRoot, entry.file))) {
            type = entry.type;
            break;
        }
    }
    let name = path.basename(projectRoot);
    let description = '';
    const allScripts = {};
    const pkgRaw = safeReadFile(projectRoot, 'package.json');
    if (pkgRaw) {
        try {
            const pkg = JSON.parse(pkgRaw);
            if (pkg.name)
                name = pkg.name;
            if (pkg.description)
                description = pkg.description;
            if (pkg.scripts)
                Object.assign(allScripts, pkg.scripts);
        }
        catch {
            // ignore
        }
    }
    const { endpoints, mountPrefix } = scanApis(projectRoot);
    const envVars = scanEnvVars(projectRoot);
    const hasMultiRepoHints = fs.existsSync(path.join(projectRoot, 'repos.json')) ||
        fs.existsSync(path.join(projectRoot, 'pnpm-workspace.yaml')) ||
        fs.existsSync(path.join(projectRoot, 'go.work')) ||
        fs.existsSync(path.join(projectRoot, 'apps')) ||
        fs.existsSync(path.join(projectRoot, 'packages'));
    const hasMcpTemplate = fs.existsSync(path.join(projectRoot, 'mcp-config.json')) ||
        (fs.existsSync(path.join(projectRoot, 'env.example')) &&
            (safeReadFile(projectRoot, 'env.example') ?? '').includes('MCP'));
    return {
        root: projectRoot,
        name,
        type,
        description,
        tree: scanTree(projectRoot),
        topLevelNotes: topLevelNotes(projectRoot),
        apis: endpoints,
        apiMountPrefix: mountPrefix,
        git: scanGit(projectRoot),
        cursor: scanCursor(projectRoot),
        envVars,
        allScripts,
        hasTests: fs.existsSync(path.join(projectRoot, 'tests')) || fs.existsSync(path.join(projectRoot, 'test')),
        hasCi: fs.existsSync(path.join(projectRoot, '.github', 'workflows')),
        hasDataDir: fs.existsSync(path.join(projectRoot, 'data')),
        hasConfigDir: fs.existsSync(path.join(projectRoot, 'config')),
        agentsMdPath: fs.existsSync(path.join(projectRoot, 'AGENTS.md')) ? 'AGENTS.md' : null,
        htmlPages: scanHtmlPages(projectRoot),
        workflowCommands: scanWorkflowCommands(projectRoot),
        makefileTargets: scanMakefileTargets(projectRoot),
        ciWorkflowNames: scanCiWorkflowNames(projectRoot),
        docMarkdownFiles: scanDocMarkdown(projectRoot),
        portHints: scanPortHints(projectRoot, envVars),
        hasMultiRepoHints,
        hasMcpTemplate,
    };
}
