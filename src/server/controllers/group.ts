import { NextFunction, Request, Response } from 'express';
import { readFile } from '../../lib/fs.js';
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
