import { getOriginalSourceFilename } from '../../lib/filename.js';

interface IGroupFile {
    FileName: string;
    groupId: string | null;
}

export function groupFiles<T extends IGroupFile>(files: T[]): Record<string, T[]> {
    const data: Record<string, T[]> = {};
    const prefixes = new Map();

    for (const file of files) {
        const originalFileName = getOriginalSourceFilename(file.FileName);
        const isIMG = originalFileName.startsWith('IMG_');
        const IMG_PREFIX = originalFileName.substring(0, 8);
        const groupId = file.groupId;

        const id = (isIMG && prefixes.has(IMG_PREFIX)) ?
            prefixes.get(IMG_PREFIX) :
            (groupId ?
                (prefixes.has(groupId) ? prefixes.get(groupId) : groupId ) :
                (isIMG ? IMG_PREFIX : originalFileName));

        if (isIMG) {
            prefixes.set(IMG_PREFIX, id);
        }
        if (groupId) {
            prefixes.set(groupId, id);
        }

        if (!data[id]) {
            data[id] = [];
        }

        data[id].push(file);
    }

    return data;
}
