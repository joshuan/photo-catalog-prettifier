import debug from 'debug';

export const debugUtil = (part: string) => debug(`pcp:${part}`);

export type { Debugger } from 'debug';
