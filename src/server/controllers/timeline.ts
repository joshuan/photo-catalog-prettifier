import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { readFile } from '../../lib/fs.js';
import { getBasename } from '../../lib/path.js';
import { Database } from '../services/database.js';
import ejs from 'ejs';

async function getTemplate() {
    const str = await readFile(`${process.cwd()}/src/server/views/timeline.html`);

    return ejs.compile(str, {});
}

let cache = {
    list: null,
    minTime: 0,
    maxTime: 0,
};

function roundFloorTime(time: number) {
    const date = new Date(time);

    date.setMinutes(0);
    date.setSeconds(0);

    return date.getTime();
}

function roundCeilTime(time: number) {
    const date = new Date(time);

    date.setHours(date.getHours() + 3);
    date.setMinutes(0);
    date.setSeconds(0);

    return date.getTime();
}

export function timelineController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;
    // @ts-ignore
    cache.list = cache.list || Object.values(database.data)
        .map(item => ({
            ...item,
            date: item.date ? (item.date * 1000) : 1556661600000,
        }));
    // @ts-ignore
    cache.minTime = cache.minTime || roundFloorTime((cache.list || []).reduce((acc, item) => item.date < acc ? item.date : acc, Date.now()));
    // @ts-ignore
    cache.maxTime = cache.maxTime || roundCeilTime((cache.list || []).reduce((acc, item) => item.date > acc ? item.date : acc, 0));

    getTemplate()
        .then((template) => {
            res.send(template(cache));
        })
        .catch((err) => next(err));
}
