import { buildFile } from './item.js';
import { readDir } from '../../../utils/fs.js';
import { pLimit } from '../../../utils/pLimit.js';

interface IOptions {
    overwritePreview: boolean;
}

export async function buildFiles(dirpath: string, options: IOptions) {
    const allFiles = await readDir(dirpath);

    return await pLimit(
        allFiles
            .filter(filename => !filename.startsWith('.') && !filename.includes('xmp'))
            .map(filename => () => buildFile(dirpath, filename, options)),
        { bar: 'Files' },
    );
}
