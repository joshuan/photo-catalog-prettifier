import { readJson, writeJson } from '../../lib/fs.js';
import { resolveByRoot } from '../../lib/path.js';

export class DatabaseCache<T> {
    private cache: Record<string, T> | null = null;
    private cacheName: string;

    constructor(filename: string) {
        this.cacheName = resolveByRoot('database', filename.replace(/\./g, '_'));
    }

    public async get(): Promise<Record<string, T> | null> {
        if (this.cache !== null) {
            return this.cache;
        }

        try {
            this.cache = await readJson<Record<string, T>>(this.cacheName);

            return this.cache;
        } catch (e) {
            return null;
        }
    }

    public async set(data: Record<string, T>) {
        this.cache = data;

        await writeJson(this.cacheName, data);
    }
}
