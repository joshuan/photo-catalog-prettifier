import { v4 as uuid } from 'uuid';
import { config } from '../../../config.js';
import { compare } from '../../../utils/compare.js';
import { getCompared, onCompare } from '../../../utils/compareCache.js';
import { getDataFolder } from '../../../utils/data.js';
import { debugUtil } from '../../../utils/debug.js';
import { getBasename, getExt, joinPath } from '../../../utils/path.js';
import { pLimit } from '../../../utils/pLimit.js';
import { buildPreviewFile } from '../../../utils/preview.js';
import { IType } from '../../../utils/type.js';
import { Cache } from '../../Cache.js';

interface CompareItem {
    filename: string;
    examplePath: string;
}

interface CompareResult {
    files: [string, string];
    compare: number;
}

const debug = debugUtil('database:hash');

async function compareFiles(first: CompareItem, second: CompareItem): Promise<CompareResult> {
    const filenames: [string, string] = [ first.filename, second.filename ];
    const filepaths: [string, string] = [ first.examplePath, second.examplePath ];

    const cache = getCompared(filepaths);

    if (typeof cache !== 'undefined') {
        return { files: filenames, compare: cache };
    }

    const result = await compare(filepaths, { fuzz: config.hash.exampleFuzz });

    onCompare(filepaths, result);

    return { files: filenames, compare: result };
}

export interface IMediaHashList {
    data: Record<string, string>;
    compare: CompareResult[];
}

interface IMediaHashFile {
    filepath: string;
    filename: string;
    fileinfo: {
        directory: string;
    };
    exif: {
        type: IType;
        mime: string;
        imageSize: [number, number];
    };
}

function buildExampleFilename(originalFilename: string): string {
    const originalExt = getExt(originalFilename);
    const basename = getBasename(originalFilename, originalExt);

    return basename + originalExt.replace(/\./g, '_') + '_example.png';
}

const cache = new Cache<IMediaHashList>('hash');

interface IMediaHashOptions {
    useCache?: boolean;
    regenerateExample?: boolean;
}

export async function buildHash<
    F extends IMediaHashFile,
>(
    name: string,
    { files }: {
        files: Record<string, F>,
    },
    options: IMediaHashOptions = {},
): Promise<IMediaHashList> {
    const { useCache = true, regenerateExample = false } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    debug('Start build hash data');

    const exampleJobs = [];
    const folder = await getDataFolder(`examples/${name}`);
    const filesList = Object.values(files);

    for (const file of filesList) {
        const exif = file.exif;

        if (!exif) {
            throw new Error('Undefined exif', { cause: file.filename });
        }

        const exampleFilename = buildExampleFilename(file.filename);
        const dest = joinPath(folder, exampleFilename);
        const previewSrc = {
            type: exif.type,
            mime: exif.mime,
            src: file.filepath,
            dest,
        };
        const previewOptions = {
            overwrite: regenerateExample,
            size: config.hash.exampleSize,
            ratio: false,
            originalSize: exif.imageSize,
            gray: true,
        };
        const result = {
            filename: file.filename,
            exampleFilename,
            examplePath: dest,
        };

        exampleJobs.push(() => buildPreviewFile(previewSrc, previewOptions).then(() => result));
    }

    const examples = await pLimit(exampleJobs, { bar: 'Examples' });

    const pairFiles = [];

    for (let i = 0 ; i < examples.length ; i++) {
        for (let j = i + 1; j < examples.length; j++) {
            pairFiles.push([examples[i], examples[j]]);
        }
    }

    const pairs = await pLimit(
        pairFiles.map(([first, second]) => (() => compareFiles(first, second))),
        { bar: 'Compare' },
    );

    const result: IMediaHashList = {
        data: {},
        compare: pairs,
    };

    for (const { files, compare } of pairs) {
        const first = files[0];
        const second = files[1];

        if (compare < config.hash.exampleDiff) {
            if (typeof result.data[first] === 'undefined') {
                const newUuid = uuid();
                result.data[first] = newUuid;
                result.data[second] = newUuid;
            } else {
                result.data[second] = result.data[first];
            }
        }
    }

    await cache.set(name, result);

    debug('Finish build hash data');

    return result;
}
