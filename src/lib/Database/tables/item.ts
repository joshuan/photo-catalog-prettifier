import _ from 'lodash';
import { IGps } from '../../../utils/gps.js';
import { groupFiles } from '../../../utils/group.js';
import { sortImages, sortVideos } from '../../../utils/sort.js';
import { Cache } from '../../Cache.js';

type TType = 'image' | 'video';

interface IMediaItemsFile {
    filename: string;
    originalName: string;
    size: number;
}
interface IMediaItemsExif {
    type: TType;
    gps?: IGps;
    groupId: string;
    timestamp?: number;
    resolution: number;
    mime: string;
    compressor?: string;
}
interface IMediaItemsPreview {
    url: string;
}
type IMediaItemsHash = string;

type TItem<
    F extends IMediaItemsFile,
    E extends IMediaItemsExif,
    P extends IMediaItemsPreview,
    H extends IMediaItemsHash,
> = { file: F; exif: E; preview: P; hash: H; };

export type TCatalogItem = {
    id: string;
    timestamp?: number;
    gps?: IGps;
    preview: string;
    type: TType;
    live: false | { image: string; video: string };
    files: string[];
};

function sortFiles<
    F extends IMediaItemsFile,
    E extends IMediaItemsExif,
    P extends IMediaItemsPreview,
    H extends IMediaItemsHash,
>(files: TItem<F, E, P, H>[]): (TItem<F, E, P, H> & { win?: boolean; })[] {
    const sorted = _.groupBy(files, (file) => file.exif.type);

    const images: { file: F; exif: E; preview: P; hash: H; win?: boolean }[] = sortImages(sorted.image || []);
    if (images[0]) { images[0].win = true; }

    const videos: { file: F; exif: E; preview: P; hash: H; win?: boolean }[] = sortVideos(sorted.video || []);
    if (videos[0]) { videos[0].win = true; }

    return [...images, ...videos];
}

function selectDate<E extends IMediaItemsExif>(files: { exif: E; }[]): number | undefined {
    return files[0].exif.timestamp;
}

function selectGps<E extends IMediaItemsExif>(files: { exif: E; }[]): IGps | undefined {
    return files[0].exif.gps;
}

function selectPreview<T extends IMediaItemsPreview>(files: { preview: T; }[]): string {
    return files[0].preview.url;
}

function selectType<E extends IMediaItemsExif>(files: { exif: E }[]): TType {
    return files[0].exif.type;
}

function selectLive<E extends IMediaItemsExif>(files: { file: { filename: string; }; exif: E }[]): false | { image: string; video: string; } {
    const images = files.filter(file => file.exif.type === 'image');
    const videos = files.filter(file => file.exif.type === 'video');

    if (images.length > 0 && videos.length > 0) {
        return {
            image: images[0].file.filename,
            video: videos[0].file.filename,
        }
    }

    return false;
}

const cache = new Cache<TCatalogItem[]>('items');

interface IMediaItemsOptions {
    useCache?: boolean;
}

export async function buildItems<
    F extends IMediaItemsFile,
    E extends IMediaItemsExif,
    T extends IMediaItemsPreview,
    H extends IMediaItemsHash,
>(
    name: string,
    { files, exifs, previews, hash }: {
        files: Record<string, F>,
        exifs: Record<string, E>,
        previews: Record<string, T>,
        hash: { data: Record<string, H> },
    },
    options: IMediaItemsOptions = {},
): Promise<TCatalogItem[]> {
    const { useCache = true } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    const list = Object.values(files).map(file => ({
        file,
        exif: exifs[file.filename],
        preview: previews[file.filename],
        hash: hash.data[file.filename],
    }));
    const groups = groupFiles(list);

    const result: TCatalogItem[] = [];

    for (const groupId in groups) {
        const groupFiles = sortFiles(groups[groupId]);

        if (groupFiles.length === 0) {
            throw new Error('Empty group!');
        }

        result.push({
            id: groupId,
            timestamp: selectDate(groupFiles),
            gps: selectGps(groupFiles),
            preview: selectPreview(groupFiles),
            type: selectType(groupFiles),
            live: selectLive(groupFiles),
            files: groupFiles.map(file => file.file.filename),
        });
    }

    result.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    await cache.set(name, result);

    return result;
}
