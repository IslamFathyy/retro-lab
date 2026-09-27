export interface TreeEntry {
  path: string;
  type: 'file' | 'directory';
  children?: TreeEntry[];
  note?: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  sourceFile: string;
}

export interface GitInfo {
  remoteUrl: string | null;
  branch: string | null;
  isRepo: boolean;
}

export interface CursorAsset {
  kind: 'rule' | 'agent' | 'skill' | 'command' | 'hook';
  name: string;
  path: string;
  description?: string;
}

export interface EnvVarDoc {
  name: string;
  example?: string;
  description: string;
  source: '.env.example' | 'inferred';
}

export interface ProjectScan {
  root: string;
  name: string;
  type: string;
  description: string;
  tree: TreeEntry[];
  topLevelNotes: Record<string, string>;
  apis: ApiEndpoint[];
  apiMountPrefix: string;
  git: GitInfo;
  cursor: CursorAsset[];
  envVars: EnvVarDoc[];
  allScripts: Record<string, string>;
  hasTests: boolean;
  hasCi: boolean;
  hasDataDir: boolean;
  hasConfigDir: boolean;
  agentsMdPath: string | null;
}
