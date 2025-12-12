'use client'

import { FileSignature, XCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import SignatureUrlCard from "@/app/Components/Dropbox/SignatureUrlCard"
import Footer from "@/app/Components/Footer/Footer"
import Navbar from "@/app/Components/Navbar/Navbar"
import { Button } from "@/app/Components/UI/button"
import { Input } from "@/app/Components/UI/input"
import { showToast } from "@/app/Components/UI/toast"
import * as Routes from "@/app/constants/appRoutes/routes"
import { env } from "@/env.mjs"
import { createMeetingRoom } from '@/lib/actions/meetings.actions';
import { storage } from "@/lib/utils/localStorageUtilities"


export default function JoinMeeting() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [meetingUrl, setMeetingUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [showInstructions, setShowInstructions] = useState(true)
    const [showSignaturePanel, setShowSignaturePanel] = useState<boolean>(false)
    const [joinedMeeting, setJoinedMeeting] = useState<boolean>(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Ref to prevent duplicate error toasts
    const lastErrorRef = useRef<string | null>(null)

    const handleError = useCallback((message: string) => {
        // Prevent duplicate toasts for the same message
        if (lastErrorRef.current === message) return
        lastErrorRef.current = message

        setError(message)
        showToast.error({
            title: "Error",
            message,
            variant: "error",
        })
    }, [])

    // Handle room closing
    const handleRoomClosed = useCallback(() => {
        // Remove stored URL from localStorage
        localStorage.removeItem('publicMeetingUrl')
        setJoinedMeeting(false)

        showToast.success({
            title: "Meeting ended",
            message: "You have left the meeting",
            variant: "success",
        })
        // Redirect to the public meeting page
        router.push(Routes.JOIN)
    }, [router])

    // Join meeting with URL validation
    const joinMeeting = useCallback((url: string | null) => {
        if (!url) {
            handleError("Please enter a meeting link")
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            let processedUrl = url
            const appUrl = env.NEXT_PUBLIC_APP_URL
            const wherebyUrl = env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL

            if (processedUrl.startsWith(appUrl)) {
                processedUrl = processedUrl.replace(appUrl, wherebyUrl)
            }

            // After potential replacement, validate the URL starts with the Whereby domain
            if (!processedUrl.startsWith(wherebyUrl)) {
                handleError("Invalid meeting link. Please provide a valid meeting link for this service.")
                setIsLoading(false)
                return
            }

            const urlObj = new URL(processedUrl)
            if (urlObj) {
                setJoinedMeeting(true)
                setMeetingUrl(processedUrl)
                setError(null)
                lastErrorRef.current = null // clear last error
                storage.set('publicMeetingUrl', processedUrl)
            }
        } catch (err) {
            handleError("Please enter a valid meeting link")
        } finally {
            setIsLoading(false)
        }
    }, [handleError])

    useEffect(() => {
        // Extract token from URL
        const token = searchParams.get('token');
        if (!token) {
            handleError('Missing meeting token in URL');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        // Call API to check/join meeting room
        // createMeetingRoom(token)
        //     .then(async (res) => {
        //         if (!res.ok) {
        //             const errorData = await res.json();
        //             handleError(errorData?.error || 'Failed to join meeting room');
        //             setIsLoading(false);
        //             return;
        //         }
        //         const data = await res.json();
        //         // Use roomUrl for participant
        //         const url = data.roomUrl;
        //         joinMeeting(url);
        //     })
        //     .catch((error) => {
        //         handleError('Error connecting to meeting room');
        //         setIsLoading(false);
        //     });
        const fetchData = async () => {
            const response =  await createMeetingRoom(token);
            const url = response.data.roomUrl;
            joinMeeting(url);
        }
        fetchData();
    }, [searchParams, joinMeeting]);

    // Listen for iframe messages (meeting ended)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'WHEREBY_ROOM_LEFT') handleRoomClosed()
        }

        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [handleRoomClosed])

    // Auto-hide instructions after 5 seconds
    useEffect(() => {
        if (showInstructions && joinedMeeting) {
            timerRef.current = setTimeout(() => {
                setShowInstructions(false)
            }, 5000) // 5 seconds
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [showInstructions, joinedMeeting])

    if (isLoading && joinedMeeting) {
        return (
            <section>
                <div className="flex h-screen w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="text-xl text-white">Loading your meeting room...</div>
                </div>
            </section>
        )
    }

    if (!joinedMeeting) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Join Meeting</h1>
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="meetingUrl" className="mb-2 block text-sm font-medium text-gray-700">
                            Meeting Link
                        </label>
                        <Input
                            id="meetingUrl"
                            type="text"
                            value={meetingUrl || ''}
                            onChange={(e) => setMeetingUrl(e.target.value)}
                            placeholder={`${env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL}${Routes.JOIN}/mael-meeting-...`}
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        onClick={() => joinMeeting(meetingUrl)}
                        disabled={isLoading || !meetingUrl}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? "Joining..." : "Join Meeting"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => router.push(Routes.SCHEDULER)}
                        className="mt-4 w-full"
                    >
                        Return to Meeting Scheduler
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <section className="relative">
            <Navbar />
            <div className="h-screen w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                {meetingUrl && (
                    <header className="mx-auto flex max-w-7xl items-center justify-between bg-transparent px-4 py-6 shadow-lg sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white">Video Meeting (Join)</h1>
                        <div className="flex items-center gap-4">
                            {/** Only one modal can be open at a time.
                             * We use state to control which panel is visible.
                             */}
                            <Button
                                onClick={() => {
                                    if (!showInstructions) {
                                        setShowInstructions(true);
                                        setShowSignaturePanel(false);
                                    } else {
                                        setShowInstructions(false);
                                    }
                                }}
                                className="rounded-md bg-white px-4 py-2 text-blue-600 shadow transition-colors hover:bg-gray-100 hover:text-white"
                            >
                                {showInstructions ? "Hide Instructions" : "Screen Share Instructions"}
                            </Button>

                            <Button
                                onClick={() => {
                                    if (!showSignaturePanel) {
                                        setShowSignaturePanel(true);
                                        setShowInstructions(false);
                                    } else {
                                        setShowSignaturePanel(false);
                                    }
                                }}
                                className="rounded-md bg-white px-4 py-2 text-blue-600 shadow transition-colors hover:bg-gray-100 hover:text-white"
                            >
                                <FileSignature className="mr-2 size-4" />
                                {showSignaturePanel ? "Hide Signature Panel" : "Document Signing"}
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={handleRoomClosed}
                                className="rounded-md bg-red-600 px-4 py-2 text-white shadow transition-colors hover:bg-red-300"
                            >
                                Exit Meeting
                            </Button>
                        </div>
                    </header>
                )}

                {showInstructions && (
                    <div className="absolute right-5 z-10 w-full max-w-md">
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Screen Share Instructions</h2>
                                <Button
                                    onClick={() => setShowInstructions(false)}
                                    className="text-gray-500 hover:text-white"
                                    aria-label="Close instructions"
                                    variant="destructive"
                                >
                                    <XCircle size={20} />
                                </Button>
                            </div>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                When sharing your screen, please select the browser tab with this website only to
                                protect your privacy.
                            </p>
                            <p className="text-xs text-red-500 dark:text-red-400">This message will automatically close in 5 seconds</p>
                        </div>
                    </div>
                )}

                {showSignaturePanel && (
                    <div className="absolute left-0 top-0 z-10 w-4/5">
                        <div className="rounded-xl bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <Button
                                    onClick={() => setShowSignaturePanel(false)}
                                    className="absolute right-0 top-0 m-4 text-gray-500 hover:text-white"
                                    aria-label="Close signature panel"
                                    variant="destructive"
                                >
                                    <XCircle size={20} />
                                </Button>
                            </div>

                            <div className="max-h-[710px] overflow-y-auto">
                                <SignatureUrlCard />
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative h-[600px] w-full">
                    {meetingUrl && (
                        <iframe
                            src={meetingUrl}
                            allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
                            className="size-full"
                            title="Video Meeting"
                            onLoad={() => {
                                console.log("Join meeting room loaded")
                                // We always show the header regardless of URL type
                            }}
                        ></iframe>
                    )}
                </div>
            </div>
            <Footer />
        </section>
    )
}