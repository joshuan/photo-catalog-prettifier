import { Database } from '../../../server/services/database.js';

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
    await Database.init(argv.path, { useCache: false, useThumbnails: true });

    console.log('Data was saved to database/data.json');
}
