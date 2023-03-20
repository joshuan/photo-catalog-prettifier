export interface ISortableItem {
    file: {
        fileinfo: { size: number; };
        exif: { resolution: number; mime: string; compressor?: string; };
    };
}

function compareSize(a: ISortableItem, b: ISortableItem): -1 | 0 | 1 {
    if (a.file.exif.resolution > b.file.exif.resolution) {
        return -1;
    } else if (a.file.exif.resolution < b.file.exif.resolution) {
        return 1;
    } else if (a.file.fileinfo.size > b.file.fileinfo.size) {
        return -1;
    } else if (a.file.fileinfo.size < b.file.fileinfo.size) {
        return 1;
    } else {
        return 0;
    }
}

export function sortImages<T extends ISortableItem>(images: T[]): T[] {
    images.sort((a, b) => {
        if (a.file.exif.mime === b.file.exif.mime) {
            return compareSize(a, b);
        } else if (a.file.exif.mime.includes('heic')) {
            return -1;
        } else {
            return 1;
        }
    });

    return images;
}

export function sortVideos<T extends ISortableItem>(videos: T[]): T[] {
    videos.sort((a, b) => {
        const typeA = a.file.exif.compressor || a.file.exif.mime;
        const typeB = b.file.exif.compressor || b.file.exif.mime;

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
