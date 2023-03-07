import { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import { joinPath, resolveByRoot } from '../../lib/path.js';
import { Database } from '../services/database.js';
import { getTemplate } from '../utils/template.js';

export function groupController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems(),
        getTemplate('group'),
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
