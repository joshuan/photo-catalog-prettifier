import fs from 'node:fs';
import { debugUtil } from '../utils/debug.js';
import { readJson, writeJson } from '../utils/fs.js';
import { resolveByRoot } from '../utils/path.js';

const debug = debugUtil('cache');

export class Cache<T> {
    constructor(private readonly table: string) {}

    private getPath(name: string) {
        const dir = resolveByRoot(`data/database/${name}`);
        const path = resolveByRoot(`data/database/${name}/${this.table}.json`);

        try { fs.accessSync(dir, fs.constants.F_OK) } catch (err) {
            fs.mkdirSync(dir, { recursive: true });
        }

        return path;
    }

    public async has(name: string): Promise<any | null> {
        const path = this.getPath(name);

        try {
            fs.accessSync(path, fs.constants.F_OK);
        } catch (err) {
            debug('has', this.table, name, false);
            return false;
        }

        debug('has', this.table, name, true);
        return true;
    }

    public async get(name: string): Promise<T> {
        debug('get', this.table, name);
        return await readJson<T>(this.getPath(name));
    }

    public async set(name: string, data: T): Promise<void> {
        debug('set', this.table, name);
        await writeJson(this.getPath(name), data);
    }
}
