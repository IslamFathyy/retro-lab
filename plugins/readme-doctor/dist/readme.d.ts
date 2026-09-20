import type { ImproveResult } from './types.js';
/**
 * Safely improve README.md — only adds missing sections from detected project facts.
 * Never invents API endpoints or secret values.
 */
export declare function improveReadme(projectRoot: string): ImproveResult;
