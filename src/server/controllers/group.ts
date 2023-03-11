import { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import { getFolder } from '../../utils/data.js';
import { joinPath, resolvePath } from '../../utils/path.js';
import { Database } from '../../lib/Database/index.js';
import { getTemplate } from '../../utils/template.js';

export async function groupController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const data = database.getData();
    const template = await getTemplate('group');

    res.send(template({
        ...data,
    }));
}

export async function groupOperationController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const operation = req.body.operation;
    const files = ((req.body?.files || []) as string[]).map(file => database.getFile(file));

    if (operation === 'delete') {
        const trashFolder = await getFolder('trash');
        for (const file of files) {
            fs.renameSync(
                joinPath(file.filepath),
                resolvePath(trashFolder, file.filename),
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
