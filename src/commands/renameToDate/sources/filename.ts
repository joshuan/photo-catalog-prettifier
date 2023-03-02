import { IExifData } from '../../../exiftool/types.js';
import { ColonDate, TimeZone } from '../../../utils/date.js';
import { debugUtil } from '../../../utils/debug.js';

const debug = debugUtil('renameToDate:filename');

const DATE_LARGE_FILENAME_RE = /^(\d{4})(\d{2})(\d{2})\_(\d{2})(\d{2})(\d{2})\./;

function getLargeFileName(item: IExifData): ColonDate | undefined {
    const test = DATE_LARGE_FILENAME_RE.exec(item.FileName);

    if (test === null) {
        return undefined;
    }

    const colonDate = `${test[1]}:${test[2]}:${test[3]} ${test[4]}:${test[5]}:${test[6]}`;

    return new ColonDate(colonDate, TimeZone.Yekaterinburg);
}

// 2014-11-18 11.38.49
const DATE_LARGE2_FILENAME_RE = /^(\d{4})\-(\d{2})\-(\d{2})\s{1}(\d{2})\.(\d{2})\.(\d{2})/;

function getLarge2FileName(item: IExifData): ColonDate | undefined {
    const test = DATE_LARGE2_FILENAME_RE.exec(item.FileName);

    if (test === null) {
        return undefined;
    }

    const colonDate = `${test[1]}:${test[2]}:${test[3]} ${test[4]}:${test[5]}:${test[6]}`;

    return new ColonDate(colonDate, TimeZone.Yekaterinburg);
}

const DATE_UNIX_FILENAME_RE = /^(\d{16})\./;

function getUnixFileName(item: IExifData): ColonDate | undefined {
    const test = DATE_UNIX_FILENAME_RE.exec(item.FileName);

    if (test === null) {
        return undefined;
    }

    return new ColonDate(Math.ceil(parseInt(test[1], 10) / 1000), TimeZone.Yekaterinburg);
}

export function getDateFromFilename(item: IExifData): ColonDate | undefined {
    debug('Parse date', item.FileName);

    return getLargeFileName(item)
        || getLarge2FileName(item)
        || getUnixFileName(item)
        || undefined
    ;
}
