import fs from 'node:fs';
import path from 'node:path';
import type { ImproveResult } from './types.js';
import { analyzeReadme } from './analyzer.js';
import { detectProject } from './detector.js';
import { safeBackupReadme, safeWriteReadme } from './security.js';

function hasSection(content: string, pattern: RegExp): boolean {
  return pattern.test(content);
}

function appendSection(content: string, heading: string, body: string): string {
  const trimmed = content.replace(/\s+$/, '');
  const block = `\n\n## ${heading}\n\n${body}\n`;
  return trimmed ? trimmed + block : `## ${heading}\n\n${body}\n`;
}

function buildInstallationBlock(project: ReturnType<typeof detectProject>): string {
  if (project.type === 'Node.js') {
    return '```bash\nnpm install\n```';
  }
  if (project.type === 'Python') {
    return '```bash\npip install -r requirements.txt\n```\n\n<!-- Adjust if you use pyproject.toml or poetry -->';
  }
  return '<!-- Add installation steps for your stack -->';
}

function buildUsageBlock(project: ReturnType<typeof detectProject>): string {
  const lines: string[] = [];
  if (project.commands.start) {
    lines.push('```bash', 'npm start', '```');
  } else if (project.commands.dev) {
    lines.push('```bash', 'npm run dev', '```');
  } else {
    lines.push('<!-- Describe how to run the project -->');
  }
  return lines.join('\n');
}

function buildDevelopmentBlock(project: ReturnType<typeof detectProject>): string {
  const parts: string[] = ['<!-- Local development workflow -->'];
  if (project.commands.dev) {
    parts.push('', '```bash', 'npm run dev', '```');
  }
  if (project.commands.build) {
    parts.push('', '```bash', 'npm run build', '```');
  }
  if (project.commands.lint) {
    parts.push('', '```bash', 'npm run lint', '```');
  }
  return parts.join('\n');
}

function buildEnvironmentBlock(envVarNames: string[]): string {
  if (envVarNames.length === 0) {
    return 'Copy `.env.example` to `.env` and fill in values locally.\n\n<!-- List variables if needed -->';
  }
  const rows = envVarNames.map((name) => `| \`${name}\` | <!-- description --> |`);
  return [
    'Copy `.env.example` to `.env` and set:',
    '',
    '| Variable | Description |',
    '| --- | --- |',
    ...rows,
  ].join('\n');
}

function buildTestingBlock(project: ReturnType<typeof detectProject>): string {
  if (project.commands.test) {
    return '```bash\nnpm test\n```';
  }
  return '<!-- Add test commands when available -->';
}

/**
 * Safely improve README.md — only adds missing sections from detected project facts.
 * Never invents API endpoints or secret values.
 */
export function improveReadme(projectRoot: string): ImproveResult {
  const readmePath = path.join(projectRoot, 'README.md');
  const created = !fs.existsSync(readmePath);
  const project = detectProject(projectRoot);
  const analysis = analyzeReadme(projectRoot);

  let content = created ? '' : fs.readFileSync(readmePath, 'utf8');

  if (created || !/^#\s/m.test(content)) {
    const title = `# ${project.name}\n\n${project.type} project.\n`;
    content = content ? `${title}\n${content}` : title;
  }

  if (analysis.sections.installation === 'missing') {
    content = appendSection(content, 'Installation', buildInstallationBlock(project));
  }
  if (analysis.sections.usage === 'missing') {
    content = appendSection(content, 'Usage', buildUsageBlock(project));
  }
  if (analysis.sections.development === 'missing') {
    content = appendSection(content, 'Development', buildDevelopmentBlock(project));
  }
  if (analysis.sections.environment === 'missing' && project.envVarNames.length > 0) {
    content = appendSection(content, 'Environment', buildEnvironmentBlock(project.envVarNames));
  }
  if (analysis.sections.testing === 'missing' && project.commands.test) {
    content = appendSection(content, 'Testing', buildTestingBlock(project));
  }

  const backupPath = safeBackupReadme(projectRoot);
  safeWriteReadme(projectRoot, content);

  return {
    success: true,
    message: created
      ? 'Created README.md with scaffolded sections from detected project metadata.'
      : 'Updated README.md with missing sections. Original saved to README.md.backup.',
    readmePath,
    backupPath,
    created,
  };
}
