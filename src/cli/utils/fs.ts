import fs from 'node:fs';
import { joinPath } from './path.js';

export async function rename(ROOT: string, src: string, dest: string): Promise<void> {
    fs.renameSync(
        joinPath(ROOT, src),
        joinPath(ROOT, dest),
    );
}

export async function deleteFile(ROOT: string, file: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(joinPath(ROOT, file), (err) => {
            err ? reject(err) : resolve();
        });
    });
}
