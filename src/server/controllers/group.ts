import { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import { readFile } from '../../lib/fs.js';
import { joinPath, resolveByRoot } from '../../lib/path.js';
import { Database } from '../services/database.js';
import ejs from 'ejs';

async function getTemplate() {
    const str = await readFile(`${process.cwd()}/src/server/views/group.html`);

    return ejs.compile(str, {});
}

export function groupController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems(),
        getTemplate(),
    ])
        .then(([items, template]) => {
            res.send(template({ items }));
        })
        .catch((err) => next(err));
}

export function deleteGroupController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const files = ((req.body?.file || []) as string[]).map(file => database.getFile(file));

    for (const file of files) {
        fs.renameSync(
            joinPath(file.SourceFile),
            resolveByRoot('database/trash', file.FileName),
        );
    }

    res.send(files.map(file => file.SourceFile));
}
