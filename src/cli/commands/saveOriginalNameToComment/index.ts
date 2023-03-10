import { Argv } from 'yargs';
import { exiftool, exiftoolGetter } from '../../../utils/exiftool.js';

export const command = 'saveOriginalNameToComment <path>';
export const description = 'Save original file name to comment in all files from path';

interface ISaveOriginNameToCommentArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<ISaveOriginNameToCommentArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

export async function handler(argv: ISaveOriginNameToCommentArguments) {
    const ROOT = argv.path;
    const data = await exiftoolGetter(ROOT, ['FileName', 'Comment']);

    for (const item of data) {
        if (item.Comment.includes('Original filename:')) {
            console.warn(`Skip file ${item.FileName} because it already has the original name saved: "${item.Comment}"`);
            continue;
        }

        const comment = [`Original filename: ${item.FileName}`, item.Comment].filter(Boolean).join('\n');

        if (!argv.dryRun) {
            await exiftool([`-Comment=${comment}`, '-overwrite_original', item.SourceFile]);
        }

        console.log(`- ${item.FileName} comment update to: "${comment}"`);
    }
}
