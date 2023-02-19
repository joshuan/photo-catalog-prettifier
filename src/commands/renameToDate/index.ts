import { Argv } from 'yargs';
import { exec } from '../../exiftool/index.js';
import { saveData } from '../../utils/database.js';
import { rename } from '../../utils/fs.js';
import { seriesPromise } from '../../utils/promise.js';
import { IExifData } from '../../exiftool/types.js';
import { buildDestination } from './file.js';

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

async function logList<T extends { dest: string; }>(list: T[]): Promise<void> {
    list = list.sort((a, b) => a.dest > b.dest ? 1 : -1);

    await saveData('renames', list);
}

function renameFilesBuilder(root: string, dryRun: boolean) {
    if (dryRun) {
        console.warn(`[DRY-RUN] Renamed will be in folder "${root}".`)
    }

    return async function renameFiles({ src, dest }: { src: string; dest: string }): Promise<string> {
        if (dryRun) {
            return `[DRY-RUN] Rename "${src}" to "${dest}"`;
        }

        await rename(root, src, dest);

        return `${src} was renamed to: "${dest}"`;
    }
}

export async function handler(args: RenameToDateArguments): Promise<void> {
    const { data } = await exec<IExifData[]>(args.path);

    const list = data.map(buildDestination);

    await logList(list);
    console.log(`Found ${list.length} media files.`);

    const result = await seriesPromise(list, renameFilesBuilder(args.path, args.dryRun));

    console.log('✅', result);
}
