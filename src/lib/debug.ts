import debug from 'debug';

export const debugUtil = (part: string) => debug(`photo-catalog-prettifier:${part}`);

export type { Debugger } from 'debug';
