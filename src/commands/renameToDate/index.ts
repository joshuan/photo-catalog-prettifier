import { Argv } from 'yargs';
import { exec } from '../../exiftool/index.js';
import { seriesPromise } from '../../utils/promise.js';
import { IExifData } from '../../exiftool/types.js';
import { buildDestination } from './file.js';

export const command = 'renameToDate <path>';
export const description = 'Rename file to calculated date';

interface RenameToDateArguments { path: string; }

export function builder(argv: Argv): Argv<RenameToDateArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        });
}

function logList<T extends { dest: string; }>(list: T[]): T[] {
    list.sort((a, b) => a.dest > b.dest ? 1 : -1)

    console.log(list);

    return list;
}

function renameFiles({ src, dest }: { src: string; dest: string }): Promise<void> {
    console.log('Rename %s to %s', src, dest);
    return Promise.resolve();
}

export function handler(args: RenameToDateArguments): Promise<void> {
    return exec<IExifData[]>(args.path)
        .then(({ data }) => data.map(buildDestination))
        .then(logList)
        .then((list) => seriesPromise(list, renameFiles))
        .then(() => console.log('✅'))
        .catch(err => console.error(err));
}
