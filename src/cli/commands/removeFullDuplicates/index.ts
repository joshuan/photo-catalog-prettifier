import md5File from 'md5-file';
import { Argv } from 'yargs';
import _ from 'lodash';
import { deleteFile, readDir } from '../../../utils/fs.js';
import { joinPath } from '../../../utils/path.js';
import { pLimit } from '../../../utils/pLimit.js';

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
    const allFiles = await readDir(ROOT);

    const list = await pLimit(
        allFiles
            .filter(filename => !filename.startsWith('.') && !filename.includes('xmp'))
            .map(filename => async () => ({
                    filename,
                    md5: await md5File(joinPath(ROOT, filename)),
            })),
        { bar: 'Files' },
    );

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
