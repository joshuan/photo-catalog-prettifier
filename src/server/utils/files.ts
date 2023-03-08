import { buildThumbnail } from '../../cli/commands/buildData/thumbnail.js';
import { buildDate } from '../../utils/exifdate/index.js';
import { Exiftool, IExifPartialData, IExifRequiredData } from '../../lib/Exiftool.js';
import { buildGps } from '../../utils/gps.js';
import { getBasename } from '../../utils/path.js';

export type TFilesItem = {
    SourceFile: IExifRequiredData['SourceFile'],
    Directory: IExifRequiredData['Directory'],
    FileName: IExifRequiredData['FileName'],
    MIMEType: IExifRequiredData['MIMEType'],
    exif: IExifPartialData,
    date?: number,
    gps?: { lat: string; lon: string };
    thumbnailFile: string | null;
    thumbnailUrl: string | null;
    type: 'image' | 'video';
    groupId: string | null;
    size: number;
    imageSize: number;
    win?: true;
    compareHash?: string;
};

export type TFilesMap = Record<string, TFilesItem>;

interface IBuildFilesOptions {
    useThumbnails?: boolean;
}

export async function buildFiles(path: string, options: IBuildFilesOptions = {}): Promise<TFilesMap> {
    const { useThumbnails = true } = options;
    const tool = new Exiftool(path);
    const files = await tool.getFullData();
    const data: TFilesMap = {};

    for (const file of files) {
        const thumbnail = useThumbnails ? await buildThumbnail(file) : null;

        data[file.FileName] = {
            SourceFile: file.SourceFile,
            Directory: file.Directory,
            FileName: file.FileName,
            MIMEType: file.MIMEType,
            exif: file,
            date: buildDate(file, process.env.DEFAULT_PHOTO_OFFSET)?.getTime(),
            thumbnailFile: thumbnail,
            gps: buildGps(file),
            thumbnailUrl: thumbnail ? `/thumbnails/${getBasename(thumbnail)}` : null,
            type: Exiftool.getType(file.MIMEType),
            groupId: Exiftool.getGroupId(file),
            size: await Exiftool.calcFileSize(file),
            imageSize: Exiftool.calcImageSize(file),
        };
    }

    return data;
}
