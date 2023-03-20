import _ from 'lodash';
import { debugUtil } from '../../../utils/debug.js';
import { filterTrue } from '../../../utils/filter.js';
import { IGps } from '../../../utils/gps.js';
import { groupFiles } from '../../../utils/group.js';
import { sortImages, sortVideos } from '../../../utils/sort.js';
import { Cache } from '../../Cache.js';

type TType = 'image' | 'video';

interface IMediaGroup {
    file: {
        filename: string;
        fileinfo: {
            originalName: string;
            size: number;
        };
        exif: {
            type: TType;
            gps?: IGps;
            groupId: string;
            timestamp?: number;
            resolution: number;
            mime: string;
            compressor?: string;
        };
    };
    preview: {
        url: string;
    };
}

export type TCatalogGroup = {
    id: string;
    timestamp?: number;
    gps?: IGps;
    preview: string;
    type: TType;
    live: false | { image: string; video: string };
    files: string[];
};

const debug = debugUtil('database:item');

function sortFiles<G extends IMediaGroup>(files: G[]): (G & { win?: boolean; })[] {
    const sorted = _.groupBy(files, (file) => file.file.exif.type);

    const images: (G & { win?: boolean })[] = sortImages(sorted.image || []);
    if (images[0]) { images[0].win = true; }

    const videos: (G & { win?: boolean })[] = sortVideos(sorted.video || []);
    if (videos[0]) { videos[0].win = true; }

    return [...images, ...videos];
}

function selectDate<G extends IMediaGroup>(files: G[]): number | undefined {
    return files[0].file.exif.timestamp;
}

function selectGps<G extends IMediaGroup>(files: G[]): IGps | undefined {
    return files[0].file.exif.gps;
}

function selectPreview<G extends IMediaGroup>(files: G[]): string {
    return files[0].preview.url;
}

function selectType<G extends IMediaGroup>(files: G[]): TType {
    return files[0].file.exif.type;
}

function selectLive<G extends IMediaGroup>(files: G[]): false | { image: string; video: string; } {
    const images = files.filter(file => file.file.exif.type === 'image');
    const videos = files.filter(file => file.file.exif.type === 'video');

    if (images.length > 0 && videos.length > 0) {
        return {
            image: images[0].file.filename,
            video: videos[0].file.filename,
        }
    }

    return false;
}

function buildCatalogGroup<G extends IMediaGroup>(group: G[]): TCatalogGroup {
    const groupFiles = sortFiles(group);

    if (groupFiles.length === 0) {
        throw new Error('Empty group!');
    }

    return {
        id: groupFiles[0].file.filename,
        timestamp: selectDate(groupFiles),
        gps: selectGps(groupFiles),
        preview: selectPreview(groupFiles),
        type: selectType(groupFiles),
        live: selectLive(groupFiles),
        files: groupFiles.map(file => file.file.filename),
    };
}

const DATA_FIX_DATA: Record<string, number> = {
    'SAM_1899.JPG': new Date('2010-08-13T17:45:00Z').getTime(),
    'SAM_1882 (2).JPG': new Date('2010-08-13T00:00:00Z').getTime(),
    'IMG_0088.JPG': new Date('2010-08-13T00:00:00Z').getTime(),
    'IMG_0084.JPG': new Date('2010-08-13T00:00:00Z').getTime(),
    '1 (3).jpg': new Date('2010-08-13T00:00:00Z').getTime(),
    '2 - 235.MP4': new Date('2010-08-14T15:00:00Z').getTime(),
    '2 - 234.MP4': new Date('2010-08-14T15:10:00Z').getTime(),
    '2010 - 1310.jpg': new Date('2010-08-14T14:38:00Z').getTime(),
    '2010 - 1311.jpg': new Date('2010-08-14T14:39:00Z').getTime(),
    '2010 - 1312(1).JPG': new Date('2010-08-14T14:40:00Z').getTime(),
    '2010 - 1313.jpg': new Date('2010-08-14T14:41:00Z').getTime(),
    '2010 - 1314.jpg': new Date('2010-08-14T14:41:10Z').getTime(),
    '2010 - 1315.jpg': new Date('2010-08-14T14:41:20Z').getTime(),
    '2010 - 1316.jpg': new Date('2010-08-14T14:42:00Z').getTime(),
    '2010 - 1317.jpg': new Date('2010-08-14T14:43:00Z').getTime(),
    '2010 - 1318.jpg': new Date('2010-08-14T14:44:00Z').getTime(),
    '2010 - 1319(1).JPG': new Date('2010-08-14T14:45:00Z').getTime(),
    '2010 - 1320.jpg': new Date('2010-08-14T14:45:10Z').getTime(),
    '2010 - 1321(1).JPG': new Date('2010-08-14T14:50:00Z').getTime(),

    '2010 - 447(1).JPG': new Date('2010-08-13T17:40:00Z').getTime(),
    '2010 - 448(1).JPG': new Date('2010-08-13T17:41:00Z').getTime(),

    '2010 - 449(1).JPG': new Date('2010-08-13T17:45:00Z').getTime(),
    '2010 - 450.jpg': new Date('2010-08-13T17:45:10Z').getTime(),
    '2010 - 451(1).JPG': new Date('2010-08-13T17:45:20Z').getTime(),
};

function fixData(list: TCatalogGroup[]): TCatalogGroup[] {
    const withoutDate: number[] = [];

    for (const i in list) {
        const id = list[i].id;

        if (DATA_FIX_DATA[id]) {
            list[i].timestamp = Math.ceil(DATA_FIX_DATA[id] / 1000);
        }

        if (!list[i].timestamp) {
            withoutDate.push(parseInt(i, 10));
        }
    }

    const minDate = Math.min(...filterTrue(list.map(item => item.timestamp)));

    for (const i of withoutDate) {
        list[i].timestamp = minDate;
    }

    return list;
}

const cache = new Cache<TCatalogGroup[]>('items');

interface IMediaGroupsOptions {
    useCache?: boolean;
}

export async function buildGroups<
    F extends IMediaGroup['file'],
    P extends IMediaGroup['preview'],
>(
    name: string,
    { files, previews }: {
        files: Record<string, F>,
        previews: Record<string, P>,
    },
    options: IMediaGroupsOptions = {},
): Promise<TCatalogGroup[]> {
    const { useCache = true } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    debug('Start build group data');

    const list = Object.values(files).map(file => ({
        file,
        preview: previews[file.filename],
    }));

    const groups = groupFiles(list);
    const result = fixData(groups.map(buildCatalogGroup));

    result.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    await cache.set(name, result);

    debug('Finish build group data');

    return result;
}
