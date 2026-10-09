import type { ProjectScan } from './scan/types.js';
export type SectionId = 'quick_start' | 'setup_5min' | 'team_onboarding' | 'prerequisites' | 'repository_structure' | 'development_ports' | 'features' | 'mcp_optional' | 'ai_agent_integration' | 'ai_concepts' | 'typical_workflow' | 'documentation_map' | 'security' | 'links';
export interface CanonicalSection {
    id: SectionId;
    title: string;
    anchor: string;
}
export declare function resolveSections(scan: ProjectScan): CanonicalSection[];
export declare const SECTION_TITLE_PATTERNS: Record<SectionId, RegExp[]>;
