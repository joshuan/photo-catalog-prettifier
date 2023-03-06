import { describe, test, expect } from '@jest/globals';
import { ISortableItem, sortImages } from './sort.js';

describe('sort', () => {
    test('sortImages', () => {
        const data: ISortableItem[] = [
            { MIMEType: 'image/heic', imageSize: 10, size: 10 },
            { MIMEType: 'image/heic', imageSize: 20, size: 20 },
        ];

        const list = sortImages(data);

        expect(list[0].size).toEqual(20);
    });
});
