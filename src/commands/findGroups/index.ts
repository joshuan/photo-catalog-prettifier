import path from 'node:path';
import { Argv } from 'yargs';
import _ from 'lodash';
import { exec } from '../../exiftool/index.js';
import { rename } from '../../utils/fs.js';

export const command = 'findGroups <path>';
export const description = 'Find group of photos';

interface IFindGroupsArguments {
    path: string;
    dryRun: boolean;
}

export function builder(argv: Argv): Argv<IFindGroupsArguments> {
    return argv
        .positional('path', {
            desc: 'Path to folder with photos',
            type: 'string',
            demandOption: 'Folder is required parameter',
        })
        .option('dryRun', {
            type: 'boolean',
            default: false,
        })
    ;
}

const FIELDS = [
    'FileName',
    'MIMEType',
    'ImageSize',
    'MediaGroupUUID',
    'ContentIdentifier',
] as const;

interface IRawData extends Record<typeof FIELDS[number], string | undefined> {
    SourceFile: string;
    // MediaGroupUUID?: string;
    // ContentIdentifier?: string;
}

interface IData extends Record<typeof FIELDS[number], string> {
    SourceFile: string;
    groupUuid: string;
    type: 'video' | 'image';
}

function filterWithoutGroup(item: IRawData): boolean {
    return Boolean(item.MediaGroupUUID || item.ContentIdentifier);
}

function getType(MIMEType: string): 'video' | 'image' {
    if (MIMEType.includes('image/')) { return 'image'; }
    if (MIMEType.includes('video/')) { return 'video'; }

    throw new Error(`Wrong mime type ${MIMEType}`);
}

function getValue(item: IRawData, key: keyof IRawData): string {
    if (!item[key]) {
        throw new Error(`Undefined ${key}!`, { cause: item });
    }

    return item[key];
}

function parseAndValidateData(item: IRawData): IData {
    const data = {
        SourceFile: item.SourceFile,
    };
    // if (!item.SourceFile) { throw new Error('Undefined SourceFile!', { cause: item }); }
    // if (!item.FileName) { throw new Error('Undefined FileName!', { cause: item }); }
    // if (!item.MIMEType) { throw new Error('Undefined MIMEType!', { cause: item }); }
    // if (!item.MediaGroupUUID && !item.ContentIdentifier) {
    //     throw new Error('Undefined MediaGroupUUID/ContentIdentifier !', { cause: item });
    // }
    //
    // return {
    //     SourceFile: getValue(item, 'SourceFile'),
    //     FileName: item.FileName,
    //     groupUuid: item.MediaGroupUUID || item.ContentIdentifier || '',
    //     MIMEType: item.MIMEType,
    //     ImageSize: item.ImageSize,
    //     type: getType(item.MIMEType),
    // };

    return data;
}

function getData(path: string): Promise<IData[]> {
    return exec<IData[]>(path, [...FIELDS, '-MediaGroupUUID', '-ContentIdentifier'])
        .then(({ data }) => data.filter(filterWithoutGroup).map(parseAndValidateData));
}

// Группируем live photos из 2 файлов, по общему MediaGroupUUID - они должны иметь одинаковое имя.
export async function handler(argv: IFindGroupsArguments) {
    const data = await getData(argv.path);

    const list = _.groupBy(data, 'groupUuid');

    for (const items of Object.values(list)) {
        if (items.length > 1) {
            const files = _.groupBy(items, 'type');

            if (files.image?.length > 1 || files.video?.length > 1) {
                console.log('-----------------');
                console.log(files);
            }
        }
    }

    console.log('✅');
}
