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

export class Database {
    static async init(path: string): Promise<Database> {
        const [files, exifs] = await Promise.all([buildFiles(path), buildExif(path)]);
        const [previews, hash] = await Promise.all([buildPreviews(files, exifs), buildHash(files, exifs)]);
        const items = await buildItems(files, exifs, previews, hash);

        return new Database(path, { files, exifs, previews, hash, items });
    }

    constructor(
        public readonly path: string,
        public data: TData,
    ) {}

    public getFile(key: string) {
        if (!this.data.files[key]) {
            throw new Error('Unknown item', { cause: key });
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
