import { IExifData } from '../../exiftool/types.js';
import { ColonDate } from '../../utils/date.js';
import { debugUtil } from '../../utils/debug.js';
import { getDateFromGps } from './sources/gps.js';
import { getDateFromExif } from './sources/exif.js';
import { getDateFromFilename } from './sources/filename.js';

const debug = debugUtil('renameToDate');

export function buildDate(item: IExifData): ColonDate | undefined {
    debug('Parse date for', item.FileName);

    try {
        const date =
            getDateFromExif(item) ||
            getDateFromGps(item) ||
            getDateFromFilename(item);

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
