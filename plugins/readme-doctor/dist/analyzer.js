import fs from 'node:fs';
import path from 'node:path';
import { detectProject } from './detector.js';
const SECTION_PATTERNS = {
    description: [/^#\s/m, /^##\s*(about|overview|description)/im],
    installation: [/^##\s*(install(ation)?|getting\s+started|setup)/im],
    usage: [/^##\s*(usage|how\s+to\s+use|quick\s+start)/im],
    development: [/^##\s*(develop(ment)?|contributing|local\s+dev)/im],
    environment: [/^##\s*(environment|env(\s+vars)?|configuration|config)/im],
    testing: [/^##\s*(test(ing)?|running\s+tests)/im],
    api: [/^##\s*(api|endpoints|rest)/im],
    deployment: [/^##\s*(deploy(ment)?|production|release)/im],
};
const REQUIRED = [
    'description',
    'installation',
    'usage',
    'development',
    'environment',
    'testing',
];
const OPTIONAL = ['api', 'deployment'];
function sectionStatus(content, key) {
    if (OPTIONAL.includes(key)) {
        const found = SECTION_PATTERNS[key].some((re) => re.test(content));
        return found ? 'present' : 'optional';
    }
    const found = SECTION_PATTERNS[key].some((re) => re.test(content));
    return found ? 'present' : 'missing';
}
function scoreSections(sections) {
    let score = 0;
    const maxScore = REQUIRED.length;
    for (const key of REQUIRED) {
        if (sections[key] === 'present')
            score += 1;
    }
    return { score, maxScore };
}
function buildSuggestions(sections, project, readmeExists) {
    const suggestions = [];
    if (!readmeExists) {
        suggestions.push('Create a README.md at the project root.');
    }
    if (sections.description === 'missing') {
        suggestions.push('Add a project description (title or ## About section).');
    }
    if (sections.installation === 'missing') {
        suggestions.push('Add an ## Installation section with setup steps.');
    }
    if (sections.usage === 'missing') {
        suggestions.push('Add a ## Usage section explaining how to run the project.');
    }
    if (sections.development === 'missing') {
        suggestions.push('Add a ## Development section for local contributor workflow.');
    }
    if (sections.environment === 'missing' && project.envVarNames.length > 0) {
        suggestions.push(`Add an ## Environment section documenting: ${project.envVarNames.join(', ')}.`);
    }
    else if (sections.environment === 'missing') {
        suggestions.push('Add an ## Environment section if the project uses configuration.');
    }
    if (sections.testing === 'missing' && project.commands.test) {
        suggestions.push(`Document testing — detected script: npm test (${project.commands.test}).`);
    }
    else if (sections.testing === 'missing') {
        suggestions.push('Add a ## Testing section if tests exist.');
    }
    if (sections.api === 'optional' && project.type === 'Node.js') {
        suggestions.push('Consider an ## API section if this project exposes HTTP endpoints.');
    }
    return suggestions;
}
export function analyzeReadme(projectRoot) {
    const readmePath = path.join(projectRoot, 'README.md');
    const readmeExists = fs.existsSync(readmePath);
    const content = readmeExists ? fs.readFileSync(readmePath, 'utf8') : '';
    const project = detectProject(projectRoot);
    const sections = {};
    for (const key of Object.keys(SECTION_PATTERNS)) {
        sections[key] = sectionStatus(content, key);
    }
    const { score, maxScore } = scoreSections(sections);
    const suggestions = buildSuggestions(sections, project, readmeExists);
    return {
        project: { name: project.name, type: project.type },
        readme: { exists: readmeExists, path: readmePath },
        sections,
        score,
        maxScore,
        suggestions,
        detectedCommands: project.commands,
        envVarNames: project.envVarNames,
    };
}
