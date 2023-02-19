import path from 'node:path';
import fs from 'node:fs';

export async function rename(ROOT: string, src: string, dest: string): Promise<void> {
    fs.renameSync(
        path.join(ROOT, src),
        path.join(ROOT, dest),
    );
}
