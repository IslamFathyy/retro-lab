export type SectionStatus = 'present' | 'missing' | 'optional';
export interface ProjectInfo {
    name: string;
    type: string;
    commands: Record<string, string>;
    envVarNames: string[];
}
export interface ReadmeSections {
    description: SectionStatus;
    installation: SectionStatus;
    usage: SectionStatus;
    development: SectionStatus;
    environment: SectionStatus;
    testing: SectionStatus;
    api: SectionStatus;
    deployment: SectionStatus;
}
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
}
