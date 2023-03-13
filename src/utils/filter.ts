export function filterTrue<T>(list: (T | void | boolean | undefined)[]): T[] {
    return list.filter(Boolean) as T[];
}
