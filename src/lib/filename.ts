import { getExt } from './path.js';

export function getOriginalSourceFilename(src: string): string {
    const ext = getExt(src);
    const RE = new RegExp('^\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2}\\s{1}(.*)' + ext + '$');
    const found = RE.exec(src);

    if (found !== null) {
        return found[1] + ext;
    }

    return src;
}
