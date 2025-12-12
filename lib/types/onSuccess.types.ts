export interface SuccessfulRequestProps {
    title?: string;
    message?: string;
    redirectPath?: string;
    redirectText?: string;
    autoRedirectTime?: number; // Time in seconds before auto-redirect
    className?: string;
    showHomeButton?: boolean;
    onClose?: () => void;
}