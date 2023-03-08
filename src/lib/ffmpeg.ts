import { isFileExist } from './fs.js';
import { getBasename, joinPath } from './path.js';
import { Thumbnailable } from './thumbnailable.js';

export class Ffmpeg extends Thumbnailable {
    constructor() {
        super('ffmpeg');
    }

    async createThumbnail(root: string, filename: string) {
        const thumbnail = this.buildThumbnailPath(getBasename(root), filename);

        if (await isFileExist(thumbnail)) {
            return thumbnail;
        }

        // ffmpeg -i input_video.mp4 -ss 00:00:05 -vframes 1 -s 400x400 -q:v 2 output_thumbnail.jpg
        this.exec([
            '-i', joinPath(root, filename),
            '-ss', '00:00:00',
            '-vframes', '1',
            // '-s', this.thumbnailSize,
            '-vf', `scale=${this.thumbnailSize}:-2`,
            '-q:v', '2',
            thumbnail,
            '-y',
        ]);

        return thumbnail;
    }
}
