import path from 'node:path';
import { Argv } from 'yargs';
import _ from 'lodash';
import { exec } from '../../exiftool/index.js';
import { rename } from '../../utils/fs.js';

export const command = 'groupLivePhotos <path>';
export const description = 'Group live photos and videos by as name';

interface IGroupLivePhotosArguments {
    path: string;
    suffix: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<IGroupLivePhotosArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .options('suffix', {
            desc: 'Suffix for video file',
            type: 'string',
            default: '_live',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

interface IRawPartData {
    SourceFile?: string;
    FileName?: string;
    MIMEType?: string;
    MediaGroupUUID?: string;
    ContentIdentifier?: string;
}

interface IPartData {
    SourceFile: string;
    FileName: string;
    groupUuid: string;
    MIMEType: string;
}

function filterWithoutGroup(item: IRawPartData): boolean {
    return Boolean(item.MediaGroupUUID || item.ContentIdentifier);
}

function parseAndValidateData(item: IRawPartData): IPartData {
    if (!item.SourceFile) { throw new Error('Undefined SourceFile!', { cause: item }); }
    if (!item.FileName) { throw new Error('Undefined FileName!', { cause: item }); }
    if (!item.MIMEType) { throw new Error('Undefined MIMEType!', { cause: item }); }
    if (!item.MediaGroupUUID && !item.ContentIdentifier) {
        throw new Error('Undefined MediaGroupUUID/ContentIdentifier !', { cause: item });
    }

    return {
        SourceFile: item.SourceFile,
        FileName: item.FileName,
        groupUuid: item.MediaGroupUUID || item.ContentIdentifier || '',
        MIMEType: item.MIMEType,
    };
}

function getData(path: string): Promise<IPartData[]> {
    return exec<IPartData[]>(path, ['-FileName', '-MIMEType', '-MediaGroupUUID', '-ContentIdentifier'])
        .then(({ data }) => data.filter(filterWithoutGroup).map(parseAndValidateData));
}

function isImage(item: IPartData) {
    return item.MIMEType.includes('image');
}

function isVideo(item: IPartData) {
    return item.MIMEType.includes('video');
}

function getPair(items: IPartData[]): { image?: IPartData; video?: IPartData; } {
    if (items.length !== 2) {
        throw new Error('Broken pair', { cause: items });
    }

    if (isVideo(items[0]) && isImage(items[1])) {
        return { image: items[1], video: items[0] };
    } else if (isImage(items[0]) && isVideo(items[1])) {
        return { image: items[0], video: items[1] };
    }

    throw new Error('Pair is not from image and video', { cause: items });
}

function calcRename(imageFilename: string, videoFilename: string, suffix: string): string {
    const imageExt = path.extname(imageFilename);
    const imageBase = path.basename(imageFilename, imageExt);

    return imageBase + suffix + path.extname(videoFilename);
}

// Группируем live photos из 2 файлов, по общему MediaGroupUUID - они должны иметь одинаковое имя.
export async function handler(argv: IGroupLivePhotosArguments) {
    const data = await getData(argv.path);

    const list = _.groupBy(data, 'groupUuid');

    for (const items of Object.values(list)) {
        if (items.length < 2) {
            continue;
        }

        const { image, video } = getPair(items);

        if (!image || !video) {
            continue;
        }

        const src = video.FileName;
        const dest = calcRename(image.FileName, video.FileName, argv.suffix);

        if (src !== dest) {
            console.log('-', { src, dest });
            await rename(argv.path, src, dest);
        }
    }

    console.log('✅');
}
