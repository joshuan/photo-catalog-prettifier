import { convert } from './convert.js';
import { ffmpeg } from './ffmpeg.js';
import { isFileExist } from './fs.js';

interface IPreview {
    type: 'image' | 'video';
    src: string;
    dest: string;
}

interface IPreviewOptions {
    overwrite?: boolean;
}

export async function buildPreview(item: IPreview, options: IPreviewOptions = {}): Promise<void> {
    const { overwrite = true } = options;
    const { type, src, dest } = item;

    if (overwrite === false && await isFileExist(dest)) {
        return;
    }

    switch (type) {
        case 'image':
            await convert([
                src,
                '-thumbnail', `160x160`,
                '-quality', '70',
                dest,
            ]);

            return;
        case 'video':
            await ffmpeg([
                '-i', src,
                '-ss', '00:00:00',
                '-vframes', '1',
                // '-s', this.thumbnailSize,
                '-vf', `scale=160:-2`,
                '-q:v', '2',
                dest, '-y',
            ]);

            return;
        default:
            throw new Error('Unknown file type', { cause: item });
    }
}
