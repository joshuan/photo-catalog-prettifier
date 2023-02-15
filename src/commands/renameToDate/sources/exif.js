function parseDate(src) {
    try {
        let [ datetime, zone = '00:00' ] = src.split('+'); 
        let [ date, time ] = datetime.split(' ');
        let [ year = 0, month = 0, day = 0 ] = date.split(':');
        let [ hour = 0, min = 0, sec = 0 ] = time.split(':');

        const dateString = `${year}-${month}-${day}T${hour}:${min}:${sec}+${zone.replace(':', '')}`;

        return new Date(dateString);
    } catch (err) {
        throw new Error('Unknown date format', { cause: {
            src,
            item,
            err,
            datetime, zone,
            date, time,
            year, month, day,
            hour, min, sec,
            dateString,
        } });
    }
}

export function getDateFromExif(item) {
    if (!item.DateTimeOriginal) {
        return undefined;
    }

    return parseDate(item.DateTimeOriginal);
}
