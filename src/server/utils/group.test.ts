import { describe, test, expect } from '@jest/globals';
import { groupFiles } from './group.js';

describe('groupFiles', () => {
    test('with group by groupId only', () => {
        const actual = [
            { FileName: 'IMG_1234.jpeg', groupId: 'enurh238iwd' },
            { FileName: 'IMG_1234.heic', groupId: 'enurh238iwd' },
            { FileName: 'IMG_1334.jpeg', groupId: 'eSSSh238iwd' },
            { FileName: 'IMG_1334.heic', groupId: 'eSWWh238iwd' },
            { FileName: '23r89fhewifhs.mov', groupId: 'eSWWh238iwd' },
        ];

        const expected = {
            enurh238iwd: [
                { FileName: 'IMG_1234.jpeg', groupId: 'enurh238iwd' },
                { FileName: 'IMG_1234.heic', groupId: 'enurh238iwd' },
            ],
            eSSSh238iwd: [
                { FileName: 'IMG_1334.jpeg', groupId: 'eSSSh238iwd' },
                { FileName: 'IMG_1334.heic', groupId: 'eSWWh238iwd' },
                { FileName: '23r89fhewifhs.mov', groupId: 'eSWWh238iwd' },
            ],
        };

        expect(groupFiles(actual)).toEqual(expected);
    });

    test('with group by filename with diff groups', () => {
        const actual = [
            { FileName: 'IMG_1234.jpeg', groupId: 'enurh238iwd' },
            { FileName: 'IMG_1234.heic', groupId: 'enurh238iwd' },
            { FileName: 'IMG_1334.jpeg', groupId: 'eSSSh238iwd' },
            { FileName: 'IMG_1334.heic', groupId: 'eSWWh238iwd' },
        ];

        const expected = {
            enurh238iwd: [
                { FileName: 'IMG_1234.jpeg', groupId: 'enurh238iwd' },
                { FileName: 'IMG_1234.heic', groupId: 'enurh238iwd' },
            ],
            eSSSh238iwd: [
                { FileName: 'IMG_1334.jpeg', groupId: 'eSSSh238iwd' },
                { FileName: 'IMG_1334.heic', groupId: 'eSWWh238iwd' },
            ],
        };

        expect(groupFiles(actual)).toEqual(expected);
    });

    test('with group by filename', () => {
        const actual = [
            { FileName: 'IMG_1234.jpeg', groupId: 'enurh238iwd' },
            { FileName: 'IMG_1234.heic', groupId: 'enurh238iwd' },
            { FileName: 'IMG_1334.jpeg', groupId: 'eSSSh238iwd' },
            { FileName: 'IMG_1334.heic', groupId: 'eSWWh238iwd' },
            { FileName: '23r89fhewifhs.mov', groupId: 'eSWWh238iwd' },
            { FileName: 'IMG_7777.mov', groupId: null },
            { FileName: 'IMG_7777 (2).heic', groupId: null },
            { FileName: 'IMG_8888.mov', groupId: null },
            { FileName: 'IMG_8888 (2).heic', groupId: '9rjdsdsod' },
        ];

        const expected = {
            enurh238iwd: [
                { FileName: 'IMG_1234.jpeg', groupId: 'enurh238iwd' },
                { FileName: 'IMG_1234.heic', groupId: 'enurh238iwd' },
            ],
            eSSSh238iwd: [
                { FileName: 'IMG_1334.jpeg', groupId: 'eSSSh238iwd' },
                { FileName: 'IMG_1334.heic', groupId: 'eSWWh238iwd' },
                { FileName: '23r89fhewifhs.mov', groupId: 'eSWWh238iwd' },
            ],
            IMG_7777: [
                { FileName: 'IMG_7777.mov', groupId: null },
                { FileName: 'IMG_7777 (2).heic', groupId: null },
            ],
            IMG_8888: [
                { FileName: 'IMG_8888.mov', groupId: null },
                { FileName: 'IMG_8888 (2).heic', groupId: '9rjdsdsod' },
            ],
        };

        expect(groupFiles(actual)).toEqual(expected);
    });
});
