import { v4 as uuid } from 'uuid';
import { config } from '../../../config.js';
import { compare } from '../../../utils/compare.js';
import { getDataFolder } from '../../../utils/data.js';
import { debugUtil } from '../../../utils/debug.js';
import { getBasename, getExt, joinPath } from '../../../utils/path.js';
import { pLimit } from '../../../utils/pLimit.js';
import { buildPreview } from '../../../utils/preview.js';
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
    return {
        files: [ first.filename, second.filename ],
        compare: await compare([first.examplePath, second.examplePath], { fuzz: config.hash.exampleFuzz }),
    };
}

export interface IMediaHashList {
    data: Record<string, string>;
    compare: CompareResult[];
}

interface IMediaHashFile {
    filepath: string;
    filename: string;
    directory: string;
}

interface IMediaHashExif {
    type: 'image' | 'video';
    imageSize: [number, number];
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
    E extends IMediaHashExif,
>(
    name: string,
    { files, exifs }: {
        files: Record<string, F>,
        exifs: Record<string, E>,
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
        const exif = exifs[file.filename];

        if (!exif) {
            throw new Error('Undefined exif', { cause: file.filename });
        }

        const exampleFilename = buildExampleFilename(file.filename);
        const dest = joinPath(folder, exampleFilename);
        const previewSrc = {
            type: exif.type,
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

        exampleJobs.push(() => buildPreview(previewSrc, previewOptions).then(() => result));
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
