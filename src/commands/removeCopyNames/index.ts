import path from 'node:path';
import { Argv } from 'yargs';
import { exec } from '../../exiftool/index.js';
import { rename } from '../../utils/fs.js';

export const command = 'removeCopyNames <path>';
export const description = 'Remove copies index from filename';

interface IRemoveCopyNamesArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<IRemoveCopyNamesArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with files',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

interface IPartData {
    SourceFile: string;
    FileName: string;
}

function getData(path: string): Promise<IPartData[]> {
    return exec<IPartData[]>(path, ['-FileName'])
        .then(({ data }) => data);
}

const SUFFIX_RE = /\(\d+\)$/;

function isHasSuffix(item: IPartData): boolean {
    const originalExt = path.extname(item.FileName);
    const originalBase = path.basename(item.FileName, originalExt);

    return SUFFIX_RE.test(originalBase);
}

function trimSuffix(filename: string): string {
    const originalExt = path.extname(filename);
    const originalBase = path.basename(filename, originalExt);

    return `${originalBase.replace(SUFFIX_RE, '')}${originalExt}`;
}

export async function handler(argv: IRemoveCopyNamesArguments) {
    const ROOT = argv.path;
    const allFiles = await getData(ROOT);
    const allSourceFiles = allFiles.reduce<Record<string, IPartData>>((acc, item) => {
        acc[item.FileName] = item;
        return acc;
    }, {});
    const filesWithSuffix = allFiles.filter(isHasSuffix);

    for (const item of filesWithSuffix) {
        const dest = trimSuffix(item.FileName);

        console.log(`- ${item.FileName} -> ${dest}`);
        if (allSourceFiles[dest]) {
            console.log(`  ⚠️ file "${dest}" already exists, he was not renamed.`);
        } else {
            if (!argv.dryRun) {
                await rename(ROOT, item.FileName, dest);
            }
        }
    }

    console.log('✅');
}
