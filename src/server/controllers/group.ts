import { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import { joinPath, resolveByRoot } from '../../utils/path.js';
import { Database } from '../../lib/Database/index.js';
import { getTemplate } from '../../utils/template.js';

export function groupController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const data = database.getData();

    getTemplate('group')
        .then(template => {
            res.send(template({
                data,
            }));
        })
        .catch((err) => next(err));
}

export function groupOperationController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const operation = req.body.operation;
    const files = ((req.body?.files || []) as string[]).map(file => database.getFile(file));

    if (operation === 'delete') {
        for (const file of files) {
            fs.renameSync(
                joinPath(file.filepath),
                resolveByRoot('database/trash', file.filename),
            );
            console.log(`- remove ${file.filepath}`);
        }
        Database.init(database.path)
            .then(newDatabase => {
                req.app.set('database', newDatabase);
                res.redirect('/groups');
            })
            .catch(err => next(err));
    } else if (operation === 'ungroup') {
        next(new Error('TODO: Ungrouped!'));
    } else {
        next(new Error('Broken operation!'));
    }
}
