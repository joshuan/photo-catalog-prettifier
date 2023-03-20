import fs from 'node:fs';
import { writeJson } from './fs.js';
import { joinPath, resolveByRoot } from './path.js';

const cacheFile = resolveByRoot(joinPath('data', 'compareCache.json'));
let lastCacheSize = 0;

function getCachedData() {
    try {
        const data = fs.readFileSync(cacheFile, { encoding: 'utf-8' });

        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

const cache = new Map<string, number>(Object.entries(getCachedData()));

setInterval(() => {
    if (cache.size > lastCacheSize) {
        writeJson(cacheFile, Object.fromEntries(cache.entries()));
    }
}, 5000);

export function onCompare(files: [string, string], compare: number): void {
    cache.set(`${files[0]}-${files[1]}`, compare);
}

export function getCompared(files: [string, string]): number | undefined {
    if (cache.has(`${files[0]}-${files[1]}`)) {
        return cache.get(`${files[0]}-${files[1]}`);
    }
    if (cache.has(`${files[1]}-${files[0]}`)) {
        return cache.get(`${files[1]}-${files[0]}`);
    }
    return undefined;
}
