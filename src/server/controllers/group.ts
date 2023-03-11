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
        select: Boolean(req.query.select),
    }));
}

export async function groupOperationController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const operation = req.body.operation;
    const files = ((req.body?.files || []) as string[]).filter(Boolean).map(file => database.getFile(file));

    if (operation === 'delete') {
        const trashFolder = await getFolder(`trash/${database.name}`);

        for (const file of files) {
            fs.renameSync(
                joinPath(file.filepath),
                resolvePath(trashFolder, file.filename),
            );
            console.log(`- remove ${file.filepath}`);
        }

        const newDatabase = await Database.init(database.path, { useFilesCache: false, useItemsCache: false });

        req.app.set('database', newDatabase);

        res.redirect('/groups');
    } else if (operation === 'ungroup') {
        throw new Error('TODO: Ungrouped!');
    } else {
        throw new Error('Broken operation!');
    }
}
