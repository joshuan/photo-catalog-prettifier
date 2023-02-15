export function getDateFromFilename(item) {
    const test = /^(\d{4})(\d{2})(\d{2})\_(\d{2})(\d{2})(\d{2})\./.exec(item.FileName);

    if (test !== null) {
        return new Date(test[1], test[2], test[3], test[4], test[5], test[6]);
    }

    return undefined;
}
