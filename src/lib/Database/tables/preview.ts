import { getFolder } from '../../../utils/data.js';
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

const cache = new Cache<IMediaPreviewsList>('previews');

interface IMediaPreviewsOptions {
    useCache?: boolean;
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
    const { useCache = true } = options;

    if (useCache && await cache.has(name)) {
        return await cache.get(name);
    }

    const folder = await getFolder(`previews/${name}`);
    const previewsJob = [];

    for (const file of Object.values(files)) {
        const exif = exifs[file.filename];

        if (!exif) {
            throw new Error('Undefined exif', { cause: file.filename });
        }

        const dest = joinPath(folder, file.previewFilename);

        previewsJob.push(() => buildPreview({
            type: exif.type,
            src: file.filepath,
            dest,
        }, {
            overwrite: true,
        }).then(() => ({
            filename: file.filename,
            previewPath: dest,
            previewUrl: `/previews/${name}/${file.previewFilename}`,
        })));
    }

    const data = await pLimit(previewsJob);

    const result = data.reduce((acc, item) => {
        acc[item.filename] = {
            url: item.previewUrl,
            path: item.previewPath,
        };

        return acc;
    }, {} as IMediaPreviewsList);

    await cache.set(name, result);

    return result;
}
