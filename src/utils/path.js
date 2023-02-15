import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

export const ROOT = path.resolve(path.dirname(__filename), '../..');

export function resolve(file) {
    return path.resolve(ROOT, file);
}

export function getLowerExt(filename) {
    return path.extname(filename).toLowerCase();
}
