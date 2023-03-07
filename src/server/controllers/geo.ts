import { NextFunction, Request, Response } from 'express';
import { Database } from '../services/database.js';
import { getTemplate } from '../utils/template.js';

export function geoController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems(),
        getTemplate('geo'),
    ])
        .then(([items, template]) => {
            res.send(template({
                items: items.filter((i) => Boolean(i.gps))
            }));
        })
        .catch((err) => next(err));
}
