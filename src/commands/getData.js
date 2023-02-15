import { getData } from '../exiftool/index.js';
import { saveData } from '../database/index.js';

export const command = 'getData <path>';
export const description = 'get data from path folder';

export function builder(yargs) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        });
}

export function handler(argv) {
    getData(argv.path)
        .then(data => saveData('fullData', data))
        .then(() => console.log('✅'))
        .catch(err => console.error(err));
};
