export interface IExifData {
    FileName: string;
    ModifyDate?: string;            // IFD0	    (called DateTime by the EXIF spec.)
    DateTimeOriginal?: string;      // ExifIFD	(date/time when original image was taken)
    CreateDate?: string;	        // ExifIFD	(called DateTimeDigitized by the EXIF spec.)
    OffsetTime?: string;	        // ExifIFD	(time zone for ModifyDate)
    OffsetTimeOriginal?: string;	// ExifIFD	(time zone for DateTimeOriginal)
    OffsetTimeDigitized?: string;	// ExifIFD	(time zone for CreateDate)
    TimeZoneOffset?:	number;         // ExifIFD	(1 or 2 values: 1. The time zone offset of DateTimeOriginal from GMT in hours, 2. If present, the time zone offset of ModifyDate)

    DateTimeCreated?: string; //
    FileModifyDate?: string; //

    GPSDateStamp?: string; // GPS Date by UTC
    GPSTimeStamp?: string; // GPS Time by UTC

    MIMEType: string; // "video/mp4"

    FileAccessDate?: string; // "2023:02:15 11:53:36+01:00",
    FileInodeChangeDate?: string; // "2023:02:15 11:53:36+01:00",
    FileType?: string; // "MP4",
    FileTypeExtension?: string; // "mp4",
    TrackCreateDate?: string; // "0000:00:00 00:00:00",
    TrackModifyDate?: string; // "0000:00:00 00:00:00",
    MediaCreateDate?: string; // "0000:00:00 00:00:00",
    MediaModifyDate?: string; // "0000:00:00 00:00:00",
}
