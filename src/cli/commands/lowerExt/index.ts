import { Argv } from 'yargs';
import { ExifTool } from '../../../lib/exiftool.js';
import { rename } from '../../../lib/fs.js';
import { getBasename, getExt } from '../../../lib/path.js';

export const command = 'lowerExt <path>';
export const description = 'Find similar photos';

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

function getData(path: string): Promise<IPartData[]> {
    const tool = new ExifTool(path);
    return tool.getFiles();
}

const LOWER_EXT_RE = /^\.([a-z]+)$/;

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
    const list = await getData(ROOT);
    // const list = allFiles.filter((item) => !isLowerExt(item.FileName));

    for (const item of list) {
        if (isLowerExt(item.FileName)) {
            continue;
        }

        const dest = buildLowerFileName(item.FileName);

        console.log(`- ${item.FileName} -> ${dest}`);

        if (!argv.dryRun) {
            await rename(ROOT, item.FileName, dest);
        }
    }

    console.log('✅');
}
