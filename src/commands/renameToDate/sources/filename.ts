import { IExifData } from "../../../exiftool/types";

export function getDateFromFilename(item: IExifData): Date | undefined {
    const test = /^(\d{4})(\d{2})(\d{2})\_(\d{2})(\d{2})(\d{2})\./.exec(item.FileName);

    if (test !== null) {
        return new Date(
            Date.parse(`${test[1]}-${test[2]}-${test[3]}T${test[4]}:${test[5]}:${test[6]}`),
        );
    }

    return undefined;
}
