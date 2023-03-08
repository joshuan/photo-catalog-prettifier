import { describe, test, expect } from '@jest/globals';
import { groupFiles, IGroupFile } from './group.js';

describe.only('groupFiles', () => {
    test('1', () => {
        const source: IGroupFile[] = [
            { FileName: '1', groupId: '1', compareHash: undefined },
            { FileName: '2', groupId: '1', compareHash: undefined },
        ];
        const expected = {
            '1': [
                { FileName: '1', groupId: '1', compareHash: expect.any(String), fileIndex: '1' },
                { FileName: '2', groupId: '1', compareHash: expect.any(String), fileIndex: '2' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('2', () => {
        const source: IGroupFile[] = [
            { FileName: '1', groupId: '1', compareHash: undefined },
            { FileName: '2', groupId: '2', compareHash: undefined },
        ];
        const expected = {
            '1': [
                { FileName: '1', groupId: '1', compareHash: expect.any(String), fileIndex: '1' },
            ],
            '2': [
                { FileName: '2', groupId: '2', compareHash: expect.any(String), fileIndex: '2' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('3', () => {
        const source: IGroupFile[] = [
            { FileName: '1', groupId: '1', compareHash: undefined },
            { FileName: '2', groupId: '2', compareHash: undefined },
            { FileName: '3', groupId: '1', compareHash: 'hash-1' },
        ];
        const expected = {
            '1': [
                { FileName: '1', groupId: '1', compareHash: expect.any(String), fileIndex: '1' },
                { FileName: '3', groupId: '1', compareHash: 'hash-1', fileIndex: '3' },
            ],
            '2': [
                { FileName: '2', groupId: '2', compareHash: expect.any(String), fileIndex: '2' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });

    test('4', () => {
        const source: IGroupFile[] = [
            { FileName: '1', groupId: '1', compareHash: undefined },
            { FileName: '2', groupId: null, compareHash: undefined },
            { FileName: '3', groupId: null, compareHash: undefined },
        ];

        expect(Object.keys(groupFiles(source)).length).toEqual(3);
    });

    test('5', () => {
        const source: IGroupFile[] = [
            { FileName: '1', groupId: '1', compareHash: undefined },
            { FileName: '2', groupId: '2', compareHash: 'hash-1' },
            { FileName: '3', groupId: '1', compareHash: 'hash-1' },
        ];
        const expected = {
            '2': [
                { FileName: '2', groupId: '2', compareHash: 'hash-1', fileIndex: '2' },
                { FileName: '1', groupId: '1', compareHash: expect.any(String), fileIndex: '1' },
                { FileName: '3', groupId: '1', compareHash: 'hash-1', fileIndex: '3' },
            ],
        };
        expect(groupFiles(source)).toEqual(expected);
    });
});
