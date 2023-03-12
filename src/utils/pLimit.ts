import progress from 'cli-progress';
import os from 'os';
import promiseLimitLibrary from 'p-limit';

interface IPLimitOptions {
    bar?: string;
    limit?: number;
    batch?: number;
}

export async function pLimit<T>(
    list: (() => Promise<T>)[],
    options: IPLimitOptions = {},
): Promise<T[]> {
    const { bar = false, limit = os.cpus().length, batch = 5000 } = options;

    const promiseLimit = promiseLimitLibrary(limit);

    const progressBar = bar && new progress.SingleBar({
        format: `${bar} [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Duration: {duration_formatted}`,
        etaBuffer: 1000,
    });

    if (progressBar) {
        progressBar.start(list.length, 0);
    }

    let results: T[] = [];

    for (let i = 0 ; i < list.length ; i = i + batch) {
        const intermediateResults = await Promise.all(
            list
                .slice(i, i + batch)
                .map(fn => promiseLimit(() => fn().then((res) => {
                    if (progressBar) {
                        progressBar.increment();
                    }

                    return res;
                }))),
        );

        results = results.concat(intermediateResults);
    }

    if (progressBar) {
        progressBar.stop();
    }

    return results;
}
