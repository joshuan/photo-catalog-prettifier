import { isFileExist, mkdir } from './fs.js';
import { resolveByRoot } from './path.js';

export async function getFolder(folderName: string, validateExist: boolean = true) {
    const folderPath = resolveByRoot('database', folderName);

    if (!await isFileExist(folderPath)) {
        await mkdir(folderPath);
    }

    return folderPath;
}
