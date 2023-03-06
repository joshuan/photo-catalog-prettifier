import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { readFile } from '../../lib/fs.js';
import { Database } from '../services/database.js';
import ejs from 'ejs';

async function getTemplate() {
    const str = await readFile(`${process.cwd()}/src/server/views/geo.html`);

    return ejs.compile(str, {});
}

// function mergeGroups(list: TDatabaseItem[]): TDatabaseItem[] {
//     const listWithGroups = list.filter((item) => Boolean(item.groupId));
//     const listWithoutGroups = list.filter((item) => !Boolean(item.groupId));
//
//     const groups: Record<string, TDatabaseItem[]> = _.groupBy(listWithGroups, 'groupId');
//
//     for (const groupId in groups) {
//         const images = groups[groupId].filter(item => item.type === 'image');
//
//         if (images.length === 0) {
//             // console.log(groups[groupId]);
//             // throw new Error('Group without images', { cause: groups[groupId] });
//             listWithoutGroups.push(...groups[groupId]);
//             continue;
//         }
//
//         images.sort((a, b) => a.size - b.size);
//
//         listWithoutGroups.push(images[0]);
//     }
//
//     listWithoutGroups.sort((a, b) => (a.date || 0) - (b.date || 0));
//
//     return listWithoutGroups;
// }

// @ts-ignore
let cache = [];

export function geoController(req: Request, res: Response, next: NextFunction) {
    const database = req.app.get('database') as Database;

    if (cache.length === 0) {
        cache = database.getValues().filter((item) => item.gps);
        // cache = mergeGroups(cache);
    }

    getTemplate()
        .then((template) => {
            res.send(template({
                // @ts-ignore
                list: cache,
            }));
        })
        .catch((err) => next(err));
}
