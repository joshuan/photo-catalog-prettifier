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

export function timelineController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    Promise.all([
        database.getItems(),
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
