import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { getOriginalSourceFilename } from './filename.js';

export interface IGroupFile {
    file: { originalName: string; };
    exif: { groupId: string; };
    hash?: string;
}

function getFileIndex(filename: string): string {
    const originalFilename = getOriginalSourceFilename(filename);

    return originalFilename.startsWith('IMG_') ?
        originalFilename.substring(0, 8) :
        originalFilename;
}

function mergeGroups<T>(groups1: Record<string, T[]>, groups2: Record<string, T[]>, key: keyof T) {
    for (const compareHash in groups2) {
        const groups = _.uniq(groups2[compareHash].map(file => file[key]));

        if (groups.length > 0) {
            const mainGroup = groups[0] as string;

            for (let i = 1 ; i < groups.length ; i++ ) {
                const group1Id = groups[i] as string;

                groups1[mainGroup] = groups1[mainGroup].concat(groups1[group1Id]);

                delete groups1[group1Id];
            }
        }
    }
}

export function groupFiles<T extends IGroupFile>(list: T[]): Record<string, T[]> {
    const data = list.map((file) => ({
        src: file,
        groupId: file.exif.groupId,
        compareHash: file.hash || uuid(),
        fileIndex: getFileIndex(file.file.originalName),
    }));

    const groupByGroupId = _.groupBy(data, 'groupId');
    const groupByCompareHash = _.groupBy(data, 'compareHash');
    const groupByFileIndex = _.groupBy(data, 'fileIndex');

    mergeGroups(groupByGroupId, groupByCompareHash, 'groupId');
    mergeGroups(groupByGroupId, groupByFileIndex, 'fileIndex');

    const result: Record<string, T[]> = {};

    for (const groupId in groupByGroupId) {
        result[groupId] = groupByGroupId[groupId].map(item => item.src);
    }

    return result;
}

