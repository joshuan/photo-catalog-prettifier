export function seriesPromise<T, U = void>(list: T[], fn: (item: T) => Promise<U>): Promise<U[]> {
    const results: U[] = [];

    return list.reduce((next, item: T) => next.then(
        () => fn(item).then((res) => { results.push(res) })
    ), Promise.resolve()).then(() => results);
}
