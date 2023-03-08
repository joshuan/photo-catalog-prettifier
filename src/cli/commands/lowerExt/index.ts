import { Argv } from 'yargs';
import { readDir, rename } from '../../../utils/fs.js';
import { getBasename, getExt } from '../../../utils/path.js';

export const command = 'lowerExt <path>';
export const description = 'Rename files to lower extensions';

interface ILowerExtArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<ILowerExtArguments> {
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

const LOWER_EXT_RE = /^\.([a-z0-9]+)$/;

function isLowerExt(filename: string): boolean {
    const ext = getExt(filename);

    return LOWER_EXT_RE.test(ext);
}

function buildLowerFileName(filename: string): string {
    const originalExt = getExt(filename);
    const originalBase = getBasename(filename, originalExt);

    return `${originalBase}${originalExt.toLowerCase()}`;
}

export async function handler(argv: ILowerExtArguments) {
    const ROOT = argv.path;
    const files = await readDir(ROOT);

    for (const file of files) {
        if (file.startsWith('.') || isLowerExt(file)) {
            continue;
        }

        const dest = buildLowerFileName(file);

        console.log(`- ${file} -> ${dest}`);

        if (!argv.dryRun) {
            await rename(ROOT, file, dest);
        }
    }

    console.log('✅');
}
