import type { ProjectScan } from './scan/types.js';

export type SectionId =
  | 'quick_start'
  | 'setup_5min'
  | 'team_onboarding'
  | 'prerequisites'
  | 'repository_structure'
  | 'development_ports'
  | 'features'
  | 'mcp_optional'
  | 'ai_agent_integration'
  | 'ai_concepts'
  | 'typical_workflow'
  | 'documentation_map'
  | 'security'
  | 'links';

export interface CanonicalSection {
  id: SectionId;
  title: string;
  anchor: string;
}

const DEFINITIONS: Record<SectionId, { title: string }> = {
  quick_start: { title: 'Quick start' },
  setup_5min: { title: '5-minute setup' },
  team_onboarding: { title: 'Team onboarding' },
  prerequisites: { title: 'Prerequisites' },
  repository_structure: { title: 'Repository structure' },
  development_ports: { title: 'Development ports' },
  features: { title: 'Features' },
  mcp_optional: { title: 'MCP Integration Setup (optional)' },
  ai_agent_integration: { title: 'AI Agent Integration' },
  ai_concepts: { title: 'AI concepts in this repo' },
  typical_workflow: { title: 'Typical workflow' },
  documentation_map: { title: 'Documentation map' },
  security: { title: 'Security' },
  links: { title: 'Links' },
};

function anchorFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function resolveSections(scan: ProjectScan): CanonicalSection[] {
  const hasQuickScripts =
    Object.keys(scan.allScripts).some((k) => ['start', 'dev', 'build'].includes(k)) ||
    scan.makefileTargets.length > 0;

  const hasCursorWorkflow = scan.workflowCommands.length > 0 || scan.cursor.length > 0;
  const hasHttpApi = scan.apis.length > 0;
  const hasStaticUi = scan.htmlPages.length > 0;

  const enabled = new Set<SectionId>([
    'prerequisites',
    'repository_structure',
    'development_ports',
    'features',
    'security',
    'links',
  ]);

  if (hasQuickScripts) {
    enabled.add('quick_start');
    enabled.add('setup_5min');
  }
  if (scan.hasMultiRepoHints) enabled.add('team_onboarding');
  if (scan.hasMcpTemplate) enabled.add('mcp_optional');
  if (hasCursorWorkflow) {
    enabled.add('ai_agent_integration');
    enabled.add('ai_concepts');
  }
  if (scan.workflowCommands.length > 0 || scan.makefileTargets.length > 0) {
    enabled.add('typical_workflow');
  }
  if (scan.docMarkdownFiles.length > 0) enabled.add('documentation_map');

  // Ensure features has substance signal — still always on per company standard
  void hasHttpApi;
  void hasStaticUi;

  const order: SectionId[] = [
    'quick_start',
    'setup_5min',
    'team_onboarding',
    'prerequisites',
    'repository_structure',
    'development_ports',
    'features',
    'mcp_optional',
    'ai_agent_integration',
    'ai_concepts',
    'typical_workflow',
    'documentation_map',
    'security',
    'links',
  ];

  return order
    .filter((id) => enabled.has(id))
    .map((id) => ({
      id,
      title: DEFINITIONS[id].title,
      anchor: anchorFromTitle(DEFINITIONS[id].title),
    }));
}

export const SECTION_TITLE_PATTERNS: Record<SectionId, RegExp[]> = {
  quick_start: [/^##\s*quick\s+start/im],
  setup_5min: [/^##\s*5-minute\s+setup/im],
  team_onboarding: [/^##\s*team\s+onboarding/im],
  prerequisites: [/^##\s*prerequisites/im],
  repository_structure: [/^##\s*repository\s+structure/im],
  development_ports: [/^##\s*development\s+ports/im],
  features: [/^##\s*features/im],
  mcp_optional: [/^##\s*mcp\s+integration/im],
  ai_agent_integration: [/^##\s*ai\s+agent\s+integration/im],
  ai_concepts: [/^##\s*ai\s+concepts/im],
  typical_workflow: [/^##\s*typical\s+workflow/im],
  documentation_map: [/^##\s*documentation\s+map/im],
  security: [/^##\s*security/im],
  links: [/^##\s*links/im],
};
