import { isFileExist } from '../utils/fs.js';
import { getBasename, joinPath } from '../utils/path.js';
import { Thumbnailable } from './Thumbnailable.js';

export class Convert extends Thumbnailable {
    constructor() {
        super('convert');
    }

    async createThumbnail(root: string, filename: string) {
        const thumbnail = this.buildThumbnailPath(getBasename(root), filename);

        if (await isFileExist(thumbnail)) {
            return thumbnail;
        }

        this.exec([
            joinPath(root, filename),
            '-thumbnail', `${this.thumbnailSize}x${this.thumbnailSize}`,
            '-quality', '70',
            thumbnail,
        ]);

        return thumbnail;
    }
}
