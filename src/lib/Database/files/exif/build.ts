import { buildDate } from './exifdate/index.js';
import { exiftoolGetter } from '../../../../utils/exiftool.js';
import { buildGps } from '../../../../utils/gps.js';
import { buildGroupId } from './fields/group.js';
import { getMime } from './fields/mime.js';
import { buildImageSize } from './fields/size.js';
import { buildType } from './fields/type.js';

export async function buildExif(filepath: string) {
    const data = (await exiftoolGetter(filepath))[0];

    const mime = getMime(data);
    const size = buildImageSize(data);

    return {
        _raw: data,
        timestamp: buildDate(data, process.env.DEFAULT_PHOTO_OFFSET)?.getTime(),
        gps: buildGps(data),
        type: buildType(mime),
        groupId: buildGroupId(data),
        imageSize: size,
        resolution: size[0] * size[1],
        mime,
        compressor: data.CompressorName,
    };
}
