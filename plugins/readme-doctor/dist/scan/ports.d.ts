import type { PortHint } from './types.js';
export declare function scanPortHints(projectRoot: string, envVars: {
    name: string;
    example?: string;
}[]): PortHint[];
