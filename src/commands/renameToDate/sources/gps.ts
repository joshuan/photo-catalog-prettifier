import { IExifData } from '../../../exiftool/types.js';
import { ColonDate, TimeZone } from '../../../utils/date.js';
import { debugUtil } from '../../../utils/debug.js';

const debug = debugUtil('renameToDate:exif');
const DATE_RE = /^(\d{4})\:(\d{2})\:(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})$/;
const BROKEN_DATE = '0000:00:00 00:00:00';

function parseZone(zone?: string): TimeZone {
    if (zone && !(zone in TimeZone)) {
        throw new Error(`Unknown zone "${zone}"!`, { cause: zone });
    }

    return TimeZone.UTC;
}

function parseDate(date?: string, zone?: string) {
    debug('Parse date from', date, zone);

    if (!date || date === BROKEN_DATE) {
        return undefined;
    }

    if (ColonDate.validate(date)) {
        return new ColonDate(date, parseZone(zone));
    }
}

export function getDateFromGps(item: IExifData): ColonDate | undefined {
    if (item.GPSDateStamp && item.GPSTimeStamp) {
        return parseDate(`${item.GPSDateStamp} ${item.GPSTimeStamp.substring(0, 8)}`, TimeZone.UTC);
    }

    return undefined;
}
