import md5File from 'md5-file';
import { debugUtil } from '../../../utils/debug.js';
import { getOriginalSourceFilename } from '../../../utils/filename.js';
import { fileStat, readDir } from '../../../utils/fs.js';
import { getBasename, getExt, joinPath, resolvePath } from '../../../utils/path.js';
import { pLimit } from '../../../utils/pLimit.js';
import { Cache } from '../../Cache.js';

export type IMediaFilesItem = {
    filepath: string;
    filename: string;
    directory: string;
    previewFilename: string;
    basename: string;
    originalName: string;
    ext: string;
    size: number;
    md5: string;
};

export type IMediaFilesList = Record<string, IMediaFilesItem>;

const debug = debugUtil('database:file');

function buildPreviewFilename(originalFilename: string): string {
    const originalExt = getExt(originalFilename);
    const basename = getBasename(originalFilename, originalExt);

    return basename + originalExt.replace(/\./g, '_') + '_preview.png';
}

const cache = new Cache<IMediaFilesList>('files');

interface IMediaFilesOptions {
    useCache?: boolean;
}

async function buildFile(folder: string, filename: string): Promise<IMediaFilesItem | void> {
    if (filename.startsWith('.')) {
        return;
    }

    const filepath = joinPath(folder, filename);
    const stats = await fileStat(filepath);

    if (!stats.isFile()) {
        return;
    }

    const md5 = await md5File(filepath);
    const ext = getExt(filename);

    return {
        filename,
        filepath,
        directory: folder,
        basename: getBasename(filename, ext),
        originalName: getOriginalSourceFilename(filename),
        previewFilename: buildPreviewFilename(filename),
        ext,
        size: stats.size,
        md5,
    };
}

export async function buildFiles(name: string, path: string, options: IMediaFilesOptions = {}): Promise<IMediaFilesList> {
    const { useCache = true } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    debug('Start build file data');

    const root = resolvePath(path);

    const allFiles = await readDir(root);

    const files = await pLimit(
        allFiles.map(filename => () => buildFile(root, filename)),
        { bar: 'Files' },
    );

    const result = files.reduce((acc, item) => {
        if (item) {
            acc[item.filename] = item;
        }

        return acc;
    }, {} as IMediaFilesList);

    await cache.set(name, result);

    debug('Finish build file data');

    return result;
}
