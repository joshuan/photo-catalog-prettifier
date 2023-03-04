import { execaSync } from 'execa';
import { debugUtil } from './debug.js';
import { buildDate } from '../../lib/exifdate/index.js';

const debug = debugUtil('exiftool');

interface IBaseData {
    SourceFile: string;                                 // '/Users/username/photos/IMG_1442.heic'
}

interface IRequestedData {
    ExifToolVersion: number;                            // 12.5,
    FileName: string;                                   // 'IMG_1442.heic',
    Directory: string;                                  // '/Users/username/photos',
    FileSize: string;                                   // '1374 kB',
    FileAccessDate: string;                             // '2023:02:19 15:56:10+01:00',
    FileModifyDate: string;                             // '2023:02:15 13:45:14+01:00',
    FileInodeChangeDate: string;                        // '2023:02:19 15:56:07+01:00',
    FilePermissions: string;                            // '-rw-r--r--',
    FileType: string;                                   // 'HEIC',
    FileTypeExtension: string;                          // 'heic',
    MIMEType: string;                                   // 'image/heic',
    MajorBrand: string;                                 // 'High Efficiency Image Format HEVC still image (.HEIC)',
    MinorVersion: string;                               // '0.0.0',
    CompatibleBrands: string[];                         // [ 'mif1', 'heic' ],
    MovieHeaderVersion: number;                         // 0,
    CreateDate: string;                                 // '2019:01:13 11:53:07',
    ModifyDate: string;                                 // '2019:01:13 11:53:07',
    TimeScale: number;                                  // 15360,
    Duration: string;                                   // '0:01:56',
    PreferredRate: number;                              // 1,
    PreferredVolume: string;                            // '100.00%',
    PreviewTime: string;                                // '0 s',
    PreviewDuration: string;                            // '0 s',
    PosterTime: string;                                 // '0 s',
    SelectionTime: string;                              // '0 s',
    SelectionDuration: string;                          // '0 s',
    CurrentTime: string;                                // '0 s',
    NextTrackID: number;                                // 3,
    TrackHeaderVersion: number;                         // 0,
    TrackCreateDate: string;                            // '2019:09:14 21:12:44',
    TrackModifyDate: string;                            // '2019:09:14 21:12:44',
    TrackID: number;                                    // 1,
    TrackDuration: string;                              // '0:01:56',
    TrackLayer: number;                                 // 0,
    TrackVolume: string;                                // '0.00%',
    ImageWidth: number;                                 // 4032,
    ImageHeight: number;                                // 3024,
    CleanApertureDimensions: string;                    // '1308x980',
    ProductionApertureDimensions: string;               // '1440x1080',
    EncodedPixelsDimensions: string;                    // '1440x1080',
    GraphicsMode: string;                               // 'srcCopy',
    OpColor: string;                                    // '0 0 0',
    CompressorID: string;                               // 'avc1',
    SourceImageWidth: number;                           // 1080,
    SourceImageHeight: number;                          // 1920,
    XResolution: number;                                // 72,
    YResolution: number;                                // 72,
    CompressorName: string;                             // 'HEVC',
    BitDepth: number;                                   // 24,
    VideoFrameRate: number;                             // 30,
    Balance: number;                                    // 0,
    AudioFormat: string;                                // 'mp4a',
    AudioBitsPerSample: number;                         // 16,
    AudioSampleRate: number;                            // 44100,
    LayoutFlags: string;                                // 'Mono',
    AudioChannels: number;                              // 1,
    Warning: string;                                    // '[minor] The ExtractEmbedded option may find more tags in the media data',
    MatrixStructure: string;                            // '1 0 0 0 1 0 0 0 1',
    ContentDescribes: string;                           // 'Track 1',
    MediaHeaderVersion: number;                         // 0,
    MediaCreateDate: string;                            // '2019:09:14 21:12:44',
    MediaModifyDate: string;                            // '2019:09:14 21:12:44',
    MediaTimeScale: number;                             // 44100,
    MediaDuration: string;                              // '0:01:56',
    MediaLanguageCode: string;                          // 'und',
    GenMediaVersion: number;                            // 0,
    GenFlags: string;                                   // '0 0 0',
    GenGraphicsMode: string;                            // 'ditherCopy',
    GenOpColor: string;                                 // '32768 32768 32768',
    GenBalance: number;                                 // 0,
    HandlerClass: string;                               // 'Data Handler',
    HandlerVendorID: string;                            // 'Apple',
    HandlerDescription: string;                         // 'ISO Media file produced by Google Inc. Created on: 09/14/2019.',
    MetaFormat: string;                                 // 'mebx',
    ContentIdentifier: string;                          // 'A3C92FD2-DCD9-4CC4-B1DE-F53181C5A7DF',
    GPSCoordinates: string;                             // `43 deg 25' 39.36" N, 39 deg 55' 15.96" E, 0.976 m Below Sea Level`,
    Make: string;                                       // 'Apple',
    Model: string;                                      // 'iPhone 8',
    Software: string;                                   // '12.1.2',
    CreationDate: string;                               // '2019:05:24 16:13:43+03:00',
    HandlerType: string;                                // 'Picture',
    Comment: string;                                    // 'Original filename: IMG_0926.MOV',
    MediaDataSize: number;                              // 1370265,
    MediaDataOffset: number;                            // 4066,
    ImageSize: string;                                  // '4032x3024',
    Megapixels: number;                                 // 12.2,
    AvgBitrate: string;                                 // '5.63 Mbps',
    GPSAltitude: string;                                // '5.3 m Above Sea Level',
    GPSAltitudeRef: string;                             // 'Above Sea Level',
    GPSLatitude: string;                                // `43 deg 25' 39.47" N`,
    GPSLongitude: string;                               // `39 deg 55' 36.58" E`,
    Rotation: number;                                   // 270,
    GPSPosition: string;                                // `43 deg 25' 39.47" N, 39 deg 55' 36.58" E`,
    PrimaryItemReference: number;                       // 49,
    MetaImageSize: string;                              // '4032x3024',
    ExifByteOrder: string;                              // 'Big-endian (Motorola, MM)',
    Orientation: string;                                // 'Rotate 90 CW',
    ResolutionUnit: string;                             // 'inches',
    YCbCrPositioning: string;                           // 'Centered',
    ExposureTime: string;                               // '1/17',
    FNumber: number;                                    // 1.8,
    ExposureProgram: string;                            // 'Program AE',
    ISO: number;                                        // 80,
    ExifVersion: string;                                // '0221',
    DateTimeOriginal: string;                           // '2019:01:13 11:53:07',
    ComponentsConfiguration: string;                    // 'Y, Cb, Cr, -',
    ShutterSpeedValue: string;                          // '1/17',
    ApertureValue: number;                              // 1.8,
    BrightnessValue: number;                            // 1.646443621,
    ExposureCompensation: number;                       // 0,
    MeteringMode: string;                               // 'Multi-segment',
    Flash: string;                                      // 'Auto, Did not fire',
    FocalLength: string;                                // '4.0 mm',
    SubjectArea: string;                                // '2049 1776 211 213',
    RunTimeFlags: string;                               // 'Valid',
    RunTimeValue: number;                               // 260886356981125,
    RunTimeScale: number;                               // 1000000000,
    RunTimeEpoch: number;                               // 0,
    AccelerationVector: string;                         // '0.01947214267 -0.9993901852 0.07077374309',
    FocusDistanceRange: string;                         // '11.55 - 27.23 m',
    LivePhotoVideoIndex: number;                        // 0,
    SubSecTimeOriginal: number;                         // 800,
    SubSecTimeDigitized: number;                        // 800,
    FlashpixVersion: string;                            // '0100',
    ColorSpace: string;                                 // 'Uncalibrated',
    ExifImageWidth: number;                             // 4032,
    ExifImageHeight: number;                            // 3024,
    SensingMethod: string;                              // 'One-chip color area',
    SceneType: string;                                  // 'Directly photographed',
    ExposureMode: string;                               // 'Auto',
    WhiteBalance: string;                               // 'Auto',
    FocalLengthIn35mmFormat: string;                    // '51 mm',
    SceneCaptureType: string;                           // 'Standard',
    LensInfo: string;                                   // '3.99mm f/1.8',
    LensMake: string;                                   // 'Apple',
    LensModel: string;                                  // 'iPhone 8 back camera 3.99mm f/1.8',
    GPSLatitudeRef: string;                             // 'North',
    GPSLongitudeRef: string;                            // 'East',
    GPSTimeStamp: string;                               // '08:53:05.15',
    GPSSpeedRef: string;                                // 'km/h',
    GPSSpeed: number;                                   // 0,
    GPSImgDirectionRef: string;                         // 'True North',
    GPSImgDirection: number;                            // 295.7172852,
    GPSDestBearingRef: string;                          // 'True North',
    GPSDestBearing: number;                             // 295.7172852,
    GPSDateStamp: string;                               // '2019:01:13',
    GPSHPositioningError: string;                       // '65 m',
    HEVCConfigurationVersion: number;                   // 1,
    GeneralProfileSpace: string;                        // 'Conforming',
    GeneralTierFlag: string;                            // 'Main Tier',
    GeneralProfileIDC: string;                          // 'Main Still Picture',
    GenProfileCompatibilityFlags: string;               // 'Main Still Picture, Main 10, Main',
    ConstraintIndicatorFlags: string;                   // '176 0 0 0 0 0',
    GeneralLevelIDC: string;                            // '90 (level 3.0)',
    MinSpatialSegmentationIDC: number;                  // 0,
    ParallelismType: number;                            // 0,
    ChromaFormat: string;                               // '4:2:0',
    BitDepthLuma: number;                               // 8,
    BitDepthChroma: number;                             // 8,
    AverageFrameRate: number;                           // 0,
    ConstantFrameRate: string;                          // 'Unknown',
    NumTemporalLayers: number;                          // 1,
    TemporalIDNested: string;                           // 'No',
    ImageSpatialExtent: string;                         // '4032x3024',
    ProfileCMMType: string;                             // 'Apple Computer Inc.',
    ProfileVersion: string;                             // '4.0.0',
    ProfileClass: string;                               // 'Display Device Profile',
    ColorSpaceData: string;                             // 'RGB ',
    ProfileConnectionSpace: string;                     // 'XYZ ',
    ProfileDateTime: string;                            // '2017:07:07 13:22:32',
    ProfileFileSignature: string;                       // 'acsp',
    PrimaryPlatform: string;                            // 'Apple Computer Inc.',
    CMMFlags: string;                                   // 'Not Embedded, Independent',
    DeviceManufacturer: string;                         // 'Apple Computer Inc.',
    DeviceModel: string;                                // '',
    DeviceAttributes: string;                           // 'Reflective, Glossy, Positive, Color',
    RenderingIntent: string;                            // 'Perceptual',
    ConnectionSpaceIlluminant: string;                  // '0.9642 1 0.82491',
    ProfileCreator: string;                             // 'Apple Computer Inc.',
    ProfileID: string;                                  // 'ca1a9582257f104d389913d5d1ea1582',
    ProfileDescription: string;                         // 'Display P3',
    ProfileCopyright: string;                           // 'Copyright Apple Inc., 2017',
    MediaWhitePoint: string;                            // '0.95045 1 1.08905',
    RedMatrixColumn: string;                            // '0.51512 0.2412 -0.00105',
    GreenMatrixColumn: string;                          // '0.29198 0.69225 0.04189',
    BlueMatrixColumn: string;                           // '0.1571 0.06657 0.78407',
    RedTRC: string;                                     // '(Binary data 32 bytes, use -b option to extract)',
    ChromaticAdaptation: string;                        // '1.04788 0.02292 -0.0502 0.02959 0.99048 -0.01706 -0.00923 0.01508 0.75168',
    BlueTRC: string;                                    // '(Binary data 32 bytes, use -b option to extract)',
    GreenTRC: string;                                   // '(Binary data 32 bytes, use -b option to extract)',
    ImagePixelDepth: string;                            // '8 8 8',
    RunTimeSincePowerUp: string;                        // '3 days 0:28:06',
    Aperture: number;                                   // 1.8,
    ScaleFactor35efl: number;                           // 12.8,
    ShutterSpeed: string;                               // '1/17',
    SubSecCreateDate: string;                           // '2019:01:13 11:53:07.800',
    SubSecDateTimeOriginal: string;                     // '2019:01:13 11:53:07.800',
    GPSDateTime: string;                                // '2019:01:13 08:53:05.15Z',
    CircleOfConfusion: string;                          // '0.002 mm',
    FOV: string;                                        // '38.9 deg',
    FocalLength35efl: string;                           // '4.0 mm (35 mm equivalent: 51.0 mm)',
    HyperfocalDistance: string;                         // '3.76 m',
    LightValue: number;                                 // 6.1,
    LensID: string;                                     // 'iPhone 8 back camera 3.99mm f/1.8',
    JFIFVersion: number;                                // 1.01,
    MediaGroupUUID: string;                             // 'B68265A6-0BC9-40B7-9854-080FBA9A0AD0',
    ImageUniqueID: string;                              // '30b7fb70bba68bac0000000000000000',
    GPSVersionID: string;                               // '2.2.0.0',
    Compression: string;                                // 'JPEG (old-style)',
    ThumbnailOffset: number;                            // 2048,
    ThumbnailLength: number;                            // 8781,
    EncodingProcess: string;                            // 'Baseline DCT, Huffman coding',
    BitsPerSample: number;                              // 8,
    ColorComponents: number;                            // 3,
    YCbCrSubSampling: string;                           // 'YCbCr4:2:0 (2 2)',
    ThumbnailImage: string;                             // '(Binary data 8781 bytes, use -b option to extract)',
    XMPToolkit: string;                                 // 'XMP Core 5.4.0',
    RegionType: string[];                               // [ 'Face', 'Face', 'Face' ],
    RegionAreaY: string[];                              // [ '0.44534939759036152', '0.25771566265060242', '0.58835180722891578' ],
    RegionAreaW: string[];                              // [ '0.043707317073170715', '0.043707317073170715', '0.052813008130081329' ],
    RegionAreaX: string[];                              // [ '0.49863053297199644', '0.48952484191508583', '0.50864679313459815' ],
    RegionAreaH: string[];                              // [ '0.058293975903614459', '0.058293975903614487', '0.071045783132530071' ],
    RegionAreaUnit: string[];                           // [ 'normalized', 'normalized', 'normalized' ],
    RegionExtensionsAngleInfoYaw: number;               // 315,
    RegionExtensionsAngleInfoRoll: number;              // 270,
    RegionExtensionsConfidenceLevel: number;            // 799,
    RegionExtensionsTimeStamp: number;                  // 6261270486295,
    RegionExtensionsFaceID: number;                     // 5,
    RegionAppliedToDimensionsH: number;                 // 3024,
    RegionAppliedToDimensionsW: number;                 // 4032,
    RegionAppliedToDimensionsUnit: string;              // 'pixel',
    CurrentIPTCDigest: string;                          // 'd41d8cd98f00b204e9800998ecf8427e',
    EnvelopeRecordVersion: number;                      // 4,
    CodedCharacterSet: string;                          // 'UTF8',
    ApplicationRecordVersion: number;                   // 4,
    IPTCDigest: string;                                 // 'd41d8cd98f00b204e9800998ecf8427e',
    TileWidth: number;                                  // 512,
    TileLength: number;                                 // 512,
    HDRImageType: string;                               // 'Unknown (2)',
    CustomRendered: string;                             // 'HDR (no original saved)',
    CreatorTool: string;                                // '12.1.4',
    DateCreated: string;                                // '2019:04:06 18:50:28',
    OffsetTime: string;                                 // '+03:00',
    OffsetTimeOriginal: string;                         // '+03:00',
    OffsetTimeDigitized: string;                        // '+03:00',
    SubSecModifyDate: string;                           // '2019:10:17 11:08:50+03:00',
    DigitalZoomRatio: number;                           // 1.821686747,
    BufferSize: number;                                 // 67046,
    MaxBitrate: number;                                 // 7834088,
    AverageBitrate: number;                             // 6747440,
    InteropIndex: string;                               // 'R98 - DCF basic file (sRGB)',
    InteropVersion: string;                             // '0100',
    Artist: string;                                     // 'Vasiliy Pupkin',
    SensitivityType: string;                            // 'Recommended Exposure Index',
    RecommendedExposureIndex: number;                   // 100,
    MaxApertureValue: number;                           // 4,
    FocalPlaneXResolution: number;                      // 5798.657718,
    FocalPlaneYResolution: number;                      // 5788.944724,
    FocalPlaneResolutionUnit: string;                   // 'inches',
    SerialNumber: number;                               // 123013006345,
    LensSerialNumber: string;                           // '0000154ec3',
    MetadataDate: string;                               // '2019:01:02 15:56:23+03:00',
    Label: string;                                      // 'Green',
    Format: string;                                     // 'image/jpeg',
    Lens: string;                                       // 'EF70-300mm f/4-5.6 IS USM',
    ImageNumber: number;                                // 0,
    ApproximateFocusDistance: number;                   // 9.14,
    FlashCompensation: number;                          // 0,
    Firmware: string;                                   // '1.0.4',
    DocumentID: string;                                 // 'xmp.did:60c9be57-23f7-4d75-9d89-2d66a3ba1f20',
    OriginalDocumentID: string;                         // '5F11C4D9FD4B04BD2AD1F17B30F1A3ED',
    InstanceID: string;                                 // 'xmp.iid:60c9be57-23f7-4d75-9d89-2d66a3ba1f20',
    Marked: boolean;                                    // true,
    Version: number;                                    // 10,
    ProcessVersion: number;                             // 10,
    ColorTemperature: number;                           // 5800,
    Tint: string;                                       // '+9',
    Saturation: number;                                 // 0,
    Sharpness: number;                                  // 40,
    LuminanceSmoothing: number;                         // 65,
    ColorNoiseReduction: number;                        // 25,
    VignetteAmount: number;                             // 0,
    ShadowTint: number;                                 // 0,
    RedHue: number;                                     // 0,
    RedSaturation: number;                              // 0,
    GreenHue: number;                                   // 0,
    GreenSaturation: number;                            // 0,
    BlueHue: number;                                    // 0,
    BlueSaturation: number;                             // 0,
    Vibrance: string;                                   // '+25',
    HueAdjustmentRed: number;                           // 0,
    HueAdjustmentOrange: number;                        // 0,
    HueAdjustmentYellow: number;                        // 0,
    HueAdjustmentGreen: number;                         // 0,
    HueAdjustmentAqua: number;                          // 0,
    HueAdjustmentBlue: number;                          // 0,
    HueAdjustmentPurple: number;                        // 0,
    HueAdjustmentMagenta: number;                       // 0,
    SaturationAdjustmentRed: number;                    // 0,
    SaturationAdjustmentOrange: number;                 // 0,
    SaturationAdjustmentYellow: number;                 // 0,
    SaturationAdjustmentGreen: number;                  // 0,
    SaturationAdjustmentAqua: number;                   // 0,
    SaturationAdjustmentBlue: number;                   // 0,
    SaturationAdjustmentPurple: number;                 // 0,
    SaturationAdjustmentMagenta: number;                // 0,
    LuminanceAdjustmentRed: number;                     // 0,
    LuminanceAdjustmentOrange: number;                  // 0,
    LuminanceAdjustmentYellow: number;                  // 0,
    LuminanceAdjustmentGreen: number;                   // 0,
    LuminanceAdjustmentAqua: number;                    // 0,
    LuminanceAdjustmentBlue: number;                    // 0,
    LuminanceAdjustmentPurple: number;                  // 0,
    LuminanceAdjustmentMagenta: number;                 // 0,
    SplitToningShadowHue: number;                       // 0,
    SplitToningShadowSaturation: number;                // 0,
    SplitToningHighlightHue: number;                    // 0,
    SplitToningHighlightSaturation: number;             // 0,
    SplitToningBalance: number;                         // 0,
    ParametricShadows: number;                          // 0,
    ParametricDarks: number;                            // 0,
    ParametricLights: number;                           // 0,
    ParametricHighlights: number;                       // 0,
    ParametricShadowSplit: number;                      // 25,
    ParametricMidtoneSplit: number;                     // 50,
    ParametricHighlightSplit: number;                   // 75,
    SharpenRadius: string;                              // '+0.8',
    SharpenDetail: number;                              // 50,
    SharpenEdgeMasking: number;                         // 0,
    PostCropVignetteAmount: number;                     // 0,
    GrainAmount: number;                                // 0,
    LuminanceNoiseReductionDetail: number;              // 50,
    ColorNoiseReductionDetail: number;                  // 50,
    LuminanceNoiseReductionContrast: number;            // 0,
    ColorNoiseReductionSmoothness: number;              // 50,
    LensProfileEnable: number;                          // 1,
    LensManualDistortionAmount: number;                 // 0,
    PerspectiveVertical: number;                        // 0,
    PerspectiveHorizontal: number;                      // 0,
    PerspectiveRotate: number;                          // 0,
    PerspectiveScale: number;                           // 100,
    PerspectiveAspect: number;                          // 0,
    PerspectiveUpright: string;                         // 'Off',
    PerspectiveX: number;                               // 0,
    PerspectiveY: number;                               // 0,
    AutoLateralCA: number;                              // 0,
    Exposure2012: string;                               // '+0.55',
    Contrast2012: string;                               // '+3',
    Highlights2012: number;                             // 0,
    Shadows2012: number;                                // 0,
    Whites2012: string;                                 // '+41',
    Blacks2012: number;                                 // -7,
    Clarity2012: string;                                // '+17',
    DefringePurpleAmount: number;                       // 0,
    DefringePurpleHueLo: number;                        // 30,
    DefringePurpleHueHi: number;                        // 70,
    DefringeGreenAmount: number;                        // 0,
    DefringeGreenHueHi: number;                         // 60,
    DefringeGreenHueLo: number;                         // 40,
    Dehaze: number;                                     // 0,
    ConvertToGrayscale: boolean;                        // false,
    ToneCurveName: string;                              // 'Linear',
    ToneCurveName2012: string;                          // 'Linear',
    CameraProfile: string;                              // 'Adobe Standard',
    LensProfileSetup: string;                           // 'Auto',
    UprightVersion: number;                             // 151388160,
    UprightCenterMode: number;                          // 0,
    UprightCenterNormX: number;                         // 0.5,
    UprightCenterNormY: number;                         // 0.5,
    UprightFocalMode: number;                           // 0,
    UprightFocalLength35mm: number;                     // 35,
    UprightPreview: boolean;                            // false,
    UprightTransformCount: number;                      // 6,
    UprightFourSegmentsCount: number;                   // 0,
    HasSettings: boolean;                               // true,
    HasCrop: boolean;                                   // true,
    AlreadyApplied: boolean;                            // true,
    Creator: string;                                    // 'Vasiliy Pupkin',
    HistoryAction: string[];                            // [ 'derived', 'saved' ],
    HistoryParameters: string;                          // 'converted from image/x-canon-cr2 to image/jpeg, saved to new location',
    HistoryInstanceID: string;                          // 'xmp.iid:60c9be57-23f7-4d75-9d89-2d66a3ba1f20',
    HistoryWhen: string;                                // '2019:01:02 15:56:23+03:00',
    HistorySoftwareAgent: string;                       // 'Adobe Photoshop Lightroom Classic 7.0 (Macintosh)',
    HistoryChanged: string;                             // '/',
    DerivedFromInstanceID: string;                      // 'xmp.iid:c5138d81-d24e-4d14-a294-f025ebef0f99',
    DerivedFromDocumentID: string;                      // '5F11C4D9FD4B04BD2AD1F17B30F1A3ED',
    DerivedFromOriginalDocumentID: string;              // '5F11C4D9FD4B04BD2AD1F17B30F1A3ED',
    ToneCurve: string[];                                // [ '0, 0', '255, 255' ],
    ToneCurveRed: string[];                             // [ '0, 0', '255, 255' ],
    ToneCurveGreen: string[];                           // [ '0, 0', '255, 255' ],
    ToneCurveBlue: string[];                            // [ '0, 0', '255, 255' ],
    ToneCurvePV2012: string[];                          // [ '0, 0', '255, 255' ],
    ToneCurvePV2012Red: string[];                       // [ '0, 0', '255, 255' ],
    ToneCurvePV2012Green: string[];                     // [ '0, 0', '255, 255' ],
    ToneCurvePV2012Blue: string[];                      // [ '0, 0', '255, 255' ],
    CreatorCountry: string;                             // 'UAE',
    CreatorCity: string;                                // 'Dubai',
    CreatorWorkEmail: string;                           // 'Vasya@pupkin.com',
    CreatorRegion: string;                              // 'Dubai region',
    CreatorWorkURL: string;                             // 'https://vasua-pupkin.com/',
    MediaBlackPoint: string;                            // '0 0 0',
    DeviceMfgDesc: string;                              // 'IEC http://www.iec.ch',
    DeviceModelDesc: string;                            // 'IEC 61966-2.1 Default RGB colour space - sRGB',
    ViewingCondDesc: string;                            // 'Reference Viewing Condition in IEC61966-2.1',
    ViewingCondIlluminant: string;                      // '19.6445 20.3718 16.8089',
    ViewingCondSurround: string;                        // '3.92889 4.07439 3.36179',
    ViewingCondIlluminantType: string;                  // 'D50',
    Luminance: string;                                  // '76.03647 80 87.12462',
    MeasurementObserver: string;                        // 'CIE 1931',
    MeasurementBacking: string;                         // '0 0 0',
    MeasurementGeometry: string;                        // 'Unknown',
    MeasurementFlare: string;                           // '0.999%',
    MeasurementIlluminant: string;                      // 'D65',
    Technology: string;                                 // 'Cathode Ray Tube Display',
    DisplayedUnitsX: string;                            // 'inches',
    DisplayedUnitsY: string;                            // 'inches',
    TimeCreated: string;                                // '11:23:45+00:00',
    DigitalCreationDate: string;                        // '2019:01:02',
    DigitalCreationTime: string;                        // '11:23:45+00:00',
    'By-line': string;                                  // 'Vasiliy Pupkin',
    CopyrightFlag: boolean;                             // true,
    PhotoshopThumbnail: string;                         // '(Binary data 16097 bytes, use -b option to extract)',
    DateTimeCreated: string;                            // '2019:01:02 11:23:45+00:00',
    DigitalCreationDateTime: string;                    // '2019:01:02 11:23:45+00:00',
    DOF: string;                                        // '4.86 m (7.32 - 12.17 m)',
    PurchaseFileFormat: string;                         // 'mp4a',
    Keywords: string;                                   // 'FaceTime',
    Encoder: string;                                    // 'Lavf56.1.100',
    LightSource: string;                                // 'Unknown',
    MakerNoteVersion: string;                           // '0100',
    DeviceType: string;                                 // 'Cell Phone',
    RawDataByteOrder: string;                           // 'Little-endian (Intel, II)',
    RawDataCFAPattern: string;                          // 'Swap',
    FaceDetect: string;                                 // 'Off',
    UserComment: string;                                // 'FaceTime Photo',
    DistortionCorrectionAlreadyApplied: boolean;        // true,
    VignetteCorrectionAlreadyApplied: boolean;          // true,
    LensProfileName: string;                            // 'Adobe (Canon EF 70-300mm f/4-5.6 IS USM)',
    LensProfileFilename: string;                        // 'Canon EOS-1Ds Mark III (Canon EF 70-300mm f4-5.6 IS USM) - RAW.lcp',
    LensProfileDigest: string;                          // '22EE19AB3DD3495822291C845C0A3ABE',
    LensProfileDistortionScale: number;                 // 100,
    LensProfileChromaticAberrationScale: number;        // 100,
    LensProfileVignettingScale: number;                 // 100,
    CropTop: number;                                    // 0,
    CropLeft: number;                                   // 0.014045,
    CropBottom: number;                                 // 1,
    CropRight: number;                                  // 0.985955,
    CropAngle: number;                                  // 0.757525,
    CropConstrainToWarp: number;                        // 0,
    ContentCreateDate: string;                          // '2019:01:26 13:10:20+03:00',
    GPSDOP: number;                                     // 84.01630769,
    BurstUUID: string;                                  // 'A0651F22-5F15-4E11-A634-AA838A99C6C4',
    ApplePhotosOriginatingSignature: string;            // 'Aaxx1RY8sH2e0q2v4X2plXm/2Yji',
    RegionExtensions: string;                           // '',
    MPFVersion: string;                                 // '0100',
    NumberOfImages: number;                             // 3,
    MPImageFlags: string;                               // '(none)',
    MPImageFormat: string;                              // 'JPEG',
    MPImageType: string;                                // 'Undefined',
    MPImageLength: number;                              // 112846,
    MPImageStart: number;                               // 1939692,
    DependentImage1EntryNumber: number;                 // 0,
    DependentImage2EntryNumber: number;                 // 0,
    MPImage2: string;                                   // '(Binary data 45637 bytes, use -b option to extract)',
    MPImage3: string;                                   // '(Binary data 112846 bytes, use -b option to extract)',
    PlayMode: string;                                   // 'SEQ_PLAY',
    Subject: string;                                    // 'Ivan Ivanovich Pupkin',
    GradientBasedCorrWhat: string;                      // 'Correction',
    GradientBasedCorrAmount: number;                    // 1,
    GradientBasedCorrActive: boolean;                   // true,
    GradientBasedCorrSaturation: number;                // 0,
    GradientBasedCorrSharpness: number;                 // 0,
    GradientBasedCorrBrightness: number;                // 0,
    GradientBasedCorrToningHue: number;                 // 0,
    GradientBasedCorrToningSaturation: number;          // 0,
    GradientBasedCorrExposure2012: number;              // 0.299352,
    GradientBasedCorrContrast2012: number;              // 0,
    GradientBasedCorrHighlights2012: number;            // 0,
    GradientBasedCorrShadows2012: number;               // 0,
    GradientBasedCorrWhites2012: number;                // 0,
    GradientBasedCorrBlacks2012: number;                // 0,
    GradientBasedCorrClarity2012: number;               // 0,
    GradientBasedCorrDehaze: number;                    // 0,
    GradientBasedCorrLuminanceNoise: number;            // 0,
    GradientBasedCorrMoire: number;                     // 0,
    GradientBasedCorrDefringe: number;                  // 0,
    GradientBasedCorrTemperature: number;               // 0,
    GradientBasedCorrTint: number;                      // 0,
    GradientBasedCorrMaskWhat: string;                  // 'Mask/Gradient',
    GradientBasedCorrMaskValue: number;                 // 1,
    GradientBasedCorrMaskZeroX: number;                 // 0.354699,
    GradientBasedCorrMaskZeroY: number;                 // 0.459488,
    GradientBasedCorrMaskFullX: number;                 // 0.191528,
    GradientBasedCorrMaskFullY: number;                 // 0.430367,
    GradientBasedCorrRangeMaskType: number;             // 0,
    GradientBasedCorrRangeMaskColorAmount: number;      // 0.5,
    GradientBasedCorrRangeMaskLumMin: number;           // 0,
    GradientBasedCorrRangeMaskLumMax: number;           // 1,
    GradientBasedCorrRangeMaskLumFeather: number;       // 0.5,
    PreviewImage: string;                               // '(Binary data 12610 bytes, use -b option to extract)'
}

