import { isFileExist, mkdir } from './fs.js';
import { resolveByRoot } from './path.js';

export async function getFolder(folderName: string) {
    const folderPath = resolveByRoot('data', folderName);

    if (!await isFileExist(folderPath)) {
        await mkdir(folderPath);
    }

    return folderPath;
}
