import debugUtil from 'debug';
import { IExifData } from "../../../exiftool/types";

const debug = debugUtil('renameToDate:meta');
const DATE_RE = /^(\d{4})\:(\d{2})\:(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})([+-]{1})(\d{2})\:(\d{2})$/;

function parseDate(date?: string) {
    debug('Parse date from', date);

    const test = DATE_RE.exec(date || '');

    if (test !== null) {
        const zone = `${test[7]}${test[8]}:${test[9]}`;
        debug('ZONE:', zone);

        return new Date(
            Date.parse(`${test[1]}-${test[2]}-${test[3]}T${test[4]}:${test[5]}:${test[6]}`),
        );
    }
}

export function getDateFromMeta(item: IExifData): Date | undefined {
    return parseDate(item.DateTimeCreated)
        || parseDate(item.FileModifyDate)
        || undefined;
}
