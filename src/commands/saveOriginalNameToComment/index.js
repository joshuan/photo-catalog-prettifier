import { exec } from '../../exiftool/index.js';
import { seriesPromise } from '../../utils/promise.js';

export const command = 'saveOriginalNameToComment <path>';
export const description = 'Save original file name to comment in all files from path';

export function builder(yargs) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        });
}

export function handler(argv) {
    const names = new Set();

    exec(argv.path)
        .then(({ data }) => data.map(item => updateFilename(item, names)))
        .then((list) => logList(list))
        .then((list) => seriesPromise(list, renameFiles))
        .then(() => console.log('✅'))
        .catch(err => console.error(err));
};
