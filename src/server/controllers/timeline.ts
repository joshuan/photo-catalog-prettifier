import { NextFunction, Request, Response } from 'express';
import { Database } from '../../lib/Database/index.js';
import { TCatalogItem } from '../../lib/Database/tables/item.js';
import { getTemplate } from '../../utils/template.js';
import { buildFilterItemsByQuery } from '../utils/filter.js';

function roundFloorTime(time: number) {
    const date = new Date(time * 1000);

    date.setMinutes(0);
    date.setSeconds(0);

    return date.getTime();
}

function roundCeilTime(time: number) {
    const date = new Date(time * 1000);

    date.setHours(date.getHours() + 3);
    date.setMinutes(0);
    date.setSeconds(0);

    return date.getTime();
}

function calcMaxTime(list: { timestamp: number; }[]): number {
    return roundCeilTime(list.filter(item => item.timestamp < 1559340000).reduce((acc, item) => item.timestamp > acc ? item.timestamp : acc, 0));
}

function calcMinTime(list: { timestamp: number; }[]): number {
    return roundFloorTime(list.reduce((acc, item) => item.timestamp < acc ? item.timestamp : acc, Date.now()));
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

function filterItems(items: TCatalogItem[]): (TCatalogItem & { timestamp: number })[] {
    return items
        .filter(item => Boolean(item.timestamp)) as (TCatalogItem & { timestamp: number })[];
}

export function timelineController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const data = database.getData();
    const items = filterItems(database.getItems(buildFilterItemsByQuery(req.query)));

    getTemplate('timeline')
        .then(template => {
            const maxTime = calcMaxTime(items);
            const minTime = calcMinTime(items);

            res.send(template({ items, minTime, maxTime, data }));
        })
        .catch((err) => next(err));
}
