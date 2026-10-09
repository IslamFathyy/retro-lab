import type { ProjectScan } from './scan/types.js';
export interface BuildReadmeOptions {
    preservedTagline?: string | null;
}
export declare function extractTaglineFromReadme(content: string): string | null;
export declare function buildCanonicalReadme(scan: ProjectScan, options?: BuildReadmeOptions): string;
