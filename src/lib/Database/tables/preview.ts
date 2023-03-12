import progress from 'cli-progress';
import { getDataFolder } from '../../../utils/data.js';
import { debugUtil } from '../../../utils/debug.js';
import { joinPath } from '../../../utils/path.js';
import { buildPreview } from '../../../utils/preview.js';
import { pLimit } from '../../../utils/pLimit.js';
import { Cache } from '../../Cache.js';

export type IMediaPreviewsItem = {
    url: string;
    path: string;
};

export type IMediaPreviewsList = Record<string, IMediaPreviewsItem>;

interface IMediaThumbnailsFile {
    filepath: string;
    filename: string;
    directory: string;
    previewFilename: string;
}

interface IMediaThumbnailsExif {
    type: 'image' | 'video';
}

const debug = debugUtil('database:preview');

const cache = new Cache<IMediaPreviewsList>('previews');

interface IMediaPreviewsOptions {
    useCache?: boolean;
    regeneratePreviews?: boolean;
}

export async function buildPreviews<
    F extends IMediaThumbnailsFile,
    E extends IMediaThumbnailsExif,
>(
    name: string,
    { files, exifs }: {
        files: Record<string, F>,
        exifs: Record<string, E>,
    },
    options: IMediaPreviewsOptions = {},
): Promise<IMediaPreviewsList> {
    const { useCache = true, regeneratePreviews = false } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    debug('Start build previews');

    const folder = await getDataFolder(`previews/${name}`);
    const filesList = Object.values(files);
    const previewsJob = [];

    const bar = new progress.SingleBar({
        format: 'Previews [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}',
        etaBuffer: 1000,
    });
    bar.start(filesList.length, 0);

    for (const file of filesList) {
        const exif = exifs[file.filename];

        if (!exif) {
            throw new Error('Undefined exif', { cause: file.filename });
        }

        const dest = joinPath(folder, file.previewFilename);
        const previewSrc = {
            type: exif.type,
            src: file.filepath,
            dest,
        };
        const previewOptions = {
            overwrite: regeneratePreviews,
        };
        const result = {
            filename: file.filename,
            previewPath: dest,
            previewUrl: `/previews/${name}/${file.previewFilename}`,
        };

        previewsJob.push(() => buildPreview(previewSrc, previewOptions).then(() => {
            bar.increment();
            return result;
        }));
    }

    const data = await pLimit(previewsJob);

    bar.stop();

    const result = data.reduce((acc, item) => {
        acc[item.filename] = {
            url: item.previewUrl,
            path: item.previewPath,
        };

        return acc;
    }, {} as IMediaPreviewsList);

    await cache.set(name, result);

    debug('Finish build previews');

    return result;
}
