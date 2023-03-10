import os from 'os';
import promiseLimit from 'p-limit';

const limit = promiseLimit(os.cpus().length);

export async function pLimit<T>(list: (() => Promise<T>)[]): Promise<T[]> {
    return await Promise.all(list.map(fn => limit(fn)));
}
