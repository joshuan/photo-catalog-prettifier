import { Database } from '../../../lib/Database/index.js';
import { rmDir } from '../../../utils/fs.js';
import { getBasename, resolveByRoot } from '../../../utils/path.js';

export const command = 'buildData <path>';
export const description = 'Build collection data from path folder';

export function builder(yargs: any) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        })
    ;
}

export async function handler(argv: any) {
    const ROOT = argv.path;
    const name = getBasename(ROOT);
    await rmDir(resolveByRoot(`data/database/${name}`));
    await rmDir(resolveByRoot(`data/previews/${name}`));
    await rmDir(resolveByRoot(`data/examples/${name}`));
    await Database.init(argv.path);
}
