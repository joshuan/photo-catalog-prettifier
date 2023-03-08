import { v4 as uuid } from 'uuid';
import { Compare } from '../../lib/Compare.js';
import { debugUtil } from '../../utils/debug.js';
import { getBasename } from '../../utils/path.js';
import { buildFiles, TFilesItem, TFilesMap } from '../utils/files.js';
import { buildItems, TDataItem } from '../utils/items.js';
import { DatabaseCache } from './cache.js';
import pLimit from 'p-limit';
import os from 'os';

const debug = debugUtil('database');
const limit = pLimit(os.cpus().length);

interface TData {
    files: TFilesMap,
    items: TDataItem[],
}

interface DatabaseInitOptions {
    useCache?: boolean;
    useThumbnails?: boolean;
}

const compare = new Compare();

interface CompareItem {
    FileName: string;
    thumbnailFile: string | null;
}

async function compareFiles(first: CompareItem, second: CompareItem): Promise<{ files: [string, string]; compare: number; }> {
    return {
        files: [ first.FileName, second.FileName ],
        compare: await compare.diff(first.thumbnailFile as string, second.thumbnailFile as string),
    };
}

async function buildDiffs(files: TFilesMap): Promise<any> {
    const list = Object.values(files).map(({ FileName, thumbnailFile }) => ({ FileName, thumbnailFile }));
    const pairFiles = [];

    for (let i = 0 ; i < list.length ; i++) {
        for (let j = i + 1; j < list.length; j++) {
            pairFiles.push([list[i], list[j]]);
        }
    }

    const pairs = await Promise.all(pairFiles.map(([ first, second ]) => limit(() => compareFiles(first, second))));

    const database: Record<string, string> = {};

    for (const { files, compare } of pairs) {
        const first = files[0] as string;
        const second = files[1] as string;

        if (compare === 0) {
            if (!database[first]) {
                database[first] = uuid();
            }
            database[second] = database[first];
        }
    }

    return database;
}

function applyDiffs(files: TFilesMap, diffs: Record<string, string>): TFilesMap {
    for (const file in files) {
        if (diffs[file]) {
            files[file].compareHash = diffs[file];
        }
    }

    return files;
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
            debug('Files was built');
            const diffs = await buildDiffs(files);
            debug('Differences was built');
            const items = await buildItems(Object.values(applyDiffs(files, diffs)));
            debug('Items was built');

            data = { files, items };
        }

        await cache.set(data);

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
