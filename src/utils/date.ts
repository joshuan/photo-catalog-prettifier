export enum TimeZone {
    Yekaterinburg = 'Asia/Yekaterinburg',
    Moscow = 'Europe/Moscow',
}

export function trimZone(src: Date, timeZone: TimeZone): Date {
    const str = src.toLocaleString('ru-RU', { timeZone });
    const test = /^(\d{2})\.(\d{2})\.(\d{4})\,\s(\d{2}):(\d{2}):(\d{2})$/.exec(str);

    if (test === null) {
        throw new Error('Broken date formatting', { cause: { src, timeZone, str, test } });
    }

    return new Date(Date.parse(`${test[3]}-${test[2]}-${test[1]}T${test[4]}:${test[5]}:${test[6]}Z`));
} 
