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
    size?: number;
    ratio?: boolean;
    originalSize?: [number, number];
    gray?: boolean;
}

export async function buildPreview(item: IPreview, options: IPreviewOptions = {}): Promise<void> {
    const { overwrite = true, ratio = true, size = 160, originalSize, gray = false } = options;
    const { type, src, dest } = item;

    if (!overwrite && await isFileExist(dest)) {
        return;
    }

    switch (type) {
        case 'image':
            const options = [
                '-quality', '70',
            ];

            if (!ratio) {
                options.push('-gravity', 'center');
                options.push('-crop', '1:1');
            }

            options.push('-thumbnail', `${size}x${size}`);

            if (gray) {
                options.push('-colorspace', 'Gray');
            }

            await convert([
                src,
                ...options,
                dest,
            ]);

            return;
        case 'video':
            const filters: string[] = [];

            if (ratio) {
                filters.push(`scale=${size}:-1`);
            } else {
                filters.push((originalSize && originalSize[0] < originalSize[1]) ? 'crop=in_w:in_w' : 'crop=in_h:in_h');
                filters.push(`scale=${size}:${size}`);
            }

            if (gray) {
                filters.push('colorchannelmixer=0.3:0.4:0.3:0:0.3:0.4:0.3:0:0.3:0.4:0.3');
            }

            await ffmpeg([
                '-i', src,
                '-ss', '00:00:00',
                '-frames:v', '1',
                '-filter:v', filters.join(', '),
                dest, '-y',
            ]);

            return;
        default:
            throw new Error('Unknown file type', { cause: item });
    }
}
