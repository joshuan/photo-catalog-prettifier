import { Convert } from '../../../lib/Convert.js';
import { Exiftool, IExifRequiredData } from '../../../lib/Exiftool.js';
import { Ffmpeg } from '../../../lib/Ffmpeg.js';

export async function buildThumbnail(item: IExifRequiredData<'Directory' | 'FileName' | 'MIMEType'>): Promise<string> {
    const type = Exiftool.getType(item.MIMEType);

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
