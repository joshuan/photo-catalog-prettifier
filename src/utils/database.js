import fs from 'node:fs';
import path from 'node:path';
import { resolve } from './path.js';

const DATABASE = resolve('database');

export function saveData(name, data) {
    const file = path.join(DATABASE, `${name}.json`);
    const body = JSON.stringify(data, null, 4);

    return fs.writeFileSync(file, body, { encoding: 'utf-8' });
}

