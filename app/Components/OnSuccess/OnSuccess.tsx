"use client";

/**
 * A component for successful request
 * With auto redirect option and home button
 */

import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

import * as Routes from "@/api/constants/appRoutes/routes";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {SuccessfulRequestProps} from "@/types/onsuccess.types";

export const SuccessfulRequest = ({
                                      title = "Request Successful",
                                      message = "Your request has been processed successfully.",
                                      redirectPath,
                                      redirectText = "Continue",
                                      autoRedirectTime = 0, // 0 means no auto-redirect
                                      className,
                                      showHomeButton = true,
                                      onClose,
                                  }: SuccessfulRequestProps) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(autoRedirectTime);

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
                    src="/assets/gifs/success.gif"
                    alt="Success"
                    width={80}
                    height={80}
                    className="mx-auto"
                    unoptimized
                />
            </div>

            <h2 className="mb-4 text-2xl font-bold text-green-600 dark:text-green-400">{title}</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>

            <div className="flex w-full flex-col gap-4 sm:flex-row">
                {redirectPath && (
                    <Button
                        className="w-full bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
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

                {/* Close/Continue button for dialog/modal usage */}
                <Button
                    variant="ghost"
                    className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => {
                        if (onClose) {
                            onClose();
                        }
                    }}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};
