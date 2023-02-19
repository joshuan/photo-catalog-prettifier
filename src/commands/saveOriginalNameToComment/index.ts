import { Argv } from 'yargs';
import { exec } from '../../exiftool/index.js';
import { seriesPromise } from '../../utils/promise.js';

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

interface INameAndComment {
    SourceFile: string;
    FileName: string;
    Comment: string;
}

function validateItem(item: Partial<INameAndComment>): INameAndComment {
    if (!item.SourceFile) { throw new Error('Undefined SourceFile!', { cause: item }); }
    if (!item.FileName) { throw new Error('Undefined FileName!', { cause: item }); }

    return {
        SourceFile: item.SourceFile,
        FileName: item.FileName,
        Comment: item.Comment || '',
    }
}

function getFileNamesAndComments(path: string): Promise<INameAndComment[]> {
    return exec<INameAndComment[]>(path, ['-FileName', '-Comment'])
        .then(({ data }) => data.map(validateItem));
}

function filterAlreadyUpdated(item: INameAndComment): boolean {
    const isAlreadySaved = item.Comment.includes('Original filename:');

    if (isAlreadySaved) {
        console.warn(`Skip file ${item.FileName} because it already has the original name saved: "${item.Comment}"`);
    }

    return !isAlreadySaved;
}

function buildComment(item: INameAndComment): INameAndComment {
    return {
        ...item,
        Comment: [`Original filename: ${item.FileName}`, item.Comment].filter(Boolean).join('\n'),
    };
}

function updateCommentBuilder(dryRun: boolean) {
    return async function updateComment(item: INameAndComment): Promise<string> {
        if (dryRun) {
            return `[DRY-RUN] ${item.FileName} comment will be update to: "${item.Comment}"`;
        }

        await exec<INameAndComment[]>(item.SourceFile, [`-Comment=${item.Comment}`, '-overwrite_original']);

        return `${item.FileName} comment update to: "${item.Comment}"`;
    }
}

export async function handler(argv: ISaveOriginNameToCommentArguments) {
    const data = await getFileNamesAndComments(argv.path);

    const list = data
        .filter(filterAlreadyUpdated)
        .map(buildComment);

    const result = await seriesPromise(list, updateCommentBuilder(argv.dryRun));

    console.log('✅', result);
}
