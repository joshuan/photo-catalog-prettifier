import { getFolder } from '../../../utils/folder.js';
import { joinPath, resolveByRoot } from '../../../utils/path.js';
import { buildPreview } from '../../../utils/preview.js';
import { pLimit } from '../../../utils/pLimit.js';

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

export async function buildPreviews<
    F extends IMediaThumbnailsFile,
    E extends IMediaThumbnailsExif,
>(
    files: Record<string, F>,
    exifs: Record<string, E>,
): Promise<IMediaPreviewsList> {
    const folder = await getFolder('previews');
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
            previewUrl: `/previews/${file.previewFilename}`,
        })));
    }

    const data = await pLimit(previewsJob);

    return data.reduce((acc, item) => {
        acc[item.filename] = {
            url: item.previewUrl,
            path: item.previewPath,
        };

        return acc;
    }, {} as IMediaPreviewsList);
}
