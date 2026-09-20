#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { analyzeReadme } from './analyzer.js';
import { improveReadme } from './readme.js';
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
        `**Score:** ${result.score}/${result.maxScore}`,
        '',
        '## Sections',
    ];
    for (const [key, status] of Object.entries(result.sections)) {
        lines.push(`- ${key}: ${status}`);
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
        version: '1.0.0',
    });
    server.tool('analyze_readme', 'Read-only analysis of README.md quality: sections, score, and suggestions. Never modifies files.', projectPathSchema.shape, async (args) => {
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
    server.tool('improve_readme', 'Safely update README.md only. Creates README.md.backup before edits. Uses detected scripts and .env.example names only — never invents APIs or reads .env secrets.', projectPathSchema.shape, async (args) => {
        try {
            const root = resolveProjectPath(args.project_path ?? process.cwd());
            const result = improveReadme(root);
            return {
                content: [
                    {
                        type: 'text',
                        text: `${result.message}\n\nREADME: ${result.readmePath}\nBackup: ${result.backupPath ?? '(none — new file)'}`,
                    },
                    { type: 'text', text: JSON.stringify(result, null, 2) },
                ],
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
        }
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
