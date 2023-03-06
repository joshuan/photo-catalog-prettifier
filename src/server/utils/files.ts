import { buildThumbnail } from '../../cli/commands/buildData/thumbnail.js';
import { buildDate } from '../../lib/exifdate/index.js';
import { ExifTool, IExifPartialData, IExifRequiredData } from '../../lib/exiftool.js';
import { buildGps } from '../../lib/gps.js';
import { getBasename } from '../../lib/path.js';

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
};

export type TFilesList = Record<string, TFilesItem>;

interface IBuildFilesOptions {
    useThumbnails?: boolean;
}

export async function buildFiles(path: string, options: IBuildFilesOptions = {}): Promise<TFilesList> {
    const { useThumbnails = true } = options;
    const tool = new ExifTool(path);
    const files = await tool.getFullData();
    const data: TFilesList = {};

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
            type: ExifTool.getType(file.MIMEType),
            groupId: ExifTool.getGroupId(file),
            size: await ExifTool.calcFileSize(file),
            imageSize: ExifTool.calcImageSize(file),
        };
    }

    return data;
}
