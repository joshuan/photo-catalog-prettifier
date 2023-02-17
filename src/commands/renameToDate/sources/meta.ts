import { IExifData } from "../../../exiftool/types";

const DATE_RE = /^(\d{4})\:(\d{2})\:(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})$/;

function parseDate(date?: string, zone?: string) {
    const test = DATE_RE.exec(date || '');

    if (zone) {
        throw new Error('Wow!!! We have timezone from EXIF!', { cause: { date, zone } });
    }

    if (test !== null) {
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
