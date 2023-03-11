import { NextFunction, Request, Response } from 'express';
import { Database } from '../../lib/Database/index.js';
import { getTemplate } from '../../utils/template.js';
import { buildFilterItemsByQuery } from '../utils/filter.js';

export async function geoController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const data = database.getData();
    const items = database.getItems(buildFilterItemsByQuery(req.query));
    const template = await getTemplate('geo');

    res.send(template({
        items: items.filter(i => Boolean(i.gps)),
        data,
    }));
}
