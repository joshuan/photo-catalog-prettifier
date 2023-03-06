import { write } from './fs.js';
import { joinPath, resolveByRoot } from './path.js';

const DATABASE = resolveByRoot('database');

export function saveData(name: string, data: any) {
    const file = joinPath(DATABASE, `${name}.json`);
    const body = JSON.stringify(data, null, 4);

    return write(file, body);
}