export type TAvailableFields = keyof IRequestedData;

export type IExifPartialData<T extends TAvailableFields = TAvailableFields> = IBaseData & Partial<Pick<IRequestedData, T>>;
export type IExifRequiredData<TRequired extends TAvailableFields = TAvailableFields> = IBaseData & Pick<IRequestedData, TRequired>;
export type IExifData<TRequired extends TAvailableFields, TPartial extends TAvailableFields> = IExifPartialData<TPartial> & IExifRequiredData<TRequired>;

export class ExifTool {
    constructor(private readonly path: string) {}

    static async exec(options: string[]): Promise<string> {
        debug('Execute:', ['exiftool', ...options]);

        const result = execaSync('exiftool', options);

        if (result.exitCode !== 0) {
            throw new Error('Not zero code result', { cause: result });
        }

        debug('Stderr print:', result.stderr.split('\n').map(x => x.trim()));

        return result.stdout;
    }

    private async execJson<T extends TAvailableFields = TAvailableFields>(fields: T[] = []): Promise<IExifPartialData<T>[]> {
        const result = await ExifTool.exec(['-json', ...(fields.map(x => `-${x}`)), this.path]);

        let data = [] as IExifPartialData<T>[];

        if (result !== '') {
            try {
                data = JSON.parse(result) as IExifPartialData<T>[];
            } catch (err) {
                throw new Error('Can not parse stdout', { cause: result });
            }
        }

        debug('Parsed %d data.', data.length);

        return data;
    }

