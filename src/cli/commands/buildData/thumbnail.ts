import { Convert } from '../../../lib/convert.js';
import { ExifTool, IExifRequiredData } from '../../../lib/exiftool.js';
import { Ffmpeg } from '../../../lib/ffmpeg.js';

export async function buildThumbnail(item: IExifRequiredData<'Directory' | 'FileName' | 'MIMEType'>): Promise<string> {
    const type = ExifTool.getType(item.MIMEType);

    switch (type) {
        case 'image':
            const conv = new Convert();

            return await conv.createThumbnail(item.Directory, item.FileName);
        case 'video':
            const ffmpeg = new Ffmpeg();

            return await ffmpeg.createThumbnail(item.Directory, item.FileName);
        default:
            throw new Error('Unknown file type', { cause: item });
    }
}
