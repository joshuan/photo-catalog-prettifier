import { Argv } from 'yargs';
import md5File from 'md5-file';
import _ from 'lodash';
import { buildFiles } from '../../../lib/Database/tables/file.js';
import { deleteFile } from '../../../utils/fs.js';
import { getBasename } from '../../../utils/path.js';

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

export async function handler(argv: IRemoveFullDuplicatesArguments) {
    const ROOT = argv.path;
    const name = getBasename(ROOT);
    const list = await buildFiles(name, ROOT);
    const grouped = _.groupBy(list, 'md5');

    for (const md5 in grouped) {
        const files = grouped[md5];

        if (files.length >= 2) {
            console.log(files.map(({ filename }) => filename));

            for (let i = 1 ; i < files.length ; i++) {
                if (argv.dryRun) {
                    console.log('Будем удалять:', `${ROOT}/${files[i].filename}`);
                } else {
                    await deleteFile(ROOT, files[i].filename);
                    console.log('Удалили %s', files[i].filename);
                }
            }
        }
    }

    console.log('✅');
}
