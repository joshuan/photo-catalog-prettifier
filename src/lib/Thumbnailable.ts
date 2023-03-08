import { Executable } from './Executable.js';
import { getBasename, getExt, joinPath, resolveByRoot } from '../utils/path.js';

export class Thumbnailable extends Executable {
    protected thumbnailSize: string = '160';

    createThumbnailFilename(filename: string): string {
        const originalExt = getExt(filename);
        const basename = getBasename(filename, originalExt);

        return basename + originalExt.replace('\.', '_') + '_thumbnail.png';
    }

    buildThumbnailPath(dirname: string, filename: string): string {
        const thumbnail = dirname + '_' + this.createThumbnailFilename(filename);

        return joinPath(resolveByRoot('database/thumbnails'), thumbnail);
    }


}
