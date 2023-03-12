import { getBasename } from '../../utils/path.js';
import { buildHash, IMediaHashList } from './tables/hash.js';
import { buildExif, IMediaExifList } from './tables/exif.js';
import { buildFiles, IMediaFilesList } from './tables/file.js';
import { buildItems, TCatalogItem } from './tables/item.js';
import { buildPreviews, IMediaPreviewsList } from './tables/preview.js';

interface TData {
    files: IMediaFilesList;
    exifs: IMediaExifList;
    previews: IMediaPreviewsList;
    hash: IMediaHashList;
    items: TCatalogItem[];
}

interface IDatabaseInitOptions {
    useFilesCache?: boolean;
    useExifCache?: boolean;
    usePreviewsCache?: boolean;
    useHashCache?: boolean;
    useItemsCache?: boolean;
}

export class Database {
    static async init(path: string, options: IDatabaseInitOptions = {}): Promise<Database> {
        const { useFilesCache = true, useExifCache = true, usePreviewsCache = true, useHashCache = true, useItemsCache = true } = options;

        const name = getBasename(path);
        const [files, exifs] = await Promise.all([
            buildFiles(name, path, { useCache: useFilesCache }),
            buildExif(name, path, { useCache: useExifCache }),
        ]);
        const previews = await buildPreviews(name, { files, exifs }, { useCache: usePreviewsCache });
        const hash = await buildHash(name, { files, exifs }, { useCache: useHashCache });
        const items = await buildItems(name, { files, exifs, previews, hash }, { useCache: useItemsCache });

        return new Database(name, path, { files, exifs, previews, hash, items });
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

    public getItems(filter?: (item: TCatalogItem) => boolean) {
        return filter ? this.data.items.filter(filter) : this.data.items;
    }
}
