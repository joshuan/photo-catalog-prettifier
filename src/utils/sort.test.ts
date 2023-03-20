import { describe, test, expect } from '@jest/globals';
import { ISortableItem, sortImages } from './sort.js';

describe('sort', () => {
    test('sortImages', () => {
        const data: ISortableItem[] = [
            { file: { fileinfo: { size: 10 }, exif: { resolution: 10, mime: 'image/heic' } } },
            { file: { fileinfo: { size: 20 }, exif: { resolution: 20, mime: 'image/heic' } } },
        ];

        const list = sortImages(data);

        expect(list[0].file.fileinfo.size).toEqual(20);
    });
});
