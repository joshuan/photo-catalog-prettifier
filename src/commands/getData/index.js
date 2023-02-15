import { exec } from '../../exiftool/index.js';
import { saveData } from '../../utils/database.js';

export const command = 'getData <path>';
export const description = 'get data from path folder';

export function builder(yargs) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        });
}

export async function handler(argv) {
    const data = await exec(argv.path)
        
    await saveData('fullData', data);

    console.log('Data was saved to database/fullData.json');
};
