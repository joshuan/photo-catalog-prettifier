import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

export const ROOT = path.resolve(path.dirname(__filename), '../../../');

export function resolveByRoot(...file: string[]): string {
    return path.resolve(ROOT, path.join(...file));
}

export function joinPath(...file: string[]): string {
    return path.join(...file);
}

export function getExt(filename: string): string {
    return path.extname(filename);
}

export function getBasename(filename: string, ext: string): string {
    return path.basename(filename, ext);
}

export function getLowerExt(filename: string): string {
    return getExt(filename).toLowerCase();
}
