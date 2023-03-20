import md5File from 'md5-file';
import { BrokenFile } from '../../../../errors/BrokenFile.js';
import { getOriginalSourceFilename } from './fields/originalName.js';
import { fileStat } from '../../../../utils/fs.js';
import { getBasename, getDirpath, getExt } from '../../../../utils/path.js';
import { IFileinfo } from './interface.js';

export async function buildFileinfo(filepath: string): Promise<IFileinfo> {
    const filename = getBasename(filepath);

    if (filename.startsWith('.')) {
        throw new BrokenFile(filepath, 'File starts from dot');
    }

    const stats = await fileStat(filepath);

    if (!stats.isFile()) {
        throw new BrokenFile(filepath, 'File is directory');
    }

    const md5 = await md5File(filepath);
    const ext = getExt(filename);

    return {
        directory: getDirpath(filepath),
        basename: getBasename(filename, ext),
        originalName: getOriginalSourceFilename(filename),
        ext,
        size: stats.size,
        md5,
    };
}
