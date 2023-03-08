import { debugUtil } from '../utils/debug.js';
import { readJson, writeJson } from '../utils/fs.js';
import { resolveByRoot } from '../utils/path.js';

const debug = debugUtil('databaseCache');

export class Cache<T> {
    private cache: T | null = null;
    private cacheName: string;

    constructor(filename: string) {
        debug('init cache "%s"', filename);
        this.cacheName = resolveByRoot('database', filename.replace(/\./g, '_'));
    }

    public async get(): Promise<T | null> {
        debug('get cache');
        if (this.cache !== null) {
            return this.cache;
        }

        try {
            this.cache = await readJson<T>(this.cacheName);

            return this.cache;
        } catch (e) {
            return null;
        }
    }

    public async set(data: T) {
        debug('set cache %s', typeof data);
        this.cache = data;

        await writeJson(this.cacheName, data);
    }
}
