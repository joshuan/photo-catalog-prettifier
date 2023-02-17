export interface IExifData {
    FileName: string;
    ModifyDate?: string;            // IFD0	    (called DateTime by the EXIF spec.)
    DateTimeOriginal?: string;      // ExifIFD	(date/time when original image was taken)
    CreateDate?: string;	        // ExifIFD	(called DateTimeDigitized by the EXIF spec.)
    OffsetTime?: string;	        // ExifIFD	(time zone for ModifyDate)
    OffsetTimeOriginal?: string;	// ExifIFD	(time zone for DateTimeOriginal)
    OffsetTimeDigitized?: string;	// ExifIFD	(time zone for CreateDate)
    TimeZoneOffset:	number;         // ExifIFD	(1 or 2 values: 1. The time zone offset of DateTimeOriginal from GMT in hours, 2. If present, the time zone offset of ModifyDate)

    DateTimeCreated: string; //
    FileModifyDate: string; //
}