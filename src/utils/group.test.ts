import { describe, test, expect } from '@jest/globals';
import { groupFiles, IGroupFile } from './group.js';

describe.only('groupFiles', () => {
    test('1', () => {
        const source: IGroupFile[] = [
            { file: { originalName: '1' }, exif: { groupId: '1' }, hash: undefined },
            { file: { originalName: '2' }, exif: { groupId: '1' }, hash: undefined },
        ];
        const expected = {
            '1': [
                { FileName: '1', groupId: '1', hash: expect.any(String), fileIndex: '1' },
                { FileName: '2', groupId: '1', hash: expect.any(String), fileIndex: '2' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('2', () => {
        const source: IGroupFile[] = [
            { file: { originalName: '1' }, exif: { groupId: '1' }, hash: undefined },
            { file: { originalName: '2' }, exif: { groupId: '2' }, hash: undefined },
        ];
        const expected = {
            '1': [
                { FileName: '1', groupId: '1', hash: expect.any(String), fileIndex: '1' },
            ],
            '2': [
                { FileName: '2', groupId: '2', hash: expect.any(String), fileIndex: '2' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('3', () => {
        const source: IGroupFile[] = [
            { file: { originalName: '1' }, exif: { groupId: '1' }, hash: undefined },
            { file: { originalName: '2' }, exif: { groupId: '2' }, hash: undefined },
            { file: { originalName: '3' }, exif: { groupId: '1' }, hash: 'hash-1' },
        ];
        const expected = {
            '1': [
                { FileName: '1', groupId: '1', hash: expect.any(String), fileIndex: '1' },
                { FileName: '3', groupId: '1', hash: 'hash-1', fileIndex: '3' },
            ],
            '2': [
                { FileName: '2', groupId: '2', hash: expect.any(String), fileIndex: '2' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('4', () => {
        const source: IGroupFile[] = [
            { file: { originalName: '1' }, exif: { groupId: '1' }, hash: undefined },
            { file: { originalName: '2' }, exif: { groupId: 'uuid2' }, hash: undefined },
            { file: { originalName: '3' }, exif: { groupId: 'uuid3' }, hash: undefined },
        ];

        expect(Object.keys(groupFiles(source)).length).toEqual(3);
    });

    test('5', () => {
        const source: IGroupFile[] = [
            { file: { originalName: '1' }, exif: { groupId: '1' }, hash: undefined },
            { file: { originalName: '2' }, exif: { groupId: '2' }, hash: 'hash-1' },
            { file: { originalName: '3' }, exif: { groupId: '1' }, hash: 'hash-1' },
        ];
        const expected = {
            '2': [
                { FileName: '2', groupId: '2', hash: 'hash-1', fileIndex: '2' },
                { FileName: '1', groupId: '1', hash: expect.any(String), fileIndex: '1' },
                { FileName: '3', groupId: '1', hash: 'hash-1', fileIndex: '3' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });
});
