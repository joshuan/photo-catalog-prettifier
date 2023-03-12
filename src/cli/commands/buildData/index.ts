import { Database } from '../../../lib/Database/index.js';

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
    await Database.init(argv.path, {
        useFilesCache: false,
        useExifCache: false,
        useHashCache: false,
        usePreviewsCache: false,
        useItemsCache: false,
    });
}
