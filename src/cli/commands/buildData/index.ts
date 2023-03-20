import { Database } from '../../../lib/Database/index.js';

export const command = 'buildData <path>';
export const description = 'Build collection data from path folder';

export function builder(yargs: any) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        })
        .positional('useCache', {
            desc: 'Use cache',
            type: 'boolean',
            default: false,
        })
        .positional('overwritePreview', {
            desc: 'Overwrite preview files',
            type: 'boolean',
            default: false,
        })
    ;
}

export async function handler(argv: any) {
    await Database.init(argv.path, {
        useFilesCache: argv.useCache,
        useGroupsCache: argv.useCache,
        overwritePreview: argv.overwritePreview,
    });
}
