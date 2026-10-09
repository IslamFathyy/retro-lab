import type { WorkflowCommand } from './types.js';
export declare function scanWorkflowCommands(projectRoot: string): WorkflowCommand[];
export declare function scanMakefileTargets(projectRoot: string): string[];
export declare function scanCiWorkflowNames(projectRoot: string): string[];
export declare function scanDocMarkdown(projectRoot: string): string[];
