import { v4 as uuid } from 'uuid';
import { debugUtil } from '../../../utils/debug.js';
import { buildDate } from '../../../utils/exifdate/index.js';
import { exiftoolGetter, IExifPartialData } from '../../../utils/exiftool.js';
import { buildGps, IGps } from '../../../utils/gps.js';
import { Cache } from '../../Cache.js';

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

const debug = debugUtil('database:exif');

function buildType(MIMEType: string): 'video' | 'image' {
    if (MIMEType.includes('image/')) { return 'image'; }
    if (MIMEType.includes('video/')) { return 'video'; }

    throw new Error(`Wrong mime type ${MIMEType}`);
}

function buildImageSize(exif: { Rotation?: number; ImageWidth?: number; ImageHeight?: number }): [number, number] {
    if (!exif.ImageWidth || !exif.ImageHeight) {
        throw new Error('ImageWidth and ImageHeight is required for get picture size', { cause: exif });
    }

    if (exif.Rotation && (exif.Rotation === 90 || exif.Rotation === 270)) {
        return [exif.ImageHeight, exif.ImageWidth];
    }

    return [exif.ImageWidth, exif.ImageHeight];
}

function buildGroupId(exif: { MediaGroupUUID?: string; ContentIdentifier?: string }): string {
    return exif.MediaGroupUUID || exif.ContentIdentifier || uuid();
}

const cache = new Cache<IMediaExifList>('exif');

interface IMediaExifOptions {
    useCache?: boolean;
}

export async function buildExif(name: string, path: string, options: IMediaExifOptions = {}): Promise<IMediaExifList> {
    const { useCache = true } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    debug('Start build exif data');

    const data = await exiftoolGetter(path);

    const result = data.reduce((acc, exif) => {
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

    await cache.set(name, result);

    debug('Finish build exif data');

    return result;
}
