import { describe, test, expect } from '@jest/globals';
import { ISortableItem, sortImages } from './sort.js';

describe('sort', () => {
    test('sortImages', () => {
        const data: ISortableItem[] = [
            { file: { size: 10 }, exif: { resolution: 10, mime: 'image/heic' } },
            { file: { size: 20 }, exif: { resolution: 20, mime: 'image/heic' } },
        ];

        const list = sortImages(data);

        expect(list[0].file.size).toEqual(20);
    });
});
