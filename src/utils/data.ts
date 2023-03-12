import { isFileExist, mkdir } from './fs.js';
import { resolveByRoot, resolvePath } from './path.js';

export async function getDataFolder(folderName: string) {
    const folderPath = resolveByRoot('data', folderName);

    if (!await isFileExist(folderPath)) {
        await mkdir(folderPath);
    }

    return folderPath;
}

export async function getFolder(...path: string[]) {
    const folderPath = resolvePath(...path);

    if (!await isFileExist(folderPath)) {
        await mkdir(folderPath);
    }

    return folderPath;
}
