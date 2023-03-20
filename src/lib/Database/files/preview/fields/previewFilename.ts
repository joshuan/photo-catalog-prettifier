import { getBasename, getExt } from '../../../../../utils/path.js';

export function buildPreviewFilename(filename: string): string {
    const originalExt = getExt(filename);
    const basename = getBasename(filename, originalExt);

    return basename + originalExt.replace(/\./g, '_') + '_preview.png';
}
