"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import * as Routes from "@/app/constants/appRoutes/routes";
import { Button } from "@/app/Components/UI/button";
import { cn } from '@/lib/utils/utils';

interface FailedRequestProps {
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
}

export const FailedRequest = ({
                                  title = "Request Failed",
                                  message = "We encountered an error while processing your request.",
                                  errorDetails,
                                  redirectPath,
                                  redirectText = "Go Back",
                                  retryAction,
                                  retryText = "Try Again",
                                  autoRedirectTime = 0, // 0 means no auto-redirect
                                  className,
                                  showHomeButton = true,
                              }: FailedRequestProps) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(autoRedirectTime);
    const [showErrorDetails, setShowErrorDetails] = useState(false);

    useEffect(() => {
        if (autoRedirectTime > 0 && redirectPath) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push(redirectPath);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [autoRedirectTime, redirectPath, router]);

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-6 rounded-lg text-center max-w-md mx-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
                className
            )}
        >
            <div className="mb-6">
                <Image
                    src="/assets/gifs/error.gif"
                    alt="Error"
                    width={80}
                    height={80}
                    className="mx-auto"
                    unoptimized
                />
            </div>

            <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">{title}</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>

            {errorDetails && (
                <div className="mb-6 w-full">
                    <button
                        onClick={() => setShowErrorDetails(!showErrorDetails)}
                        className="mb-2 text-sm text-gray-600 underline dark:text-gray-400"
                    >
                        {showErrorDetails ? "Hide Error Details" : "Show Error Details"}
                    </button>

                    {showErrorDetails && (
                        <div className="max-h-32 overflow-auto rounded bg-gray-100 p-3 text-left text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <code>{errorDetails}</code>
                        </div>
                    )}
                </div>
            )}

            <div className="flex w-full flex-col gap-4 sm:flex-row">
                {retryAction && (
                    <Button
                        className="w-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        onClick={() => retryAction()}
                    >
                        {retryText}
                    </Button>
                )}

                {redirectPath && (
                    <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => router.push(redirectPath)}
                    >
                        {redirectText}
                        {countdown > 0 && ` (${countdown}s)`}
                    </Button>
                )}

                {showHomeButton && (
                    <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => router.push(Routes.HOME)}
                    >
                        Back to Home
                    </Button>
                )}
            </div>
        </div>
    );
};