    public validateField<T extends TAvailableFields>(data: IExifPartialData<T>, field: T): IExifRequiredData<T>[T] {
        if (typeof data[field] !== 'undefined') {
            throw new Error(`Field ${field} is required.`);
        }

        return data[field] as IExifRequiredData<T>[T];
    }

    async getFullData(): Promise<IExifData<'FileName', TAvailableFields>[]> {
        // @ts-expect-error
        const data = await this.execJson(['b']);

        return data as IExifData<'FileName', TAvailableFields>[];
    }

    async getPartialData<T extends TAvailableFields>(fields: T[]): Promise<IExifPartialData<T>[]> {
        return await this.execJson(fields);
    }

    public validateData<T extends TAvailableFields>(item: IExifPartialData<T>, fields: T[]): IExifRequiredData<T> {
        const result = {
            SourceFile: item.SourceFile,
        } as IExifRequiredData<T>;

        for (const key of fields) {
            result[key] = this.validateField(item, key);
        }

        return result;
    }

    async getData<T extends TAvailableFields>(fields: T[]): Promise<IExifRequiredData<T>[]> {
        const data = await this.execJson(fields);

        return data.map((item) => this.validateData(item, fields));
    }

    async getFiles() {
        return await this.getData(['FileName']);
    }

    private parseGps(item: IExifPartialData) {
        if (item.GPSLatitude && item.GPSLongitude) {
            const GPS_RE = /^(\d+)\sdeg\s(\d+)\'\s([\d\.]+)\"\s(\w+)$/;

            // "25 deg 19' 47.38\" N"
            function parseGeoPoint(gps: string) {
                const found = GPS_RE.exec(gps);

                if (found === null) {
                    return null;
                }

                const degrees = parseFloat(found[1]);
                const minutes = parseFloat(found[2]);
                const seconds = parseFloat(found[3]);
                const isPositive: boolean = ['N', 'E'].includes(found[4]);

                return (degrees + minutes/60 + seconds/3600) * (isPositive ? 1 : -1);
            }

            return {
                lat: parseGeoPoint(item.GPSLatitude),
                lon: parseGeoPoint(item.GPSLongitude),
            };
        }

        return null;
    }

    public parseItem(item: IExifPartialData) {
        return {
            ...item,
            date: buildDate(item),
            gps: this.parseGps(item),
        };
    }
}
