import { IExifPartialData } from '../../../../utils/exiftool.js';
import { IGps } from '../../../../utils/gps.js';
import { IType } from '../../../../utils/type.js';

export interface IExif {
    _raw: IExifPartialData,
    timestamp?: number,
    gps?: IGps;
    type: IType;
    groupId: string;
    imageSize: [number, number];
    resolution: number;
    mime: string;
    compressor?: string;
}
