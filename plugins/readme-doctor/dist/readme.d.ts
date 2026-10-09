import type { ImproveResult } from './types.js';
export declare function generateReadme(projectRoot: string): ImproveResult;
export declare function alignReadme(projectRoot: string): ImproveResult;
/** @deprecated Use alignReadme or generateReadme */
export declare function improveReadme(projectRoot: string): ImproveResult;
