import { saveData } from '../../../lib/database.js';
import { buildDate } from '../../../lib/exifdate/index.js';
import { ExifTool } from '../../../lib/exiftool.js';
import { buildGps } from '../../../lib/gps.js';
import { buildThumbnail } from './thumbnail.js';

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
    const tool = new ExifTool(argv.path)
    const found = await tool.getFullData();
    const data: Record<string, any> = {};

    for (const item of found) {
        data[item.FileName] = {
            ...item,
            date: buildDate(item),
            gps: buildGps(item),
            thumbnail: item.ThumbnailImage || await buildThumbnail(item),
        };
    }

    await saveData('data', data);

    console.log('Data was saved to database/data.json');
}
