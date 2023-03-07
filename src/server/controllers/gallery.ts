import { NextFunction, Request, Response } from 'express';
import { Database } from '../services/database.js';
import { getTemplate } from '../utils/template.js';

export function galleryController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems(),
        getTemplate('gallery'),
    ])
        .then(([items, template]) => {
            res.send(template({
                items: items.filter((i) => Boolean(i.gps))
            }));
        })
        .catch((err) => next(err));
}

export function galleryItemController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const itemId = req.params.id;

    Promise.all([
        database.getItems(),
        getTemplate('gallery-item'),
    ])
        .then(([items, template]) => {
            const item = items.find(i => i.id === itemId);

            if (!item) {
                throw new Error('Not found item', { cause: item });
            }

            res.send(template({
                item,
            }));
        })
        .catch((err) => next(err));
}
