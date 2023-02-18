import debugUtil from 'debug';
import { IExifData } from "../../../exiftool/types";

const debug = debugUtil('renameToDate:exif');
const DATE_RE = /^(\d{4})\:(\d{2})\:(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})$/;
const BROKEN_DATE = '0000:00:00 00:00:00';

function parseDate(date?: string, zone?: string) {
    debug('Parse date from', date, zone);

    if (date === BROKEN_DATE) {
        return undefined;
    }

    const test = DATE_RE.exec(date || '');

    if (zone) {
        throw new Error('Wow!!! We have timezone from EXIF!', { cause: { date, zone } });
    }

    if (test !== null) {
        return new Date(
            Date.parse(`${test[1]}-${test[2]}-${test[3]}T${test[4]}:${test[5]}:${test[6]}Z`),
        );
    }
}

export function getDateFromExif(item: IExifData): Date | undefined {
    return parseDate(item.DateTimeOriginal, item.OffsetTimeOriginal)
        || parseDate(item.CreateDate, item.OffsetTimeDigitized)
        || parseDate(item.ModifyDate, item.OffsetTime)
        || undefined;
}
