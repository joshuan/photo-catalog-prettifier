const GPS_RE = /^(\d+)\sdeg\s(\d+)\'\s([\d\.]+)\"\s(\w+)$/;

// "25 deg 19' 47.38\" N"
function parseGeoPoint(gps: string): string {
    const found = GPS_RE.exec(gps);

    if (found === null) {
        throw new Error('GPS is broken string', { cause: gps });
    }

    const degrees = parseFloat(found[1]);
    const minutes = parseFloat(found[2]);
    const seconds = parseFloat(found[3]);
    const isPositive: boolean = ['N', 'E'].includes(found[4]);

    return ((degrees + minutes/60 + seconds/3600) * (isPositive ? 1 : -1)).toFixed(3);
}

export function buildGps(item: { GPSLatitude?: string; GPSLongitude?: string; }) {
    if (item.GPSLatitude && item.GPSLongitude) {
        return {
            lat: parseGeoPoint(item.GPSLatitude),
            lon: parseGeoPoint(item.GPSLongitude),
        };
    }

    return undefined;
}
