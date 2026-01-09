"use client";

import { FileSignature, XCircle, Video, Undo2 } from "lucide-react";
import { FaFileSignature } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import SignatureUrlCard from "@/app/Components/Dropbox/SignatureUrlCard";
import { Button } from "@/app/Components/UI/button";
import { Input } from "@/app/Components/UI/input";
import { showToast } from "@/app/Components/UI/toast";
import * as Routes from "@/app/constants/appRoutes/routes";
import { env } from "@/env.mjs";
import { createMeetingRoom } from "@/lib/actions/meetings.actions";
import { storage } from "@/lib/utils/localStorageUtilities";

export default function JoinMeeting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSignaturePanel, setShowSignaturePanel] = useState<boolean>(false);
  const [joinedMeeting, setJoinedMeeting] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to prevent duplicate error toasts
  const lastErrorRef = useRef<string | null>(null);

  const handleError = useCallback((message: string) => {
    // Prevent duplicate toasts for the same message
    if (lastErrorRef.current === message) return;
    lastErrorRef.current = message;

    setError(message);
    showToast.error({
      title: "Error",
      message,
      variant: "error",
    });
  }, []);

  // Handle room closing
  const handleRoomClosed = useCallback(() => {
    // Remove stored URL from localStorage
    localStorage.removeItem("publicMeetingUrl");
    setJoinedMeeting(false);

    showToast.success({
      title: "Meeting ended",
      message: "You have left the meeting",
      variant: "success",
    });
    // Redirect to the public meeting page
    router.push(Routes.JOIN);
  }, [router]);

  // Join meeting with URL validation
  const joinMeeting = useCallback(
    (url: string | null) => {
      if (!url) {
        handleError("Please enter a meeting link");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let processedUrl = url;
        const appUrl = env.NEXT_PUBLIC_APP_URL;
        const wherebyUrl = env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL;

        if (processedUrl.startsWith(appUrl)) {
          processedUrl = processedUrl.replace(appUrl, wherebyUrl);
        }

        // After potential replacement, validate the URL starts with the Whereby domain
        if (!processedUrl.startsWith(wherebyUrl)) {
          handleError(
            "Invalid meeting link. Please provide a valid meeting link for this service."
          );
          setIsLoading(false);
          return;
        }

        const urlObj = new URL(processedUrl);
        if (urlObj) {
          setJoinedMeeting(true);
          setMeetingUrl(processedUrl);
          setError(null);
          lastErrorRef.current = null; // clear last error
          storage.set("publicMeetingUrl", processedUrl);
        }
      } catch (err) {
        handleError("Please enter a valid meeting link");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  useEffect(() => {
    // Extract token from URL
    const token = searchParams.get("token");
    if (!token) {
      handleError("Missing meeting token in URL");
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
      const response = await createMeetingRoom(token);
      const url = response.data.roomUrl;
      joinMeeting(url);
    };
    fetchData();
  }, [searchParams, joinMeeting]);

  // Listen for iframe messages (meeting ended)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "WHEREBY_ROOM_LEFT") handleRoomClosed();
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleRoomClosed]);

  // Auto-hide instructions after 5 seconds
  useEffect(() => {
    if (showInstructions && joinedMeeting) {
      timerRef.current = setTimeout(() => {
        setShowInstructions(false);
      }, 5000); // 5 seconds
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [showInstructions, joinedMeeting]);

  if (isLoading && joinedMeeting) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="rounded-lg border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <div className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Loading your meeting room...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!joinedMeeting) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Join Meeting
            </h1>
            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mb-6"></div>
            <p className="text-lg text-muted-foreground">
              Enter your meeting link to get started
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            {error && (
              <div className="mb-6 mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  {error}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="meetingUrl"
                className="mb-3 block text-sm font-medium text-gray-700 flex items-center"
              >
                <Video className="mr-2 size-4 text-blue-500" />
                Meeting Link
              </label>
              <Input
                id="meetingUrl"
                type="text"
                value={meetingUrl || ""}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder={`${env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL}${Routes.JOIN}/mael-meeting-...`}
                className="h-12 text-sm bg-white dark:bg-white dark:text-black border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => joinMeeting(meetingUrl)}
                disabled={isLoading || !meetingUrl?.trim()}
                className="px-6 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Video className="mr-2 size-4" />
                {isLoading ? "Joining..." : "Join Meeting"}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push(Routes.SCHEDULER)}
                className="px-6 h-12 border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Undo2 className="mr-2 size-4" />
                Return to Scheduler
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen max-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        {meetingUrl && (
          <header className="mb-6 rounded-lg border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Video Meeting - Join
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  You&apos;ve joined the meeting
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  {showInstructions
                    ? "Hide Instructions"
                    : "Screen Share Instructions"}
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
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                >
                  <FileSignature className="mr-2 size-4" />
                  {showSignaturePanel
                    ? "Hide Signature Panel"
                    : "Document Signing"}
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleRoomClosed}
                  className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                >
                  Exit Meeting
                </Button>
              </div>
            </div>
          </header>
        )}

        {showInstructions && (
          <div className="absolute right-4 top-24 z-10 w-full max-w-md">
            <div className="rounded-lg border border-gray-200 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Screen Share Instructions
                </h2>
                <Button
                  onClick={() => setShowInstructions(false)}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  aria-label="Close instructions"
                >
                  <XCircle size={20} />
                </Button>
              </div>
              <p className="text-gray-700 mb-3">
                When sharing your screen, please select the browser tab with
                this website only to protect your privacy.
              </p>
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-blue-600 font-medium">
                  📋 This message will automatically close in 5 seconds
                </p>
              </div>
            </div>
          </div>
        )}

        {showSignaturePanel && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-24 bottom-4 z-10 w-4/5">
            <div className="rounded-lg border border-gray-200 bg-white/95 shadow-xl backdrop-blur-sm h-full flex flex-col max-h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 flex-shrink-0">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Document Signing
                </h2>
                <div className="my-4 flex flex-row items-center justify-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  <FaFileSignature className="text-gray-700" size={30} />
                  <h3 className="text-xl font-bold">Sign Document</h3>
                </div>
                <Button
                  onClick={() => setShowSignaturePanel(false)}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  aria-label="Close signature panel"
                >
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0">
                <SignatureUrlCard />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden flex-1 min-h-0">
          {meetingUrl && (
            <iframe
              src={meetingUrl}
              allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
              className="w-full h-full"
              title="Video Meeting"
              onLoad={() => {
                console.log("Join meeting room loaded");
                // We always show the header regardless of URL type
              }}
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
}
