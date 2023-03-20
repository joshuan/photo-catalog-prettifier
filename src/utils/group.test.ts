import { describe, test, expect } from '@jest/globals';
import { groupFiles, IGroupFile } from './group.js';

describe.only('groupFiles', () => {
    test('1', () => {
        const source: IGroupFile[] = [
            { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
            { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g1' } }, hash: undefined },
        ];
        const expected = {
            'f1': [
                { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
                { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g1' } }, hash: undefined },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('2', () => {
        const source: IGroupFile[] = [
            { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
            { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: undefined },
        ];
        const expected = {
            'f1': [
                { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
            ],
            'f2': [
                { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: undefined },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('3', () => {
        const source: IGroupFile[] = [
            { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
            { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: undefined },
            { file: { filename: 'f3', fileinfo: { originalName: 'fo3' }, exif: { groupId: 'g1' } }, hash: 'hash-1' },
        ];
        const expected = {
            'f1': [
                { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
                { file: { filename: 'f3', fileinfo: { originalName: 'fo3' }, exif: { groupId: 'g1' } }, hash: 'hash-1' },
            ],
            'f2': [
                { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: undefined },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('4', () => {
        const source: IGroupFile[] = [
            { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
            { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: undefined },
            { file: { filename: 'f3', fileinfo: { originalName: 'fo3' }, exif: { groupId: 'g3' } }, hash: undefined },
        ];

        expect(Object.keys(groupFiles(source)).length).toEqual(3);
    });

    test('5', () => {
        const source: IGroupFile[] = [
            { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
            { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: 'hash-1' },
            { file: { filename: 'f3', fileinfo: { originalName: 'fo3' }, exif: { groupId: 'g1' } }, hash: 'hash-1' },
        ];
        const expected = {
            'f1': [
                { file: { filename: 'f1', fileinfo: { originalName: 'fo1' }, exif: { groupId: 'g1' } }, hash: undefined },
                { file: { filename: 'f2', fileinfo: { originalName: 'fo2' }, exif: { groupId: 'g2' } }, hash: 'hash-1' },
                { file: { filename: 'f3', fileinfo: { originalName: 'fo3' }, exif: { groupId: 'g1' } }, hash: 'hash-1' },
            ]
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('6', () => {
        const source: IGroupFile[] = [
            { file: { filename: 'IMG_3053 (live).mp4', fileinfo: { originalName: 'IMG_3053 (live).mp4' }, exif: { groupId: 'guid1' } }, hash: undefined },
            { file: { filename: 'IMG_3053.heic', fileinfo: { originalName: 'IMG_3053.heic' }, exif: { groupId: 'guid2' } }, hash: undefined },
        ];
        const expected = {
            'IMG_3053 (live).mp4': [
                { file: { filename: 'IMG_3053 (live).mp4', fileinfo: { originalName: 'IMG_3053 (live).mp4' }, exif: { groupId: 'guid1' } }, hash: undefined },
                { file: { filename: 'IMG_3053.heic', fileinfo: { originalName: 'IMG_3053.heic' }, exif: { groupId: 'guid2' } }, hash: undefined },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });
});
