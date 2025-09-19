/**
 * File types that are accepted by the FileUploader component.
 * These types are used to restrict the file selection in the file input.
 */

export const ACCEPTED_FILE_TYPES = {
    'image/*': [],
    'application/pdf': [],
    'application/msword': [], // .doc
    // 'text/plain': [], // .txt
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // .docx
    'application/vnd.ms-excel': [], // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], // .xlsx
    'application/vnd.ms-powerpoint': [], // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': [], // .pptx
}

// String representation of the accepted file types
export const ACCEPTED_FILE_TYPES_STRING = Object.keys(ACCEPTED_FILE_TYPES).map(type => `${type}*`).join(', ');

// Human readable description of the accepted file types
export const ACCEPTED_FILE_TYPES_DESCRIPTION = "Images (JPG, JPEG, PNG, SVG, GIF) or Documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)";

// Grouping of file types by their common extensions for UI display purposes
export const FILE_TYPE_GROUPS = {
    IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
    DOCUMENTS: ['pdf', 'doc', 'docx'],
    SPREADSHEETS: ['xls', 'xlsx'],
    PRESENTATIONS: ['ppt', 'pptx']
}