import type { ProjectInfo } from './types.js';
export declare function detectProject(projectRoot: string): ProjectInfo;
/** Names only — never read .env values. */
export declare function detectEnvVarNames(projectRoot: string): string[];
