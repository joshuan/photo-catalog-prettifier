import { v4 as uuid } from 'uuid';
import progress from 'cli-progress';
import { compare } from '../../../utils/compare.js';
import { getDataFolder } from '../../../utils/data.js';
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

const EXAMPLE_SIZE = 60; // Размер картинки - 100x100, 10000 пикселей
const EXAMPLE_DIFF = 30;  // Кол-во пикселей, которые могут расходиться из исходных 10000 (0.5%)
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

    const exampleJsobs = [];
    const folder = await getDataFolder(`examples/${name}`);
    const filesList = Object.values(files);

    const bar1 = new progress.SingleBar({
        format: 'Examples [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}',
        etaBuffer: 1000,
    });
    bar1.start(filesList.length, 0);

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
            size: EXAMPLE_SIZE,
            ratio: false,
            originalSize: exif.imageSize,
            gray: true,
        };
        const result = {
            filename: file.filename,
            exampleFilename,
            examplePath: dest,
        };

        exampleJsobs.push(() => buildPreview(previewSrc, previewOptions)
            .then(() => {
                bar1.increment();
                return result;
            })
        );
    }

    const examples = await pLimit(exampleJsobs);
    bar1.stop();

    const pairFiles = [];

    for (let i = 0 ; i < examples.length ; i++) {
        for (let j = i + 1; j < examples.length; j++) {
            pairFiles.push([examples[i], examples[j]]);
        }
    }

    const bar2 = new progress.SingleBar({
        format: 'Compare [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}',
        etaBuffer: 1000,
    });
    bar2.start(pairFiles.length, 0);

    const pairs = await pLimit(pairFiles
        .map(([first, second]) => (() => compareFiles(first, second).then(data => {
            bar2.increment();
            return data;
        })))
    );

    bar2.stop();

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
