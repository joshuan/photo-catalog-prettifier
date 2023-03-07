import _ from 'lodash';
import { TFilesItem } from './files.js';
import { sortImages, sortVideos } from './sort.js';

export type TDataItem = {
    id: string;
    date?: number;
    gps?: { lat: string; lon: string };
    thumbnail: string | null;
    type: 'image' | 'video';
    live: boolean;
    files: TFilesItem[];
};

function sortFiles(files: TFilesItem[]): TFilesItem[] {
    const sorted = _.groupBy(files, 'type');

    const images = sortImages(sorted.image || []);
    if (images[0]) { images[0].win = true; }

    const videos = sortVideos(sorted.video || []);
    if (videos[0]) { videos[0].win = true; }

    return [...images, ...videos];
}

function selectDate(files: TFilesItem[]): TFilesItem['date'] {
    return files[0]?.date;
}

function selectGps(files: TFilesItem[]): TFilesItem['gps'] {
    return files[0].gps;
}

function selectThumbnail(files: TFilesItem[]): TFilesItem['thumbnailUrl'] {
    return files[0].thumbnailUrl;
}

function selectType(files: TFilesItem[]): TFilesItem['type'] {
    return files[0].type;
}

function selectLive(files: TFilesItem[]): boolean {
    return true;
}

export async function buildItems(files: TFilesItem[]): Promise<TDataItem[]> {
    const filesWithGroup = files.filter(file => Boolean(file.groupId));
    const filesWithoutGroup = files.filter(file => !Boolean(file.groupId));
    const groups = _.groupBy(filesWithGroup, 'groupId');

    const data: TDataItem[] = [];

    for (const file of filesWithoutGroup) {
        data.push({
            id: file.FileName,
            date: file.date,
            gps: file.gps,
            thumbnail: file.thumbnailUrl,
            type: file.type,
            live: false,
            files: [{ ...file, win: true }],
        });
    }

    for (const groupId in groups) {
        const groupFiles = sortFiles(groups[groupId]);

        data.push({
            id: groupFiles[0].FileName,
            date: selectDate(groupFiles),
            gps: selectGps(groupFiles),
            thumbnail: selectThumbnail(groupFiles),
            type: selectType(groupFiles),
            live: selectLive(groupFiles),
            files: groupFiles,
        });
    }

    data.sort((a, b) => (a.date || 0) - (b.date || 0));

    return data;
}
