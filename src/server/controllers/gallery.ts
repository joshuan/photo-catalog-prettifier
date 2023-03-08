import { NextFunction, Request, Response } from 'express';
import { Database } from '../../lib/Database.js';
import { TDataItem } from '../../utils/items.js';
import { getTemplate } from '../../utils/template.js';

interface IEventGallery {
    times: [number, number];
    items: TDataItem[];
}

const HOUR = 60 * 60;

function buildGroupEvents(hourInterval: number) {
    const interval = (hourInterval || 6) * HOUR;
    return async function groupEvents(items: TDataItem[]): Promise<IEventGallery[]> {
        const withoutTimes: TDataItem[] = [];
        const timeSlots = [];
        let lastElement = -1;
        let lastTime = 0;

        for (const item of items) {
            if (!item.date) {
                withoutTimes.push(item);
            } else if (item.date > lastTime + interval) {
                lastElement++;
                lastTime = item.date;
                if (!timeSlots[lastElement]) {
                    timeSlots[lastElement] = [] as TDataItem[];
                }
                timeSlots[lastElement].push(item);
            } else {
                lastTime = item.date;
                timeSlots[lastElement].push(item);
            }
        }

        const results: IEventGallery[] = [];

        for (const timeItems of timeSlots) {
            const times = timeItems.map(item => item.date) as number[];

            results.push({
                times: [ Math.min(...times), Math.max(...times) ],
                items: timeItems,
            });
        }

        if (withoutTimes.length > 0) {
            results.push({
                times: [ Date.now(), Date.now() ],
                items: withoutTimes,
            });
        }

        return results;
    }
}

function filterItemsByQuery(query: Request['query']) {
    const min = parseInt(query.min as string || '0', 10);
    const max = parseInt(query.max as string || '0', 10);
    return function filterItems<T extends { date?: number; }>(items: T[]): T[] {
        if (!min && !max) { return items; }
        return items.filter(({ date }) => {
            if (!date) { return false; }
            if (min && date < min) { return false; }
            if (max && date > max) { return false; }
            return true;
        });
    }
}

export function galleryController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems()
            .then(filterItemsByQuery(req.query))
            .then(buildGroupEvents(parseInt(req.query.interval as string || '0', 10))),
        getTemplate('gallery'),
    ])
        .then(([events, template]) => {
            res.send(template({ events }));
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
