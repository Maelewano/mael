"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsFiletypeDocx, BsFiletypePptx } from "react-icons/bs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaFilePdf, FaFileCsv, FaFileImage } from "react-icons/fa6";

import {
    validateFileSize, validateTotalPayloadSize, compressFile, formatFileSize, MAX_FILE_SIZE_MB, MAX_TOTAL_SIZE_MB
} from "@/lib/utils/fileValidationUtilities";
import { convertFileToUrl } from "@/lib/utils/utils";
import {
    ACCEPTED_FILE_TYPES,
    ACCEPTED_FILE_TYPES_DESCRIPTION
} from "@/lib/types/fileUploader.types";


type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
    acceptedFileTypes?: Record<string, string[]>;
    required?: boolean;
};

export const FileUploader = ({
                                 files,
                                 onChange,
                                 acceptedFileTypes = ACCEPTED_FILE_TYPES
                             }: FileUploaderProps) => {
    const [fileError, setFileError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setFileError(null);
            setIsProcessing(true);

            try {
                // Validate individual file sizes
                const oversizedFiles = acceptedFiles.filter((file) => !validateFileSize(file, MAX_FILE_SIZE_MB));
                if (oversizedFiles.length > 0) {
                    setFileError(`File(s) exceed the maximum size limit of ${MAX_FILE_SIZE_MB} MB: ${oversizedFiles.map((file) => file.name).join(', ')}`);
                    setIsProcessing(false);
                    return;
                }

                // Compress files if possible
                const processedFiles: File[] = [];
                for (const file of acceptedFiles) {
                    const compressedFile = await compressFile(file);
                    processedFiles.push(compressedFile);
                }

                // Validate total payload size after compression
                if (!validateTotalPayloadSize(processedFiles, MAX_TOTAL_SIZE_MB)) {
                    setFileError(`Total file size exceeds the maximum limit of ${MAX_TOTAL_SIZE_MB} MB. Current total: ${formatFileSize(processedFiles.reduce((sum, file) => sum + file.size, 0))}`);
                    setIsProcessing(false);
                    return;
                }
                onChange(processedFiles);
            } catch (error) {
                console.error("File processing error: ", error);
                setFileError("Error processing file. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        }, [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        disabled: isProcessing,
        onDropRejected: (rejectedFiles) => {
            const reasons = rejectedFiles.map(rejection => {
                if (rejection.errors.some(error => error.code === 'file-too-large')) {
                    return `${rejection.file.name} is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`
                }
                if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
                    return `${rejection.file.name} is not a valid file type. Please upload a valid document or image.`
                }
                return `${rejection.file.name} upload failed!!`
            })
            setFileError(`Upload failed: ${reasons.join(', ')}`);
        }
    });

    const renderPreview = () => {
        if (!files || files.length === 0) return null;

        const file = files[0];
        const isImage = file.type.startsWith('image/');

        if (isImage) {
            return (
                <Image
                    src={convertFileToUrl(file)}
                    width={1000}
                    height={1000}
                    alt="uploaded image"
                    className="max-h-[400px] overflow-hidden object-cover"
                />
            );
        } else {
            // Document preview
            return (
                <div className="flex items-center rounded-md bg-gray-100 p-4">
                    <div className="mr-3">
                        {file.type.includes('pdf') ? (
                            <FaFilePdf className="text-red-500" size={40} />
                        ) : file.type.includes('word') || file.type.includes('doc') || file.type.includes('docx') ? (
                            <BsFiletypeDocx className="text-blue-500" size={40} />
                        ) : file.type.includes('excel') || file.type.includes('sheet') || file.type.includes('xls') || file.type.includes('xlsx') ? (
                            <FaFileCsv className="text-green-500" size={40} />
                        ) : file.type.includes('powerpoint') || file.type.includes('presentation') || file.type.includes('ppt') || file.type.includes('pptx') ? (
                            <BsFiletypePptx className="text-yellow-500" size={40} />
                        ) : (
                            <FaFileImage className="text-gray-500" size={40} />
                        )}
                    </div>
                    <div>
                        <p className="max-w-[200px] truncate text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 transition-colors duration-200
    ${isDragActive ? 'border-green-500 bg-green-50' : ''}
    ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
  `}
            >
                <input {...getInputProps()} />
                {files && files.length > 0 ? (
                    renderPreview()
                ) : (
                    <>
                        <FaCloudUploadAlt className="mb-3 text-gray-500" size={40} />
                        <div className="text-center">
                            {isProcessing ? (
                                <p className="text-base text-blue-500">Processing files...</p>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-700">
                                        <span className="text-green-500">Click to upload </span>
                                        or
                                        <span className="text-blue-500"> Drag and Drop</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {ACCEPTED_FILE_TYPES_DESCRIPTION}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Max file size: {MAX_FILE_SIZE_MB}MB | Max total: {MAX_TOTAL_SIZE_MB}MB
                                    </p>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
            {fileError && (
                <p className="mt-2 text-sm text-red-500">{fileError}</p>
            )}
        </div>
    );
};
