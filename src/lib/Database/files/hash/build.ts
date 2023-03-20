// @ts-ignore
import pHash from 'phash-imagemagick';
import { getDataFolder } from '../../../../utils/data.js';
import { getBasename, getExt, joinPath } from '../../../../utils/path.js';
import { buildPreviewFile } from '../../../../utils/preview.js';
import { IType } from '../../../../utils/type.js';
import type { IHash } from './interface.js';

function buildExampleFilename(originalFilename: string): string {
    const originalExt = getExt(originalFilename);
    const basename = getBasename(originalFilename, originalExt);

    return basename + originalExt.replace(/\./g, '_') + '_example.png';
}

interface IPartialExif {
    type: IType;
    mime: string;
    imageSize: [ number, number ];
}

interface IOptions {
    overwritePreview: boolean;
}

async function buildExample(filepath: string, exif: IPartialExif, options: IOptions): Promise<string> {
    const { type, mime, imageSize } = exif;
    const filename = getBasename(filepath);
    const folder = await getDataFolder('examples');
    const exampleFilename = buildExampleFilename(filename);
    const dest = joinPath(folder, exampleFilename);

    const previewSrc = { type, mime, src: filepath, dest };
    const previewOptions = {
        overwrite: options.overwritePreview,
        size: 8,
        ratio: false,
        originalSize: imageSize,
        gray: true,
    };

     await buildPreviewFile(previewSrc, previewOptions);

     return dest;
}

export async function buildHash(filepath: string, exif: IPartialExif, options: IOptions): Promise<IHash> {
    const example = await buildExample(filepath, exif, options);

    return new Promise((resolve, reject) => {
        pHash.get(example, function(err: unknown, data: IHash) {
            err ? reject(err) : resolve(data);
        });
    });
}
