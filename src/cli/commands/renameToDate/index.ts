import { Argv } from 'yargs';
import { ColonDate, TimeZone } from '../../../lib/ColonDate.js';
import { getOriginalSourceFilename } from '../../../utils/filename.js';
import { rename } from '../../../utils/fs.js';
import { Database } from '../../../lib/Database.js';

export const command = 'renameToDate <path>';
export const description = 'Rename file to calculated date';

interface RenameToDateArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<RenameToDateArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

const names = new Set<string>();

export function createFilename(src: string, date: ColonDate, add = 0): string {
    const dateString = date.clone().plus({ second: add })
        .setZone(process.env.TIMEZONE)
        .toFormat('yyyy-MM-dd_HH-mm-ss');

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
