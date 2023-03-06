export interface ISortableItem {
    exif: { CompressorName?: string; }
    MIMEType: string;
    imageSize: number;
    size: number;
}

function compareSize(a: ISortableItem, b: ISortableItem): -1 | 0 | 1 {
    if (a.imageSize > b.imageSize) {
        return -1;
    } else if (a.imageSize < b.imageSize) {
        return 1;
    } else if (a.size > b.size) {
        return -1;
    } else if (a.size < b.size) {
        return 1;
    } else {
        return 0;
    }
}

export function sortImages<T extends ISortableItem>(images: T[]): T[] {
    images.sort((a, b) => {
        if (a.MIMEType === b.MIMEType) {
            return compareSize(a, b);
        } else if (a.MIMEType?.includes('heic')) {
            return -1;
        } else {
            return 1;
        }
    });

    return images;
}

export function sortVideos<T extends ISortableItem>(videos: T[]): T[] {
    videos.sort((a, b) => {
        const typeA = a.exif.CompressorName || a.MIMEType;
        const typeB = b.exif.CompressorName || b.MIMEType;

        if (typeA === typeB) {
            return compareSize(a, b);
        } else if (typeA.includes('HEVC')) {
            return -1;
        } else {
            return 1;
        }
    });

    return videos;
}
