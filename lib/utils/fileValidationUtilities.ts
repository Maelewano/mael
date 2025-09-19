import imageCompression from 'browser-image-compression';

// File size limits (in MB)
export const MAX_FILE_SIZE_MB = 5;
export const MAX_TOTAL_SIZE_MB = 8;

export function validateFileSize(file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

export function validateTotalPayloadSize(files: File[], maxSizeMB: number = MAX_TOTAL_SIZE_MB): boolean {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return totalSize <= maxSizeBytes;
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function compressFile(file: File): Promise<File> {
    if (file.type.startsWith('image/')) {
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: file.type,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            console.log(`Compressed ${file.name} from ${formatFileSize(file.size)} to ${formatFileSize(compressedFile.size)}`);
            return compressedFile;
        } catch (error) {
            console.warn('Image compression failed, using original file:', error);
            return file;
        }
    }

    return file; // Return original for non-images
}