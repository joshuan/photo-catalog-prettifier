import { joinPath } from '../../../utils/path.js';
import { buildExif } from './exif/index.js';
import { buildFileinfo } from './fileinfo/index.js';
import { buildHash } from './hash/index.js';
import { IFile } from './interfaces.js';
import { buildPreview } from './preview/index.js';

interface IOptions {
    overwritePreview: boolean;
}

export async function buildFile(dirpath: string, filename: string, options: IOptions): Promise<IFile> {
    const filepath = joinPath(dirpath, filename);
    const [ fileinfo, exif ] = await Promise.all([ buildFileinfo(filepath), buildExif(filepath) ]);
    const preview = await buildPreview(filepath, exif, options);
    const hash = await buildHash(filepath, exif, options);

    return {
        filename,
        filepath,
        fileinfo,
        exif,
        preview,
        hash,
    };
}
