import { exec } from '../../exiftool/index.js';
import { seriesPromise } from '../../utils/promise.js';

export const command = 'saveOriginalNameToComment <path>';
export const description = 'Save original file name to comment in all files from path';

export function builder(yargs: any) {
    return yargs
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
        });
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
    return !item.Comment.includes('Original filename:');
}

function buildComment(item: INameAndComment): INameAndComment {
    return {
        ...item,
        Comment: [`Original filename: ${item.FileName}`, item.Comment].filter(Boolean).join('\n'),
    };
}

function updateComment(item: INameAndComment): Promise<any> {
    return exec<INameAndComment[]>(item.SourceFile, [`-Comment=${item.Comment}`])
        .then(() => `${item.FileName} comment update to: "${item.Comment}"`)
}

export function handler(argv: any) {
    const names = new Set();

    getFileNamesAndComments(argv.path)
        // .then(list => list.filter(filterAlreadyUpdated))
        .then(list => list.map(buildComment))
        .then((list) => seriesPromise(list, updateComment))
        .then((data) => console.log('✅', data))
        .catch(err => console.error(err));
};
