export function seriesPromise(list, fn) {
    return list.reduce((p, item) => {
        return p.then(() => fn(item));
     }, Promise.resolve());
};
