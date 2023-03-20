import { getDataFolder } from '../../../../utils/data.js';
import { getBasename, joinPath } from '../../../../utils/path.js';
import { buildPreviewFile } from '../../../../utils/preview.js';
import { buildPreviewFilename } from './fields/previewFilename.js';
import { IPreview } from './interface.js';
import { IType } from '../../../../utils/type.js';

interface IPartialExif {
    type: IType;
    mime: string;
}

interface IOptions {
    overwritePreview: boolean;
}

export async function buildPreview(filepath: string, exif: IPartialExif, options: IOptions): Promise<IPreview> {
    const { type, mime } = exif;
    const folder = await getDataFolder('previews');
    const filename = getBasename(filepath);
    const previewFilename = buildPreviewFilename(filename);

    const dest = joinPath(folder, previewFilename);

    const previewSrc = {
        type,
        mime,
        src: filepath,
        dest,
    };
    const previewOptions = {
        overwrite: options.overwritePreview,
    };

    await buildPreviewFile(previewSrc, previewOptions);

    return {
        url: `/previews/${previewFilename}`,
        file: dest,
    };
}
