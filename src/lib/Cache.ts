import { debugUtil } from '../utils/debug.js';
import { readJson, writeJson } from '../utils/fs.js';
import { resolveByRoot } from '../utils/path.js';

const debug = debugUtil('cache');

export class Cache<T> {
    private data: T | null = null;
    private readonly name: string;
    private readonly path: string;

    constructor(filename: string) {
        debug('init', filename);
        this.name = filename.replace(/[\s\.]/g, '_');
        this.path = resolveByRoot('database', this.name);
    }

    public async get(): Promise<T | null> {
        if (this.data !== null) {
            debug('get from memory');
            return this.data;
        }

        try {
            debug('get from file');
            this.data = await readJson<T>(this.name);

            return this.data;
        } catch (e) {
            return null;
        }
    }

    public async set(data: T) {
        debug('set', typeof data);
        this.data = data;

        await writeJson(this.name, data);
    }
}
