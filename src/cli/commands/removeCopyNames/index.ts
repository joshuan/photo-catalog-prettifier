import { Argv } from 'yargs';
import { buildFiles } from '../../../lib/Database/tables/file.js';
import { readDir, rename } from '../../../utils/fs.js';
import { getBasename, getExt } from '../../../utils/path.js';

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

const SUFFIX_RE = /\(\d+\)$/;

function isHasSuffix(filename: string): boolean {
    const originalExt = getExt(filename);
    const originalBase = getBasename(filename, originalExt);

    return SUFFIX_RE.test(originalBase);
}

function trimSuffix(filename: string): string {
    const originalExt = getExt(filename);
    const originalBase = getBasename(filename, originalExt);

    return `${originalBase.replace(SUFFIX_RE, '').trim()}${originalExt}`;
}

export async function handler(argv: IRemoveCopyNamesArguments) {
    const ROOT = argv.path;
    const name = getBasename(ROOT);
    const list = await buildFiles(name, ROOT);
    const filesWithSuffix = Object.keys(list).filter(isHasSuffix);

    for (const filename of filesWithSuffix) {
        const dest = trimSuffix(filename);

        console.log(`- ${filename} -> ${dest}`);
        if (list[dest]) {
            console.log(`  ⚠️ file "${dest}" already exists, he was not renamed.`);
        } else {
            if (!argv.dryRun) {
                await rename(ROOT, filename, dest);
            }
        }
    }

    console.log('✅');
}
