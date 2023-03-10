import { Argv } from 'yargs';
import { rename } from '../../../utils/fs.js';
import { getBasename, getExt } from '../../../utils/path.js';
import { Database } from '../../../lib/Database/index.js';

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
    const database = await Database.init(ROOT);
    const data = database.getData();

    for (const item of data.items) {
        if (!item.live) {
            continue;
        }

        let image = data.files[item.live.image];
        let video = data.files[item.live.video];

        const src = video.filename;
        const dest = calcRename(image.filename, video.filename, argv.suffix);

        if (src !== dest) {
            console.log('-', src, '->', dest);
            if (!argv.dryRun) {
                await rename(argv.path, src, dest);
            }
        }
    }
}
