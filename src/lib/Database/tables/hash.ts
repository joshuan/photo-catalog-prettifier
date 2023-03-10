import { v4 as uuid } from 'uuid';
import { compare } from '../../../utils/compare.js';
import { getFolder } from '../../../utils/folder.js';
import { getBasename, getExt, joinPath } from '../../../utils/path.js';
import { pLimit } from '../../../utils/pLimit.js';
import { buildPreview } from '../../../utils/preview.js';

interface CompareItem {
    filename: string;
    examplePath: string;
}

async function compareFiles(first: CompareItem, second: CompareItem): Promise<{ files: [string, string]; compare: number; }> {
    return {
        files: [ first.filename, second.filename ],
        compare: await compare([first.examplePath, second.examplePath]),
    };
}

export type IMediaHashList = Record<string, string>;

interface IMediaHashFile {
    filepath: string;
    filename: string;
    directory: string;
}

interface IMediaHashExif {
    type: 'image' | 'video';
}

function buildExampleFilename(originalFilename: string): string {
    const originalExt = getExt(originalFilename);
    const basename = getBasename(originalFilename, originalExt);

    return basename + originalExt.replace(/\./g, '_') + '_example.png';
}

export async function buildHash<
    F extends IMediaHashFile,
    E extends IMediaHashExif,
>(
    files: Record<string, F>,
    exifs: Record<string, E>,
): Promise<IMediaHashList> {
    const compareJobs = [];
    const folder = await getFolder('examples');

    for (const file of Object.values(files)) {
        const exif = exifs[file.filename];

        if (!exif) {
            throw new Error('Undefined exif', { cause: file.filename });
        }

        const exampleFilename = buildExampleFilename(file.filename);
        const dest = joinPath(folder, exampleFilename);

        compareJobs.push(() => buildPreview({
            type: exif.type,
            src: file.filepath,
            dest,
        }, {
            overwrite: true,
        }).then(() => ({
            filename: file.filename,
            exampleFilename,
            examplePath: dest,
        })));
    }

    const examples = await pLimit(compareJobs);
    const pairFiles = [];

    for (let i = 0 ; i < examples.length ; i++) {
        for (let j = i + 1; j < examples.length; j++) {
            pairFiles.push([examples[i], examples[j]]);
        }
    }

    const pairs = await pLimit(pairFiles.map(([first, second]) => (() => compareFiles(first, second))));

    const database: IMediaHashList = {};

    for (const { files, compare } of pairs) {
        const first = files[0];
        const second = files[1];

        if (compare === 0) {
            if (typeof database[first] === 'undefined') {
                const newUuid = uuid();
                database[first] = newUuid;
                database[second] = newUuid;
            } else {
                database[second] = database[first];
            }
        }
    }

    return database;
}
