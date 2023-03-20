import { ColonDate } from '../../../../ColonDate.js';
import { debugUtil } from '../../../../../utils/debug.js';
import { getDateFromGps } from './sources/gps.js';
import { getDateFromExif } from './sources/exif.js';
import { getDateFromFilename } from './sources/filename.js';

const debug = debugUtil('renameToDate');

export interface IExifDateItem {
    FileName?: string;
    MIMEType?: string;
    DateTimeOriginal?: string;
    OffsetTimeOriginal?: string;
    CreateDate?: string;
    OffsetTimeDigitized?: string;
    ModifyDate?: string;
    OffsetTime?: string;
    GPSDateStamp?: string;
    GPSTimeStamp?: string;
}

export function buildDate(item: IExifDateItem, defaultPhotoOffset?: string): ColonDate | undefined {
    if (typeof item.FileName === 'undefined') {
        throw new Error('Broken item for build date.', { cause: item });
    }

    debug('Parse date for', item.FileName);

    try {
        const date =
            getDateFromExif(item, defaultPhotoOffset) ||
            getDateFromGps(item) ||
            getDateFromFilename({ FileName: item.FileName });

        debug('Date is %s', date);

        if (!date) {
            return undefined
        }

        if (date.toString() === 'Invalid Date') {
            throw new Error('Invalid date', { cause: date });
        }

        return date;
    } catch (err) {
        throw new Error('Can not get date', { cause: { err, item } });
    }
}
