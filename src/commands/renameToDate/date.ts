import debugUtil from 'debug';
import { IExifData } from '../../exiftool/types.js';
import { TimeZone, trimZone } from '../../utils/date';
import { getDateFromExif } from './sources/exif.js';
import { getDateFromFilename } from './sources/filename.js';
import { getDateFromMeta } from './sources/meta.js';

const debug = debugUtil('renameToDate');

export function calculateDate(item: IExifData) {
    debug('Parse date for', item.FileName);

    const date = getDateFromExif(item) ||
        getDateFromFilename(item) || 
        getDateFromMeta(item);

    if (!date) {
        throw new Error(`Could not find creation date of the file ${item.FileName}.`, { cause: { item, date } });
    }

    if (date.toString() === 'Invalid Date') {
        throw new Error('Invalid date', { cause: { item, date } });
    }

    return date;
}

function lp(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}

export function buildFilenameDateString(src: Date, add: number, timeZone: TimeZone = TimeZone.Yekaterinburg) {
    const date = trimZone(src, timeZone);

    const d = `${date.getUTCFullYear()}-${lp(date.getUTCMonth() + 1)}-${lp(date.getUTCDate())}`;
    const t = `${lp(date.getUTCHours())}-${lp(date.getUTCMinutes())}-${lp(date.getUTCSeconds() + add)}`

    return `${d}_${t}`;
}
