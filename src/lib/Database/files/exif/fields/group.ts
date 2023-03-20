import { v4 as uuid } from 'uuid';

export function buildGroupId(exif: { MediaGroupUUID?: string; ContentIdentifier?: string }): string {
    return exif.MediaGroupUUID || exif.ContentIdentifier || uuid();
}
