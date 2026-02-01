export interface  FailedRequestProps {
    title?: string;
    message?: string;
    errorDetails?: string;
    redirectPath?: string;
    redirectText?: string;
    retryAction?: () => void;
    retryText?: string;
    autoRedirectTime?: number; // Time in seconds before auto-redirect
    className?: string;
    showHomeButton?: boolean;
    onClose?: () => void;
    compact?: boolean;
}