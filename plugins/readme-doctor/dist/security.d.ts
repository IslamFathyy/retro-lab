/**
 * Resolve and validate project_path. Rejects traversal and non-directories.
 */
export declare function resolveProjectPath(projectPath: string, cwd?: string): string;
/** Read file only if it is under projectRoot (no escape via symlinks beyond simple check). */
export declare function safeReadFile(projectRoot: string, relativePath: string): string | null;
export declare function safeWriteReadme(projectRoot: string, content: string): void;
export declare function safeBackupReadme(projectRoot: string): string | null;
