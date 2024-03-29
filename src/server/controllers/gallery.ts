import { NextFunction, Request, Response } from 'express';
import { Database } from '../../lib/Database/index.js';
import { TCatalogGroup } from '../../lib/Database/tables/group.js';
import { getTemplate } from '../../utils/template.js';
import { buildFilterItemsByQuery } from '../utils/filter.js';

interface IEventGallery {
    times: [number, number];
    items: TCatalogGroup[];
}

const HOUR = 60 * 60;

async function groupEvents(items: TCatalogGroup[], hourInterval: number): Promise<IEventGallery[]> {
    const interval = (hourInterval || 6) * HOUR;
    const withoutTimes: TCatalogGroup[] = [];
    const timeSlots = [];
    let lastElement = -1;
    let lastTime = 0;

    for (const item of items) {
        if (!item.timestamp) {
            withoutTimes.push(item);
        } else if (item.timestamp > lastTime + interval) {
            lastElement++;
            lastTime = item.timestamp;
            if (!timeSlots[lastElement]) {
                timeSlots[lastElement] = [] as TCatalogGroup[];
            }
            timeSlots[lastElement].push(item);
        } else {
            lastTime = item.timestamp;
            timeSlots[lastElement].push(item);
        }
    }

    const results: IEventGallery[] = [];

    for (const timeItems of timeSlots) {
        const times = timeItems.map(item => item.timestamp) as number[];

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

export async function galleryController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const data = database.getData();
    const items = database.getItems(buildFilterItemsByQuery(req.query));
    const events = await groupEvents(items, parseInt(req.query.interval as string || '0', 10));
    const template = await getTemplate('gallery');

    res.send(template({
        events,
        data,
    }));
}

export async function galleryItemController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const itemId = req.params.id;
    const data = database.getData();

    const template = await getTemplate('gallery-item')

    const item = data.groups.find(group => group.id === itemId);

    if (!item) {
        throw new Error('Not found item', { cause: itemId });
    }

    res.send(template({
        item,
        list: item.files.map(file => data.files[file]),
    }));
}
