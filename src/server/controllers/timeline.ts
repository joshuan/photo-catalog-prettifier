import { NextFunction, Request, Response } from 'express';
import { Database } from '../../lib/Database/index.js';
import { TCatalogGroup } from '../../lib/Database/tables/group.js';
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

    date.setHours(date.getHours() + 1);
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

function filterItems(items: TCatalogGroup[]): (TCatalogGroup & { timestamp: number })[] {
    return items
        .filter(item => Boolean(item.timestamp)) as (TCatalogGroup & { timestamp: number })[];
}

export async function timelineController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    const data = database.getData();
    const items = filterItems(database.getItems(buildFilterItemsByQuery(req.query)));
    const maxTime = calcMaxTime(items);
    const minTime = calcMinTime(items);
    const template = await getTemplate('timeline');

    res.send(template({ items, minTime, maxTime, data }));
}
