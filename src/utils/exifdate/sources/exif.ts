import { ColonDate, TimeZone } from '../../../lib/ColonDate.js';
import { debugUtil } from '../../debug.js';

const debug = debugUtil('renameToDate:exif');
const BROKEN_DATE = '0000:00:00 00:00:00';

const zoneMap: Record<string, TimeZone> = {
    '+00:00': TimeZone.UTC,
    '+01:00': TimeZone.Belgrade,
    '+02:00': TimeZone.Kiev,
    '+03:00': TimeZone.Moscow,
    '+04:00': TimeZone.Samara,
    '+05:00': TimeZone.Yekaterinburg,
    '+06:00': TimeZone.Almaty,
    '+07:00': TimeZone.Novosibirsk,
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

function isVideo(item: { MIMEType?: string }): boolean {
    if (!item.MIMEType) {
        throw new Error('Undefined MIMEType', { cause: item });
    }

    return item.MIMEType.includes('video');
}

interface IExifDateItem {
    MIMEType?: string;
    DateTimeOriginal?: string;
    OffsetTimeOriginal?: string;
    CreateDate?: string;
    OffsetTimeDigitized?: string;
    ModifyDate?: string;
    OffsetTime?: string;
}

export function getDateFromExif(item: IExifDateItem, defaultPhotoOffset: string = '+00:00'): ColonDate | undefined {
    const customOffset = (isVideo(item) ? '+00:00' : defaultPhotoOffset );

    return parseDate(item.DateTimeOriginal, item.OffsetTimeOriginal || customOffset)
        || parseDate(item.CreateDate, item.OffsetTimeDigitized || customOffset)
        || parseDate(item.ModifyDate, item.OffsetTime || customOffset)
        || undefined;
}
