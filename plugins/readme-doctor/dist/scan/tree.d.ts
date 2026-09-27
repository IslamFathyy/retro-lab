import type { TreeEntry } from './types.js';
export declare function scanTree(projectRoot: string): TreeEntry[];
export declare function topLevelNotes(projectRoot: string): Record<string, string>;
export declare function renderTree(entries: TreeEntry[], indent?: string): string;
