import ejs from 'ejs';
import { readFile } from '../../lib/fs.js';

export async function getTemplate(name: string) {
    const str = await readFile(`${process.cwd()}/src/server/views/${name}.html`);

    return ejs.compile(str, {});
}