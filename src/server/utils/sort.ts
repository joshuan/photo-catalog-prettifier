import { TFilesItem } from './files.js';

function compareSize(a: { imageSize: number; size: number; }, b: { imageSize: number; size: number; }): -1 | 0 | 1 {
    if (a.imageSize > b.imageSize) {
        return 1;
    } else if (a.imageSize < b.imageSize) {
        return -1;
    } else if (a.size > b.size) {
        return 1;
    } else if (a.size < b.size) {
        return -1;
    } else {
        return 0;
    }
}

export function sortImages(images: TFilesItem[]): TFilesItem[] {
    images.sort((a, b) => {
        if (a.exif.MIMEType === b.exif.MIMEType) {
            return compareSize(a, b);
        } else if (a.exif.MIMEType?.includes('heic')) {
            return 1;
        } else {
            return -1;
        }
    });

    return images;
}

export function sortVideos(videos: TFilesItem[]): TFilesItem[] {
    videos.sort((a, b) => {
        if (a.exif.MIMEType === b.exif.MIMEType) {
            return compareSize(a, b);
        } else if (a.exif.MIMEType?.includes('quicktime')) {
            return 1;
        } else {
            return -1;
        }
    });

    return videos;
}
