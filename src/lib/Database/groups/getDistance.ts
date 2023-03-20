import { IHash } from '../files/hash/index.js';

function toArray(x: string) {
    const found = x.match(/[\-0-9]{4}/g);

    if (!found) {
        throw new Error('Broken compare', { cause: x });
    }

    return found.map((x) => (parseInt(x, 10) / 100));
}

export function getDistance(file1: IHash, file2: IHash): number {
    const x = toArray(file1.pHash);
    const y = toArray(file2.pHash);
    let sse = 0;

    for (let i = 0; i < x.length; i++) {
        sse += Math.pow(x[i] - y[i], 2);
    }

    return sse;
}
