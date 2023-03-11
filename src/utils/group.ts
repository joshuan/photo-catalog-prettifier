import _ from 'lodash';
import { getOriginalSourceFilename } from './filename.js';

export interface IGroupFile {
    file: { filename: string; originalName: string; };
    exif: { groupId: string; };
    hash?: string;
}

function getFileIndex(filename: string): string {
    const originalFilename = getOriginalSourceFilename(filename);

    return originalFilename.startsWith('IMG_') ?
        originalFilename.substring(0, 8) :
        originalFilename;
}

interface IExtendedFile<T> {
    src: T;
    id: string;
    groupId: string;
    compareHash?: string;
    fileIndex: string;
}

export function groupFiles<T extends IGroupFile>(list: T[]): Record<string, T[]> {
    const data = list.map<IExtendedFile<T>>((file) => ({
        src: file,
        id: file.file.filename,
        groupId: file.exif.groupId,
        compareHash: file.hash,
        fileIndex: getFileIndex(file.file.originalName),
    }));

    const ID_FIELD = 'id';
    const FIELDS: (keyof IExtendedFile<T>)[] = ['groupId', 'compareHash', 'fileIndex'];

    const map: Record<string, string[]> = {};

    for (const item of data) {
        const id = item[ID_FIELD];
        if (!map[id]) { map[id] = []; }
        for (const field of FIELDS) {
            if (item[field]) {
                map[id].push(`${field}-${item[field]}`);
            }
        }
    }

    const sortedMap = Object.values(map).map(i => i.sort()).sort((a, b) => {
        const a1 = a.join('-');
        const b1 = b.join('-');
        return a1 === b1 ? 0 : (a1 > b1 ? 1 : -1);
    });

    const relations = [];

    for (const item of sortedMap) {
        const index = relations.findIndex(relation => relation.some(rel => item.includes(rel)));
        if (index === -1) {
            relations.push(item);
        } else {
            relations[index].push(...item);
        }
    }

    const groups: string[][] = [];

    for (const item of data) {
        for (const field of FIELDS) {
            if (item[field]) {
                const index = relations.findIndex(relation => relation.includes(`${field}-${item[field]}`));

                if (index == -1) {
                    throw new Error('Can not found group!', { cause: { [field]: item[field] } });
                } else {
                    groups[index] = (groups[index] || []).concat([ item[ID_FIELD] ]);
                }
            }
        }
    }

    const result: Record<string, T[]> = {};

    for (const groupIndex in groups) {
        const group = groups[groupIndex];
        const ids = _.uniq(group);
        const items = ids.map(id => {
            const found = data.find(item => item[ID_FIELD] === id);
            if (!found) {
                throw new Error('Broken map group', { cause: id });
            }
            return found.src;
        });

        if (items.length === 0) {
            throw new Error('Broken group', { cause: group });
        }

        result[items[0].file.filename] = items;
    }

    return result;
}
