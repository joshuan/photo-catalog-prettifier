import { Argv } from 'yargs';
import md5File from 'md5-file';
import _ from 'lodash';
import { Exiftool } from '../../../lib/Exiftool.js';
import { deleteFile } from '../../../utils/fs.js';

export const command = 'removeFullDuplicates <path>';
export const description = 'Find and remove all full duplicates (compare by hash from file)';

interface IRemoveFullDuplicatesArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<IRemoveFullDuplicatesArguments> {
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

export async function handler(argv: IRemoveFullDuplicatesArguments) {
    const ROOT = argv.path;
    const list = await getData(ROOT);
    const md5List = await Promise.all(list.map(getMd5));
    const grouped = _.groupBy(md5List, 'md5');

    for (const md5 in grouped) {
        const files = grouped[md5];

        if (files.length >= 2) {
            console.log(files.map(({ FileName }) => FileName));

            for (let i = 1 ; i < files.length ; i++) {
                if (argv.dryRun) {
                    console.log('Будем удалять:', `${ROOT}/${files[i].FileName}`);
                } else {
                    await deleteFile(ROOT, files[i].FileName);
                    console.log('Удалили %s', files[i].FileName);
                }
            }
        }
    }

    console.log('✅');
}
