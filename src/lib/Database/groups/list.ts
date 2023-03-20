import _ from 'lodash';
// @ts-ignore
import pHash from 'phash-imagemagick';
import { debugUtil } from '../../../utils/debug.js';
import { IFile } from '../files/index.js';
import { getDistance } from './getDistance.js';
import { IGroup } from './interfaces.js';

const debug = debugUtil('compare');
const threshold = 0.1;

function compare(files: IFile[]) {
    const dict: Record<string, string[]> = {};

    for (let i = 0 ; i < files.length ; i++) {
        for (let j = i + 1; j < files.length; j++) {
            const filename1 = files[i].filename;
            const filename2 = files[j].filename;
            const distance = getDistance(files[i].hash, files[j].hash);
            const equal = distance < threshold;

            if (equal) {
                if (!dict[filename1]) {
                    dict[filename1] = [];
                }

                dict[filename1].push(filename2);

                if (!dict[filename2]) {
                    dict[filename2] = [];
                }

                dict[filename2].push(filename1);
            }
        }
    }

    for (let i in dict) {
        dict[i] = _.uniq(dict[i]);
    }

    return dict;
}

export async function buildGroups(files: IFile[]): Promise<IGroup[]> {
    debug('start compare');
    const dict = compare(files);
    debug('end compare');

    return [];
}
