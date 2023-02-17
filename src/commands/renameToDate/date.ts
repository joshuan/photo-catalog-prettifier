import { IExifData } from '../../exiftool/types.js';
import { getDateFromExif } from './sources/exif.js';
import { getDateFromFilename } from './sources/filename.js';
import { getDateFromMeta } from './sources/meta.js';

export function calculateDate(item: IExifData) {
    const date = getDateFromExif(item) ||
        getDateFromFilename(item) || 
        getDateFromMeta(item);

    if (!date) {
        throw new Error(`File ${item.FileName} has not date information`, { cause: { item, date } });
    }

    if (date.toString() === 'Invalid Date') {
        throw new Error('Invalid date', { cause: { item, date } });
    }

    return date;
}

function lp(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}

export function buildFilenameDateString(date: Date, add: number) {
    return [
        [
            date.getFullYear(),
            lp(date.getMonth() + 1),
            lp(date.getDate()),
        ].join('-'),
        [
            lp(date.getHours()),
            lp(date.getMinutes()),
            lp(date.getSeconds() + add),
        ].join('-'),
    ].join('_');
}
