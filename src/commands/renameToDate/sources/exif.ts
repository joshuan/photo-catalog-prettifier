import { IExifData } from '../../../exiftool/types.js';
import { ColonDate, TimeZone } from '../../../utils/date.js';
import { debugUtil } from '../../../utils/debug.js';

const debug = debugUtil('renameToDate:exif');
const DATE_RE = /^(\d{4})\:(\d{2})\:(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})$/;
const BROKEN_DATE = '0000:00:00 00:00:00';

const zoneMap: Record<string, TimeZone> = {
    '+00:00': TimeZone.UTC,
    '+03:00': TimeZone.Moscow,
    '+05:00': TimeZone.Yekaterinburg,
};

function parseZone(zone?: string): TimeZone {
    if (zone && !(zoneMap[zone])) {
        throw new Error(`Zone, what can we do with "${zone}"?!`, { cause: zone });
    }

    return (zone && zoneMap[zone]) || TimeZone.UTC;
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

function isVideo(item: IExifData): boolean {
    return item.MIMEType.includes('video');
}

export function getDateFromExif(item: IExifData): ColonDate | undefined {
    const customOffset = (isVideo(item) ? '+00:00' : '+05:00' );

    return parseDate(item.DateTimeOriginal, item.OffsetTimeOriginal || customOffset)
        || parseDate(item.CreateDate, item.OffsetTimeDigitized || customOffset)
        || parseDate(item.ModifyDate, item.OffsetTime || customOffset)
        || undefined;
}
