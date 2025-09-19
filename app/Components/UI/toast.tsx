import toast, {Toaster} from "react-hot-toast";

// Toast container component to be placed in layout
export function ToastContainer() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: 'rgb(255,255,255)',
                    color: 'rgb(31,41,55)',
                    border: '1px solid rgb(229,231,235)',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                },
                success: {
                    style: {
                        borderLeft: '4px solid #24AE7C',
                        background: 'rgb(240,253,244)',
                        color: 'rgb(22,101,52)',
                    },
                },
                error: {
                    style: {
                        borderLeft: '4px solid #F24E43',
                        background: 'rgb(254,242,242)',
                        color: 'rgb(153,27,27)',
                    },
                    duration: 4000,
                },
            }}
        />
    );
}

// Toast utility functions
type ToastProps = {
    title?: string;
    message: string;
    icon?: JSX.Element;
    variant?: "success" | "error" | "loading" | "custom";
};

export const showToast = {
    success: ({ title, message, icon }: ToastProps) => {
        return toast.success(
            <div className="flex flex-col gap-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {title && <p className="font-semibold text-green-700 dark:text-green-400">{title}</p>}
                <p className="text-sm">{message}</p>
            </div>
        );
    },
    error: ({ title, message, icon }: ToastProps) => {
        return toast.error(
            <div className="flex flex-col gap-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {title && <p className="font-semibold text-red-700 dark:text-red-400">{title}</p>}
                <p className="text-sm">{message}</p>
            </div>
        );
    },
    loading: ({ title, message, icon }: ToastProps) => {
        return toast.loading(
            <div className="flex flex-col gap-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {title && <p className="font-semibold">{title}</p>}
                <p className="text-sm">{message}</p>
            </div>
        );
    },
    custom: (component: JSX.Element, options = {}) => {
        return toast.custom(component, options);
    },

    /** Dismiss is used to close a specific toast or all toasts
     * To close a specific toast, pass its ID. 
     * To close all toasts, call without passing any IDs.f
     */
    dismiss: (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },
};