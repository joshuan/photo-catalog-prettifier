import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

export const ROOT = path.resolve(path.dirname(__filename), '../..');

export function resolve(file: string): string {
    return path.resolve(ROOT, file);
}
