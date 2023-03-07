import { Argv } from 'yargs';
import { ExifTool } from '../../../lib/exiftool.js';
import { readDir, rename } from '../../../lib/fs.js';
import { getBasename, getExt } from '../../../lib/path.js';

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
    const tool = new ExifTool(path);
    return tool.getFiles();
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
    const allFiles = await readDir(ROOT);
    const filesWithSuffix = allFiles.filter(isHasSuffix);

    for (const file of filesWithSuffix) {
        const dest = trimSuffix(file);

        console.log(`- ${file} -> ${dest}`);
        if (allFiles.includes(dest)) {
            console.log(`  ⚠️ file "${dest}" already exists, he was not renamed.`);
        } else {
            if (!argv.dryRun) {
                await rename(ROOT, file, dest);
            }
        }
    }

    console.log('✅');
}
