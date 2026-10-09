import fs from 'node:fs';
import path from 'node:path';
import { detectProject } from './detector.js';
import { scanProject } from './scan/index.js';
import { SECTION_TITLE_PATTERNS, resolveSections, } from './section-capabilities.js';
function sectionStatus(content, id) {
    const patterns = SECTION_TITLE_PATTERNS[id];
    const found = patterns.some((re) => re.test(content));
    return found ? 'present' : 'missing';
}
function buildSuggestions(sections, enabledIds, readmeExists) {
    const suggestions = [];
    if (!readmeExists) {
        suggestions.push('Create README.md with /generate-readme (canonical company structure).');
        return suggestions;
    }
    for (const id of enabledIds) {
        if (sections[id] === 'missing' && id !== 'features') {
            const title = id.replace(/_/g, ' ');
            suggestions.push(`Add canonical section: ## ${title} (see references/canonical-readme-outline.md).`);
        }
    }
    if (sections.features === 'missing') {
        suggestions.unshift('Add ## Features immediately after ## Development ports.');
    }
    return suggestions;
}
export function analyzeReadme(projectRoot) {
    const readmePath = path.join(projectRoot, 'README.md');
    const readmeExists = fs.existsSync(readmePath);
    const content = readmeExists ? fs.readFileSync(readmePath, 'utf8') : '';
    const project = detectProject(projectRoot);
    const scan = scanProject(projectRoot);
    const enabled = resolveSections(scan);
    const enabledSectionIds = enabled.map((s) => s.id);
    const sections = {};
    for (const id of enabledSectionIds) {
        sections[id] = sectionStatus(content, id);
    }
    let score = 0;
    for (const id of enabledSectionIds) {
        if (sections[id] === 'present')
            score += 1;
    }
    const maxScore = enabledSectionIds.length;
    const suggestions = buildSuggestions(sections, enabledSectionIds, readmeExists);
    return {
        project: { name: project.name, type: project.type },
        readme: { exists: readmeExists, path: readmePath },
        sections,
        enabledSectionIds,
        score,
        maxScore,
        suggestions,
        detectedCommands: project.commands,
        envVarNames: project.envVarNames,
    };
}
