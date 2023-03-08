import { Argv } from 'yargs';
import _ from 'lodash';
import { Exiftool, IExifPartialData, IExifRequiredData, TAvailableFields } from '../../../lib/Exiftool.js';

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

const rawFields: TAvailableFields[] = [
    'FileName',
    'MIMEType',
    'MediaGroupUUID',
    'ContentIdentifier',
];
const fields: TAvailableFields[] = [
    'FileName',
    'MIMEType',
];

type IRawData = IExifPartialData<typeof rawFields[number]>;

interface IData extends IExifRequiredData<typeof fields[number]> {
    groupUuid: string;
    type: 'video' | 'image';
}

async function getData(path: string): Promise<IData[]> {
    const tool = new Exiftool(path);
    const data = await tool.getPartialData(rawFields);

    return data
        .filter((item) => Boolean(item.MediaGroupUUID || item.ContentIdentifier))
        .map((item) => {
            const mimeType = Exiftool.validateField(item, 'MIMEType');

            return {
                ...Exiftool.validateData(item, fields),
                type: Exiftool.getType(mimeType),
                groupUuid: item.MediaGroupUUID || item.ContentIdentifier || '',
            };
        });
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
