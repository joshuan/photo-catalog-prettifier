import { Argv } from 'yargs';
import md5File from 'md5-file';
import { Exiftool } from '../../../lib/Exiftool.js';

export const command = 'findSimilar <path>';
export const description = 'Find similar photos';

interface IFindSimilarArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<IFindSimilarArguments> {
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
    const tool = new Exiftool(path);
    return tool.getFiles();
}

async function getMd5(item: IPartData): Promise<IPartData & { md5: string; }> {
    const md5 = await md5File(item.SourceFile);

    return {
        ...item,
        md5,
    }
}

export async function handler(argv: IFindSimilarArguments) {
    const ROOT = argv.path;
    const list = await getData(ROOT);
    const data = await Promise.all(list.map(getMd5));

    console.log(data);

    console.log('✅');
}
