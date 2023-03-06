import { buildThumbnail } from '../../cli/commands/buildData/thumbnail.js';
import { buildDate } from '../../lib/exifdate/index.js';
import { ExifTool, IExifPartialData, IExifRequiredData } from '../../lib/exiftool.js';
import { getBasename } from '../../lib/path.js';

export type TFilesItem = {
    SourceFile: IExifRequiredData['SourceFile'],
    Directory: IExifRequiredData['Directory'],
    FileName: IExifRequiredData['FileName'],
    MIMEType: IExifRequiredData['MIMEType'],
    exif: IExifPartialData,
    date?: number,
    gps?: { lat: number; lon: number };
    thumbnailFile: string;
    thumbnailUrl: string;
    type: 'image' | 'video';
    groupId: string | null;
    size: number;
    imageSize: number;
    win?: true;
};

export type TFilesList = Record<string, TFilesItem>;

export async function buildFiles(path: string): Promise<TFilesList> {
    const tool = new ExifTool(path);
    const files = await tool.getFullData();
    const data: TFilesList = {};

    for (const file of files) {
        const thumbnail = await buildThumbnail(file);

        data[file.FileName] = {
            SourceFile: file.SourceFile,
            Directory: file.Directory,
            FileName: file.FileName,
            MIMEType: file.MIMEType,
            exif: file,
            date: buildDate(file)?.getTime(),
            thumbnailFile: thumbnail,
            thumbnailUrl: `/thumbnails/${getBasename(thumbnail)}`,
            type: ExifTool.getType(file.MIMEType),
            groupId: ExifTool.getGroupId(file),
            size: await ExifTool.calcFileSize(file),
            imageSize: ExifTool.calcImageSize(file),
        };
    }

    return data;
}
