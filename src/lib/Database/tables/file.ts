import md5File from 'md5-file';
import { getOriginalSourceFilename } from '../../../utils/filename.js';
import { fileStat, readDir } from '../../../utils/fs.js';
import { getBasename, getExt, joinPath, resolvePath } from '../../../utils/path.js';
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

function buildPreviewFilename(originalFilename: string): string {
    const originalExt = getExt(originalFilename);
    const basename = getBasename(originalFilename, originalExt);

    return basename + originalExt.replace(/\./g, '_') + '_preview.png';
}

const cache = new Cache<IMediaFilesList>('files');

export async function buildFiles(name: string, path: string): Promise<IMediaFilesList> {
    if (await cache.has(name)) {
        return await cache.get(name);
    }

    const root = resolvePath(path);
    const list = await Promise.all(readDir(root)
        .filter(filename => !filename.startsWith('.'))
        .map(filename => ({ filename, filepath: joinPath(root, filename) })));
    const stats = await Promise.all(list
        .map(item => fileStat(item.filepath).then(stats => ({ ...item, stats }))));
    const md5list = await Promise.all(stats
        .filter(({ stats }) => stats.isFile())
        .map(item => md5File(item.filepath).then(md5 => ({ ...item, md5 }))));

    const result = md5list.reduce((acc, { stats, ...item }) => {
        const ext = getExt(item.filename);

        acc[item.filename] = {
            ...item,
            directory: root,
            basename: getBasename(item.filename, ext),
            originalName: getOriginalSourceFilename(item.filename),
            previewFilename: buildPreviewFilename(item.filename),
            ext,
            size: stats.size,
        };
        return acc;
    }, {} as IMediaFilesList);

    await cache.set(name, result);

    return result;
}
