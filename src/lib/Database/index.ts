import _ from 'lodash';
import { getBasename } from '../../utils/path.js';
import { Cache } from '../Cache.js';
import { buildFiles, IFile } from './files/index.js';
import { buildGroups, IGroup } from './groups/index.js';

interface TData {
    files: Record<string, IFile>;
    groups: IGroup[];
}

interface IDatabaseInitOptions {
    useFilesCache?: boolean;
    useGroupsCache?: boolean;
    overwritePreview?: boolean;
}

export class Database {
    static async init(path: string, options: IDatabaseInitOptions = {}): Promise<Database> {
        const { useFilesCache = true, useGroupsCache = true, overwritePreview = false } = options;
        const name = getBasename(path);

        const files = await Cache.withCache(name, 'files', () => buildFiles(path, { overwritePreview }), { useCache: useFilesCache });
        const groups = await Cache.withCache(name, 'groups', () => buildGroups(files), { useCache: useGroupsCache });

        return new Database(name, path, {
            files: _.keyBy(files, 'filepath'),
            groups,
        });
    }

    constructor(
        public readonly name: string,
        public readonly path: string,
        public data: TData,
    ) {}

    public getFile(key: string) {
        if (!this.data.files[key]) {
            throw new Error(`Unknown item ${key}`, { cause: key });
        }

        return this.data.files[key];
    }

    public getData() {
        return this.data;
    }

    public getItems(filter?: (item: IGroup) => boolean): IGroup[] {
        return filter ? this.data.groups.filter(filter) : this.data.groups;
    }
}
