import { describe, test, expect } from '@jest/globals';
import { IExifData } from '../../exiftool/types.js';
import { buildDate } from './date.js';

const examples: { source: IExifData, expected: string | undefined; }[] = [
    {
        source: {
            FileName: '20180814_100303.mp4',
            CreateDate: '2018:08:14 05:05:11',
            FileModifyDate: '2023:02:17 12:51:44+01:00',
            MIMEType: 'video/mp4',
        },
        expected: '2018-08-14T05:05:11.000Z',
    },
    {
        source: {
            FileName: 'IMG_6580.JPG',
            FileModifyDate: '2023:02:18 20:20:01+01:00',
            MIMEType: 'image/jpeg',
        },
        expected: undefined,
    },
    {
        source: {
            FileName: 'bde7aa6e-a7e0-45d8-90df-7ec30e635f9c.mp4',
            CreateDate: '0000:00:00 00:00:00',
            FileModifyDate: '2023:02:18 20:06:50+01:00',
            MIMEType: 'video/mp4',
        },
        expected: undefined,
    },
    {
        source: {
            FileName: 'IMG_6800.jpg',
            DateTimeOriginal: '2018:08:05 12:09:28',
            CreateDate: '2018:08:05 12:09:28',
            FileModifyDate: '2023:02:17 12:51:44+01:00',
            GPSTimeStamp: '07:09:28.52',
            GPSDateStamp: '2018:08:05',
            MIMEType: 'image/jpeg',
        },
        expected: '2018-08-05T07:09:28.000Z',
    },
    {
        source: {
            FileName: '20180331_113250.jpg',
            DateTimeOriginal: '2018:03:31 11:32:50',
            CreateDate: '2018:03:31 11:32:50',
            FileModifyDate: '2023:02:15 11:28:28+01:00',
            MIMEType: 'image/jpeg',
        },
        expected: '2018-03-31T06:32:50.000Z',
    },
    {
        source: {
            FileName: '1522576450969982.mp4',
            FileModifyDate: '2023:02:15 11:53:36+01:00',
            MIMEType: 'video/mp4',
            CreateDate: '0000:00:00 00:00:00',
            ModifyDate: '0000:00:00 00:00:00',
        },
        expected: '2018-04-01T09:54:10.970Z',
    },
];

describe('buildDate', () => {
    for (const { source, expected } of examples) {
        test(`${source.FileName}`, () => {
            expect(buildDate(source)?.toString()).toEqual(expected);
        });
    }
});
