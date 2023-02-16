export function seriesPromise<T>(list: T[], fn: (item: T) => any) {
    return list.reduce((p, item: T) => {
        return p.then(() => fn(item));
     }, Promise.resolve());
};
