import type { ApiEndpoint } from './types.js';
export declare function scanApis(projectRoot: string): {
    endpoints: ApiEndpoint[];
    mountPrefix: string;
};
