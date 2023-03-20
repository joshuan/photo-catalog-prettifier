import { IGps } from '../../../utils/gps.js';
import { IType } from '../../../utils/type.js';

export interface IGroup {
    id: string;
    preview: string;
    type: IType;
    live: false | { image: string; video: string; };
    timestamp?: number;
    files: string[];
    gps: IGps;
}
