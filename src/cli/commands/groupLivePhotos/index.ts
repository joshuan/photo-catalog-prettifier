import { Argv } from 'yargs';
import { rename } from '../../../utils/fs.js';
import { getBasename, getExt } from '../../../utils/path.js';
import { Database } from '../../../lib/Database.js';

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
            default: ' (live)',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

function calcRename(imageFilename: string, videoFilename: string, suffix: string): string {
    const imageExt = getExt(imageFilename);
    const imageBase = getBasename(imageFilename, imageExt);

    return imageBase + suffix + getExt(videoFilename);
}

// Группируем live photos из 2 файлов, по общему MediaGroupUUID - они должны иметь одинаковое имя.
export async function handler(argv: IGroupLivePhotosArguments) {
    const ROOT = argv.path;
    const database = await Database.init(ROOT, { useCache: false, useThumbnails: false });
    const items = await database.getItems();

    for (const item of items) {
        if (item.files.length !== 2) {
            continue;
        }

        let image = null;
        let video = null;

        if (item.files[0].type === 'image' && item.files[1].type === 'video') {
            image = item.files[0];
            video = item.files[1];
        } else if (item.files[0].type === 'video' && item.files[1].type === 'image') {
            image = item.files[1];
            video = item.files[0];
        } else {
            console.error(item);
            throw new Error('Broken pair', { cause: item });
        }

        const src = video.FileName;
        const dest = calcRename(image.FileName, video.FileName, argv.suffix);

        if (src !== dest) {
            console.log('-', src, '->', dest);
            if (!argv.dryRun) {
                await rename(argv.path, src, dest);
            }
        }
    }
}
