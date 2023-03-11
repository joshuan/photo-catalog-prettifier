import { v4 as uuid } from 'uuid';
import { compare } from '../../../utils/compare.js';
import { getFolder } from '../../../utils/data.js';
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

const EXAMPLE_SIZE = 100; // Размер картинки - 100x100, 10000 пикселей
const EXAMPLE_DIFF = 50;  // Кол-во пикселей, которые могут расходиться из исходных 10000 (0.5%)
const EXAMPLE_FUZZ = 10;  //

async function compareFiles(first: CompareItem, second: CompareItem): Promise<CompareResult> {
    return {
        files: [ first.filename, second.filename ],
        compare: await compare([first.examplePath, second.examplePath], { fuzz: EXAMPLE_FUZZ }),
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
    const { useCache = true } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    const compareJobs = [];
    const folder = await getFolder(`examples/${name}`);

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
            size: EXAMPLE_SIZE,
            ratio: false,
            originalSize: exif.imageSize,
            gray: true,
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

    const result: IMediaHashList = {
        data: {},
        compare: pairs,
    };

    for (const { files, compare } of pairs) {
        const first = files[0];
        const second = files[1];

        if (compare < EXAMPLE_DIFF) {
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

    return result;
}
