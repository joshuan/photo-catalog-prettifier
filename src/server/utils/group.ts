import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { getOriginalSourceFilename } from '../../lib/filename.js';

export interface IGroupFile {
    FileName: string;
    groupId: string | null;
    compareHash?: string;
    fileIndex?: string;
}

function getFileIndex(filename: string): string {
    const originalFilename = getOriginalSourceFilename(filename);

    return  originalFilename.startsWith('IMG_') ?
        originalFilename.substring(0, 8) :
        originalFilename;
}

type MergableGroups = Record<string, IGroupFile[]>;

function mergeGroups(groups1: MergableGroups, groups2: MergableGroups, key: keyof IGroupFile) {
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

export function groupFiles<T extends IGroupFile>(files: T[]): Record<string, T[]> {
    const filesFullData = files.map((file) => ({
        ...file,
        groupId: file.groupId || uuid(),
        compareHash: file.compareHash || uuid(),
        fileIndex: getFileIndex(file.FileName),
    }));

    const groupByGroupId = _.groupBy(filesFullData, 'groupId');
    const groupByCompareHash = _.groupBy(filesFullData, 'compareHash');
    const groupByFileIndex = _.groupBy(filesFullData, 'fileIndex');

    mergeGroups(groupByGroupId, groupByCompareHash, 'groupId');
    // for (const compareHash in groupByCompareHash) {
    //     const groups = _.uniq(groupByCompareHash[compareHash].map(file => file.groupId));
    //
    //     if (groups.length > 0) {
    //         const mainGroup = groups[0];
    //         for (let i = 1 ; i < groups.length ; i++ ) {
    //             groupByGroupId[mainGroup] = groupByGroupId[mainGroup].concat(groupByGroupId[groups[i]]);
    //             delete groupByGroupId[groups[i]];
    //         }
    //     }
    // }

    mergeGroups(groupByGroupId, groupByFileIndex, 'fileIndex');
    // for (const fileIndex in groupByFileIndex) {
    //     const groups = _.uniq(groupByFileIndex[fileIndex].map(file => file.fileIndex));
    //
    //     if (groups.length > 0) {
    //         const mainGroup = groups[0];
    //         for (let i = 1 ; i < groups.length ; i++ ) {
    //             groupByGroupId[mainGroup] = groupByGroupId[mainGroup].concat(groupByGroupId[groups[i]]);
    //             delete groupByGroupId[groups[i]];
    //         }
    //     }
    // }

    return groupByGroupId;
}

