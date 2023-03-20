export function getMime(item: { MIMEType?: string }): string {
    if (!item.MIMEType) {
        throw new Error('MIMEType is required for select file type', { cause: item });
    }

    return item.MIMEType;
}
