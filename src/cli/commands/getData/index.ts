import { saveData } from '../../utils/database.js';
import { ExifTool } from '../../utils/exiftool.js';

export const command = 'getData <path>';
export const description = 'get data from path folder';

export function builder(yargs: any) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        })
    ;
}

export async function handler(argv: any) {
    const tool = new ExifTool(argv.path)
    const data = await tool.getFullData();

    await saveData('fullData', data.map((item) => tool.parseItem(item)));

    console.log('Data was saved to database/fullData.json');
}
