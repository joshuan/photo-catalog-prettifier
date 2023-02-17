import { exec } from '../../exiftool/index.js';
import { seriesPromise } from '../../utils/promise.js';
import { getLowerExt } from '../../utils/path.js';
import { calculateDate, buildFilenameDateString } from './date.js';
import { IExifData } from '../../exiftool/types.js';
import { Arguments, Argv } from 'yargs';

export const command = 'saveOriginalNameToComment <path>';
export const description = 'Save original file name to comment in all files from path';

interface ReanemToDateArguments { path: string; };

export function builder(yargs: Argv) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        });
}

function createFilename(date: Date, names: Set<string>, add = 0): string {
    const result = buildFilenameDateString(date, add);

    if (names.has(result)) {
        return createFilename(date, names, add+1);
    }

    names.add(result);

    return result;
}

function updateFilename(item: IExifData, names: Set<string>) {
    const date = calculateDate(item);
    const ext = getLowerExt(item.FileName);

    return {
        src: item.FileName,
        dest: createFilename(date, names) + ext,
        // meta: {
            date,
            offset: date.getTimezoneOffset(),
            DateTimeOriginal: item.DateTimeOriginal,
            // OffsetTimeOriginal: item.OffsetTimeOriginal,
            CreateDate: item.CreateDate,
            // DateTimeCreated: item.DateTimeCreated,
            FileName: item.FileName,
            FileModifyDate: item.FileModifyDate,
        // },
    };
}

function logList<T extends { dest: string; }>(list: T[]): T[] {
    list.sort((a, b) => a.dest > b.dest ? 1 : -1)

    console.table(list);

    return list;
}

function renameFiles({ src, dest }: { src: string; dest: string }) {
    console.log('Rename %s to %s', src, dest);
}

export function handler(argv: Arguments<ReanemToDateArguments>) {
    const names = new Set<string>();

    exec<IExifData[]>(argv.path)
        .then(({ data }) => data.map(item => updateFilename(item, names)))
        .then((list) => logList(list))
        .then((list) => seriesPromise(list, renameFiles))
        .then(() => console.log('✅'))
        .catch(err => console.error(err));
};
