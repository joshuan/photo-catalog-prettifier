import { debugUtil } from '../../lib/debug.js';
import { buildThumbnail } from '../../cli/commands/buildData/thumbnail.js';
import { buildDate } from '../../lib/exifdate/index.js';
import { ExifTool, IExifPartialData, IExifRequiredData } from '../../lib/exiftool.js';
import { buildGps } from '../../lib/gps.js';
import { getBasename } from '../../lib/path.js';
import { DatabaseCache } from './cache.js';

export type TDatabaseItem = {
    SourceFile: IExifRequiredData['SourceFile'],
    Directory: IExifRequiredData['Directory'],
    FileName: IExifRequiredData['FileName'],
    exif: IExifPartialData,
    date?: number,
    gps?: { lat: number; lon: number };
    thumbnailFile: string;
    thumbnailUrl: string;
    type: 'image' | 'video';
    groupId: string | null;
    size: number;
    imageSize: number;
};
type TList = Record<string, TDatabaseItem>;

const debug = debugUtil('database');

export class Database {
    static async init(path: string): Promise<Database> {
        const cache = new DatabaseCache<TDatabaseItem>(getBasename(path));

        let data = await cache.get();

        if (!data) {
            debug('Data was not in the cache');

            const tool = new ExifTool(path)
            const found = await tool.getFullData();
            data = {};

            for (const item of found) {
                const thumbnail = await buildThumbnail(item);
                data[item.FileName] = {
                    SourceFile: item.SourceFile,
                    Directory: item.Directory,
                    FileName: item.FileName,
                    exif: item,
                    date: buildDate(item)?.getTime(),
                    gps: buildGps(item),
                    thumbnailFile: thumbnail,
                    thumbnailUrl: `/thumbnails/${getBasename(thumbnail)}`,
                    type: ExifTool.getType(item.MIMEType),
                    groupId: ExifTool.getGroupId(item),
                    size: await ExifTool.calcFileSize(item),
                    imageSize: ExifTool.calcImageSize(item),
                };
            }

            await cache.set(data);
        }

        return new Database(path, data);
    }

    constructor(public readonly path: string, public data: TList) {}

    public getKeys() {
        const keys = Object.keys(this.data);

        keys.sort((a, b) => (this.data[a]?.date || 0) - (this.data[b]?.date || 0))

        return keys;
    }

    public getValues() {
        const list = Object.values(this.data);

        list.sort((a, b) => (a.date || 0) - (b.date || 0));

        return list;
    }

    public getItem(key: string) {
        if (!this.data[key]) {
            throw new Error('Unknown item', { cause: key });
        }

        return this.data[key];
    }
}
