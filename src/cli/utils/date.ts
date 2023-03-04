import { DateTime } from 'luxon';
import { debugUtil } from './debug.js';

export enum TimeZone {
    UTC = 'UTC',
    Yekaterinburg = 'Asia/Yekaterinburg',
    Samara = 'Europe/Samara',
    Moscow = 'Europe/Moscow',
    Belgrade = 'Europe/Belgrade', // +1
    Kiev = 'Europe/Kiev', // +2
    Almaty = 'Asia/Almaty', // +6
    Novosibirsk = 'Asia/Novosibirsk', // +7
}

const debug = debugUtil('colonDate');

export class ColonDate {
    private static COLON_FORMAT = 'yyyy:MM:dd HH:mm:ss';
    private static FILENAME_FORMAT = 'yyyy-MM-dd_HH-mm-ss';

    public static validate(str: string): boolean {
        return DateTime.fromFormat(str, ColonDate.COLON_FORMAT).isValid;
    }

    private datetime: DateTime;

    constructor(src: string | number, public zone: TimeZone = TimeZone.UTC) {
        if (typeof src === 'string') {
            this.datetime = DateTime.fromFormat(src, ColonDate.COLON_FORMAT, { zone });
        } else if (typeof src === 'number') {
            this.datetime = DateTime.fromMillis(src, { zone });
        } else {
            throw new Error(`Unknown format date "${src}".`);
        }

        debug('Create datetime', src, zone, this.datetime.toString());
    }

    private lp(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    clone() {
        return DateTime.fromSQL(this.datetime.toSQL());
    }

    formatFileName(timeZone: TimeZone, addSecond: number = 0) {
        return this.clone()
            .plus({ second: addSecond })
            .setZone(TimeZone.Moscow)
            .toFormat(ColonDate.FILENAME_FORMAT);
    }

    toJSON(): string {
        return this.datetime.toJSON();
    }

    toString(): string {
        return this.clone().setZone(TimeZone.UTC).toString();
    }
}
