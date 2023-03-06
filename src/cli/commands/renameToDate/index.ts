import { Argv } from 'yargs';
import { ColonDate, TimeZone } from '../../../lib/date.js';
import { rename } from '../../../lib/fs.js';
import { getBasename, getExt } from '../../../lib/path.js';
import { Database } from '../../../server/services/database.js';

export const command = 'renameToDate <path>';
export const description = 'Rename file to calculated date';

interface RenameToDateArguments {
    path: string;
    defaultPhotoOffset: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<RenameToDateArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .option('defaultPhotoOffset', {
            desc: 'Offset for photo by default (example: +05:00)',
            type: 'string',
            default: '+00:00',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

const names = new Set<string>();

function getOriginalSourceFilename(src: string): string {
    const ext = getExt(src);
    const RE = new RegExp('^\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2}\\s{1}(.*)' + ext + '$');
    const found = RE.exec(src);

    if (found !== null) {
        return found[1] + ext;
    }

    return src;
}

export function createFilename(src: string, date: ColonDate, add = 0): string {
    const dateString = date.clone().plus({ second: add }).setZone(TimeZone.Moscow).toFormat('yyyy-MM-dd_HH-mm-ss');

    const result = dateString + ' ' + src;

    if (names.has(result)) {
        return createFilename(src, date, add + 1);
    }

    names.add(result);

    return result;
}

export async function handler(argv: RenameToDateArguments): Promise<void> {
    const ROOT = argv.path;
    const database = await Database.init(ROOT, { useCache: false, useThumbnails: false });
    const data = await database.getItems();

    for (const item of data) {
        const src = item.files[0].FileName;
        const date = item.date;

        if (!date) {
            continue;
        }

        const dest = createFilename(getOriginalSourceFilename(src), new ColonDate(date * 1000))

        if (src !== dest) {
            console.log(`- ${src} -> ${dest}`);

            if (!argv.dryRun) {
                await rename(ROOT, src, dest);
            }
        }
    }
}
