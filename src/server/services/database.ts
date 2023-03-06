import { debugUtil } from '../../lib/debug.js';
import { getBasename } from '../../lib/path.js';
import { buildFiles, TFilesList } from '../utils/files.js';
import { buildItems, TDataItem } from '../utils/items.js';
import { DatabaseCache } from './cache.js';

const debug = debugUtil('database');

interface TData {
    files: TFilesList,
    items: TDataItem[],
}

interface DatabaseInitOptions {
    useCache?: boolean;
    useThumbnails?: boolean;
}

export class Database {
    static async init(path: string, options: DatabaseInitOptions = {}): Promise<Database> {
        const {
            useCache = true,
            useThumbnails = true,
        } = options;

        debug('Database init with path %s', path);

        const cache = new DatabaseCache<TData>(getBasename(path));

        let data = useCache ? await cache.get() : undefined;

        if (!data) {
            debug('Data was not in the cache');

            const files = await buildFiles(path, { useThumbnails });
            const items = await buildItems(Object.values(files));

            data = { files, items };

            await cache.set(data);
        }

        return new Database(path, data);
    }

    constructor(
        public readonly path: string,
        public data: TData,
    ) {}

    public getFileNames() {
        const keys = Object.keys(this.data.files);

        keys.sort((a, b) => (this.data.files[a]?.date || 0) - (this.data.files[b]?.date || 0))

        return keys;
    }

    public getValues() {
        const list = Object.values(this.data);

        list.sort((a, b) => (a.date || 0) - (b.date || 0));

        return list;
    }

    public getFile(key: string) {
        if (!this.data.files[key]) {
            throw new Error('Unknown item', { cause: key });
        }

        return this.data.files[key];
    }

    public async getItems() {
        return this.data.items;
    }
}
