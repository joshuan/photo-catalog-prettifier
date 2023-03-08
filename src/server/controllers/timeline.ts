import { NextFunction, Request, Response } from 'express';
import { Database } from '../services/database.js';
import { getTemplate } from '../utils/template.js';

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

function calcMaxTime(list: { date: number; }[]): number {
    return roundCeilTime(list.filter(item => item.date < 1559340000).reduce((acc, item) => item.date > acc ? item.date : acc, 0));
}

function calcMinTime(list: { date: number; }[]): number {
    return roundFloorTime(list.reduce((acc, item) => item.date < acc ? item.date : acc, Date.now()));
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

export function timelineController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems()
            .then(filterItemsByQuery(req.query)),
        getTemplate('timeline'),
    ])
        .then(([list, template]) => {
            const items = list.filter(item => Boolean(item.date)) as { date: number; }[];
            const maxTime = calcMaxTime(items);
            const minTime = calcMinTime(items);

            res.send(template({ items, minTime, maxTime }));
        })
        .catch((err) => next(err));
}
