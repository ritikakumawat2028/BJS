import { v2 as cloudinary } from 'cloudinary';
export declare const uploadToCloudinary: (filePath: string, folder?: string) => Promise<{
    url: string;
    publicId: string;
}>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<void>;
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map