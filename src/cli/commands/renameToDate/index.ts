import { Argv } from 'yargs';
import { saveData } from '../../utils/database.js';
import { ExifTool } from '../../utils/exiftool.js';
import { rename } from '../../utils/fs.js';
import { getLowerExt } from '../../utils/path.js';
import { buildDate } from '../../../lib/exifdate/index.js';
import { createFilename, lowerExt } from './file.js';

export const command = 'renameToDate <path>';
export const description = 'Rename file to calculated date';

interface RenameToDateArguments {
    path: string;
    defaultPhotoOffset: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<RenameToDateArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .option('defaultPhotoOffset', {
            desc: 'Offset for photo by default (example: +05:00)',
            type: 'string',
            default: '+00:00',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

export async function handler(argv: RenameToDateArguments): Promise<void> {
    const ROOT = argv.path;
    const tool = new ExifTool(ROOT);
    const data = await tool.getFullData();
    const renames = [];

    for (const item of data) {
        const src = item.FileName;

        const date = buildDate(item, argv.defaultPhotoOffset);
        let dest = date ? createFilename(date, getLowerExt(src)) : lowerExt(src);

        renames.push({ src, dest });

        if (!argv.dryRun) {
            await rename(ROOT, src, dest);
        }

        console.log(`- ${src} was renamed to "${dest}"`);
    }

    await saveData('renames', renames);
}
