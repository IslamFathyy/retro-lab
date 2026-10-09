#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { analyzeReadme } from './analyzer.js';
import { alignReadme, generateReadme, improveReadme } from './readme.js';
import { resolveProjectPath } from './security.js';
const projectPathSchema = z.object({
    project_path: z
        .string()
        .optional()
        .describe('Absolute or relative path to the project root. Defaults to cwd.'),
});
function formatAnalyzeText(result) {
    const lines = [
        `# README Doctor — ${result.project.name}`,
        '',
        `**Type:** ${result.project.type}`,
        `**README:** ${result.readme.exists ? 'found' : 'missing'} (${result.readme.path})`,
        `**Score:** ${result.score}/${result.maxScore} (canonical sections enabled for this project)`,
        '',
        '## Sections',
    ];
    for (const id of result.enabledSectionIds) {
        lines.push(`- ${id}: ${result.sections[id]}`);
    }
    if (result.detectedCommands && Object.keys(result.detectedCommands).length > 0) {
        lines.push('', '## Detected npm scripts');
        for (const [k, v] of Object.entries(result.detectedCommands)) {
            lines.push(`- ${k}: \`${v}\``);
        }
    }
    if (result.envVarNames.length > 0) {
        lines.push('', '## Env var names (.env.example only)', result.envVarNames.join(', '));
    }
    if (result.suggestions.length > 0) {
        lines.push('', '## Suggestions');
        for (const s of result.suggestions) {
            lines.push(`- ${s}`);
        }
    }
    return lines.join('\n');
}
async function main() {
    const server = new McpServer({
        name: 'readme-doctor',
        version: '1.1.0',
    });
    server.tool('analyze_readme', 'Read-only analysis against the company canonical README outline: sections, score, and suggestions. Never modifies files.', projectPathSchema.shape, async (args) => {
        try {
            const root = resolveProjectPath(args.project_path ?? process.cwd());
            const result = analyzeReadme(root);
            return {
                content: [
                    { type: 'text', text: formatAnalyzeText(result) },
                    { type: 'text', text: JSON.stringify(result, null, 2) },
                ],
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
        }
    });
    server.tool('align_readme', 'Align existing README.md to the company canonical structure (scan-derived content). Requires README.md; creates README.md.backup. Only modifies README.md and backup.', projectPathSchema.shape, async (args) => {
        try {
            const root = resolveProjectPath(args.project_path ?? process.cwd());
            const result = alignReadme(root);
            return improveToolContent(result);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
        }
    });
    server.tool('generate_readme', 'Create README.md with company canonical structure when no README exists. Errors if README.md is already present.', projectPathSchema.shape, async (args) => {
        try {
            const root = resolveProjectPath(args.project_path ?? process.cwd());
            const result = generateReadme(root);
            return improveToolContent(result);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
        }
    });
    server.tool('improve_readme', 'Deprecated: use align_readme (existing README) or generate_readme (new README).', projectPathSchema.shape, async (args) => {
        try {
            const root = resolveProjectPath(args.project_path ?? process.cwd());
            const result = improveReadme(root);
            return improveToolContent(result);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
        }
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
function improveToolContent(result) {
    return {
        content: [
            {
                type: 'text',
                text: `${result.message}\n\nREADME: ${result.readmePath}\nBackup: ${result.backupPath ?? '(none — new file)'}\nAPIs: ${result.scanSummary?.apiCount ?? 0} | Cursor assets: ${result.scanSummary?.cursorAssets ?? 0}`,
            },
            { type: 'text', text: JSON.stringify(result, null, 2) },
        ],
    };
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
