import type { SectionId } from './section-capabilities.js';
export type SectionStatus = 'present' | 'missing' | 'optional';
export interface ProjectInfo {
    name: string;
    type: string;
    commands: Record<string, string>;
    envVarNames: string[];
}
export type ReadmeSections = Partial<Record<SectionId, SectionStatus>>;
export interface AnalyzeResult {
    project: {
        name: string;
        type: string;
    };
    readme: {
        exists: boolean;
        path: string;
    };
    sections: ReadmeSections;
    enabledSectionIds: SectionId[];
    score: number;
    maxScore: number;
    suggestions: string[];
    detectedCommands: Record<string, string>;
    envVarNames: string[];
}
export interface ImproveResult {
    success: boolean;
    message: string;
    readmePath: string;
    backupPath: string | null;
    created: boolean;
    generatedDocs: string[];
    scanSummary?: {
        apiCount: number;
        cursorAssets: number;
        topLevelDirs: number;
    };
}
