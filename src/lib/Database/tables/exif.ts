import { v4 as uuid } from 'uuid';
import { buildDate } from '../../../utils/exifdate/index.js';
import { exiftoolGetter, IExifPartialData } from '../../../utils/exiftool.js';
import { buildGps, IGps } from '../../../utils/gps.js';

export type IMediaExifItem = {
    _raw: IExifPartialData,
    timestamp?: number,
    gps?: IGps;
    type: 'image' | 'video';
    groupId: string;
    imageSize: [number, number];
    resolution: number;
    mime: string;
    compressor?: string;
};

export type IMediaExifList = Record<string, IMediaExifItem>;

function buildType(MIMEType: string): 'video' | 'image' {
    if (MIMEType.includes('image/')) { return 'image'; }
    if (MIMEType.includes('video/')) { return 'video'; }

    throw new Error(`Wrong mime type ${MIMEType}`);
}

function buildImageSize(exif: { ImageWidth?: number; ImageHeight?: number }): [number, number] {
    if (!exif.ImageWidth || !exif.ImageHeight) {
        throw new Error('ImageWidth and ImageHeight is required for get picture size', { cause: exif });
    }

    return [exif.ImageWidth, exif.ImageHeight];
}

function buildGroupId(exif: { MediaGroupUUID?: string; ContentIdentifier?: string }): string {
    return exif.MediaGroupUUID || exif.ContentIdentifier || uuid();
}

export async function buildExif(path: string): Promise<IMediaExifList> {
    const data = await exiftoolGetter(path);

    return data.reduce((acc, exif) => {
        const size = buildImageSize(exif);

        if (!exif.MIMEType) {
            throw new Error('MIMEType is required for select file type', { cause: exif });
        }

        acc[exif.FileName] = {
            _raw: exif,
            timestamp: buildDate(exif, process.env.DEFAULT_PHOTO_OFFSET)?.getTime(),
            gps: buildGps(exif),
            type: buildType(exif.MIMEType),
            groupId: buildGroupId(exif),
            imageSize: size,
            resolution: size[0] * size[1],
            mime: exif.MIMEType,
            compressor: exif.CompressorName,
        };

        return acc;
    }, {} as IMediaExifList);
}
