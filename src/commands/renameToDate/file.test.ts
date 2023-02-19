import { describe, test, expect } from '@jest/globals';
import { IExifData } from '../../exiftool/types.js';
import { buildDestination } from './file.js';

const examples: { source: IExifData, expected: string; }[] = [
    {
        source: {
            FileName: '20180814_100303.mp4',
            CreateDate: '2018:08:14 05:05:11',
            FileModifyDate: '2023:02:17 12:51:44+01:00',
            MIMEType: 'video/mp4',
        },
        expected: '2018-08-14_10-05-11.mp4'
    },
    {
        source: {
            FileName: 'IMG_6580.JPG',
            FileModifyDate: '2023:02:18 20:20:01+01:00',
            MIMEType: 'image/jpeg',
        },
        expected: 'IMG_6580.jpg',
    },
    {
        source: {
            FileName: 'bde7aa6e-a7e0-45d8-90df-7ec30e635f9c.mp4',
            CreateDate: '0000:00:00 00:00:00',
            FileModifyDate: '2023:02:18 20:06:50+01:00',
            MIMEType: 'video/mp4',
        },
        expected: 'bde7aa6e-a7e0-45d8-90df-7ec30e635f9c.mp4',
    },
    {
        source: {
            FileName: 'IMG_6800.jpg',
            DateTimeOriginal: '2018:08:05 12:09:28',
            CreateDate: '2018:08:05 12:09:28',
            FileModifyDate: '2023:02:17 12:51:44+01:00',
            MIMEType: 'image/jpeg',
        },
        expected: '2018-08-05_12-09-28.jpg',
    },
    {
        source: {
            FileName: '20180331_113250.jpg',
            DateTimeOriginal: '2018:03:31 11:32:50',
            CreateDate: '2018:03:31 11:32:50',
            FileModifyDate: '2023:02:15 11:28:28+01:00',
            MIMEType: 'image/jpeg',
        },
        expected: '2018-03-31_11-32-50.jpg',
    },
    {
        source: {
            "FileName": "IMG_0324.mp4",
            "FileModifyDate": "2023:02:18 20:20:20+01:00",
            "MIMEType": "video/mp4",
            "CreateDate": "2018:10:14 06:24:12",
            "ModifyDate": "2018:10:14 06:27:26",
        },
        expected: '2018-10-14_11-24-12.mp4',
    },
    {
        source: {
            FileName: '1522576450969982.mp4',
            FileModifyDate: '2023:02:15 11:53:36+01:00',
            MIMEType: 'video/mp4',
            CreateDate: '0000:00:00 00:00:00',
            ModifyDate: '0000:00:00 00:00:00',
        },
        expected: '2018-04-01_14-54-10.mp4',
    },
    {
        source: {
            "FileName": "IMG_7445.jpg",
            "FileModifyDate": "2023:02:15 11:38:24+01:00",
            "FileAccessDate": "2023:02:15 11:38:25+01:00",
            "FileInodeChangeDate": "2023:02:15 11:38:24+01:00",
            "FileType": "JPEG",
            "FileTypeExtension": "jpg",
            "MIMEType": "image/jpeg",
            "ModifyDate": "2018:09:13 10:24:46",
            "DateTimeOriginal": "2018:09:13 10:24:46",
            "CreateDate": "2018:09:13 10:24:46",
            "GPSTimeStamp": "00:00:00",
            "GPSDateStamp": "1970:01:01",
        },
        expected: '2018-09-13_10-24-46.jpg',
    }
];

describe('buildDestination', () => {
    for (const { source, expected } of examples) {
        test(`${source.FileName}`, () => {
            expect(buildDestination(source).dest).toEqual(expected);
        });
    }
});
