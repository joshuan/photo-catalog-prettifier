export function buildImageSize(exif: { Rotation?: number; ImageWidth?: number; ImageHeight?: number }): [number, number] {
    if (!exif.ImageWidth || !exif.ImageHeight) {
        throw new Error('ImageWidth and ImageHeight is required for get picture size', { cause: exif });
    }

    if (exif.Rotation && (exif.Rotation === 90 || exif.Rotation === 270)) {
        return [exif.ImageHeight, exif.ImageWidth];
    }

    return [exif.ImageWidth, exif.ImageHeight];
}
