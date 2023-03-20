import _ from 'lodash';
import { getOriginalSourceFilename } from '../lib/Database/files/fileinfo/fields/originalName.js';

export interface IGroupFile {
    file: {
        filename: string;
        fileinfo: { originalName: string; }
        exif: { groupId: string; };
    };
    hash?: string;
}

const INDEX_RE = [
    /^IMG_(\d{4})/,
    /^IMGP(\d{4})/,
    /^SAM_(\d{4})/,
];

function getFileIndex(filename: string): string {
    const originalFilename = getOriginalSourceFilename(filename);

    for (const RE of INDEX_RE) {
        const test = RE.exec(originalFilename);

        if (test !== null) {
            return test[0];
        }
    }

    return originalFilename;
}

interface IExtendedFile<T> {
    src: T;
    id: string;
    groupId: string;
    compareHash?: string;
    fileIndex: string;
}

export function groupFiles<T extends IGroupFile>(list: T[]): T[][] {
    const data = list.map<IExtendedFile<T>>((item) => ({
        src: item,
        id: item.file.filename,
        groupId: item.file.exif.groupId,
        compareHash: item.hash,
        fileIndex: getFileIndex(item.file.fileinfo.originalName),
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
                    throw new Error('Can not found group!', { cause: item });
                } else {
                    groups[index] = (groups[index] || []).concat([ item[ID_FIELD] ]);
                }
            }
        }
    }

    const result: T[][] = [];

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

        result.push(items);
    }

    return result;
}
