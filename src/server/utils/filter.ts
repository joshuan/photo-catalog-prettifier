import { Request } from 'express';

export function buildFilterItemsByQuery<T extends { timestamp?: number; }>(
    query: Request['query'],
): undefined | ((item: T) => boolean) {
    const min = parseInt(query.min as string || '0', 10);
    const max = parseInt(query.max as string || '0', 10);

    if (!min && !max) {
        return undefined
    }

    return function filterItems({ timestamp }): boolean {
        if (!timestamp) {
            return false;
        }

        if (min && timestamp < min) {
            return false;
        }

        if (max && timestamp > max) {
            return false;
        }

        return true;
    }
}
