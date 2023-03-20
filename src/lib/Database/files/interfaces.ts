import { IExif } from './exif/index.js';
import { IFileinfo } from './fileinfo/index.js';
import { IHash } from './hash/index.js';
import { IPreview } from './preview/index.js';

export interface IFile {
    filename: string;
    filepath: string;
    fileinfo: IFileinfo;
    exif: IExif;
    preview: IPreview;
    hash: IHash;
}
