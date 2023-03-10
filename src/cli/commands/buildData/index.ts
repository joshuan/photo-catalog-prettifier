import { Database } from '../../../lib/Database/index.js';
import { writeJson } from '../../../utils/fs.js';
import { resolveByRoot } from '../../../utils/path.js';

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
    const database = await Database.init(argv.path);

    await writeJson(resolveByRoot('database/database'), database.getData());
    // console.log(database.getData())
}
