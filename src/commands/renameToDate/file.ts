import path from 'node:path';
import { buildDate } from './date.js';
import { IExifData } from '../../exiftool/types.js';
import { ColonDate, TimeZone } from '../../utils/date.js';

const names = new Set<string>();

function createFilename(date: ColonDate, add = 0): string {
    const result = date.formatFileName(TimeZone.Yekaterinburg, add);

    if (names.has(result)) {
        return createFilename(date, add+1);
    }

    names.add(result);

    return result;
}

function getLowerExt(filename: string): string {
    return path.extname(filename).toLowerCase();
}

function lowerExt(filename: string) {
    const originalExt = path.extname(filename);
    const originalBase = path.basename(filename, originalExt);

    return `${originalBase}${originalExt.toLowerCase()}`;
}

export function buildDestination(item: IExifData) {
    const date = buildDate(item);

    if (!date) {
        return {
            src: item.FileName,
            dest: lowerExt(item.FileName),
        };
    }

    const destination = createFilename(date) + getLowerExt(item.FileName);

    return {
        src: item.FileName,
        dest: destination,
    };
}
