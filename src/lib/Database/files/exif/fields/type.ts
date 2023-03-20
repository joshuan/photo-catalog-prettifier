export function buildType(MIMEType: string): 'video' | 'image' {
    if (MIMEType.includes('image/')) { return 'image'; }
    if (MIMEType.includes('video/')) { return 'video'; }

    throw new Error(`Wrong mime type ${MIMEType}`);
}
