export interface ISortableItem {
    file: { size: number; };
    exif: { resolution: number; mime: string; compressor?: string; };
}

function compareSize(a: ISortableItem, b: ISortableItem): -1 | 0 | 1 {
    if (a.exif.resolution > b.exif.resolution) {
        return -1;
    } else if (a.exif.resolution < b.exif.resolution) {
        return 1;
    } else if (a.file.size > b.file.size) {
        return -1;
    } else if (a.file.size < b.file.size) {
        return 1;
    } else {
        return 0;
    }
}

export function sortImages<T extends ISortableItem>(images: T[]): T[] {
    images.sort((a, b) => {
        if (a.exif.mime === b.exif.mime) {
            return compareSize(a, b);
        } else if (a.exif.mime.includes('heic')) {
            return -1;
        } else {
            return 1;
        }
    });

    return images;
}

export function sortVideos<T extends ISortableItem>(videos: T[]): T[] {
    videos.sort((a, b) => {
        const typeA = a.exif.compressor || a.exif.mime;
        const typeB = b.exif.compressor || b.exif.mime;

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
