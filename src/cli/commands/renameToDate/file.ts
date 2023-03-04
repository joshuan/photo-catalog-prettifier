import { ColonDate, TimeZone } from '../../utils/date.js';
import { getBasename, getExt } from '../../utils/path.js';

const names = new Set<string>();

export function createFilename(date: ColonDate, ext: string, add = 0): string {
    const result = date.formatFileName(TimeZone.Yekaterinburg, add) + ext;

    if (names.has(result)) {
        return createFilename(date, ext, add+1);
    }

    names.add(result);

    return result;
}

export function lowerExt(filename: string) {
    const originalExt = getExt(filename);
    const originalBase = getBasename(filename, originalExt);

    return `${originalBase}${originalExt.toLowerCase()}`;
}
