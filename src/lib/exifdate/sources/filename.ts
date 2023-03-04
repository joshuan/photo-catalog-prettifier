import { ColonDate, TimeZone } from '../../../cli/utils/date.js';
import { debugUtil } from '../../../cli/utils/debug.js';

const debug = debugUtil('renameToDate:filename');

interface IFileNameItem {
    FileName: string;
}

// 20141118_113849.
const DATE_LARGE_FILENAME_RE = /^(\d{4})(\d{2})(\d{2})\_(\d{2})(\d{2})(\d{2})\./;

function getLargeFileName(filename: string): ColonDate | undefined {
    const test = DATE_LARGE_FILENAME_RE.exec(filename);

    if (test === null) {
        return undefined;
    }

    const colonDate = `${test[1]}:${test[2]}:${test[3]} ${test[4]}:${test[5]}:${test[6]}`;

    return new ColonDate(colonDate, TimeZone.Yekaterinburg);
}

// 2014-11-18 11.38.49
const DATE_LARGE2_FILENAME_RE = /^(\d{4})\-(\d{2})\-(\d{2})\s{1}(\d{2})\.(\d{2})\.(\d{2})/;

function getLarge2FileName(filename: string): ColonDate | undefined {
    const test = DATE_LARGE2_FILENAME_RE.exec(filename);

    if (test === null) {
        return undefined;
    }

    const colonDate = `${test[1]}:${test[2]}:${test[3]} ${test[4]}:${test[5]}:${test[6]}`;

    return new ColonDate(colonDate, TimeZone.Yekaterinburg);
}

// 1677940502042
const DATE_UNIX_FILENAME_RE = /^(\d{16})\./;

function getUnixFileName(filename: string): ColonDate | undefined {
    const test = DATE_UNIX_FILENAME_RE.exec(filename);

    if (test === null) {
        return undefined;
    }

    return new ColonDate(Math.ceil(parseInt(test[1], 10) / 1000), TimeZone.Yekaterinburg);
}

export function getDateFromFilename(item: IFileNameItem): ColonDate | undefined {
    debug('Parse date', item.FileName);

    return getLargeFileName(item.FileName)
        || getLarge2FileName(item.FileName)
        || getUnixFileName(item.FileName)
        || undefined
    ;
}
