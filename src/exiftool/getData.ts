import { exec } from './exec.js';

interface IBaseData {
    SourceFile: string;
}

function parseAndValidateData<T extends IBaseData>(item: Partial<T>, fields: string[]): T {
    const data = {
        SourceFile: item.SourceFile,
    };

    for (const key of fields) {
        if (!item[key]) {
            throw new Error(`Undefined field ${key}!`, { cause: item });
        }

        data[key] = item[key];
    }

    return data;
}

module.exports = function getData<T>(path: string, fields: string[]): Promise<IData[]> {
    return exec<IData[]>(path, fields)
        .then(({ data }) => data.map(parseAndValidateData));
}
