import path from 'node:path';
import fs from 'node:fs';

export async function rename(ROOT: string, src: string, dest: string): Promise<void> {
    fs.renameSync(
        path.join(ROOT, src),
        path.join(ROOT, dest),
    );
}

export async function deleteFile(ROOT: string, file: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(ROOT, file), (err) => {
            err ? reject(err) : resolve();
        });
    });
}
