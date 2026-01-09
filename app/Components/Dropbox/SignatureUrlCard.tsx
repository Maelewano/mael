"use client";

import {useEffect, useRef, useState} from "react";
import Loading from "@/app/loading";

import {env} from "@/env.mjs";

interface SignUrlResponse {
    success: boolean;
    embedded?: {
        sign_url: string;
        expires_at: number;
    };
    error?: string;
}

export default function SignatureUrlCard() {
    const [signatureId, setSignatureId] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<SignUrlResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [helloSignClient, setHelloSignClient] = useState<any>(null);
    const embedContainerRef = useRef<HTMLDivElement>(null);

    // Check for signature_id in URL parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const urlSignatureId = urlParams.get('signature_id');

            if (urlSignatureId) {
                setSignatureId(urlSignatureId);
                // Automatically fetch the sign URL if signature_id is in URL
                const fetchSignUrl = async () => {
                    setLoading(true);
                    setError(null);
                    setResponse(null);

                    try {
                        const res = await fetch(
                            `/api/dropbox/signature_request/sign_url?signature_id=${urlSignatureId}&client_id=${env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID}`
                        );
                        const data = await res.json();

                        if (!res.ok) {
                            const errorMessage = data.error?.errorMsg || data.error || "Error retrieving embedded sign URL";
                            throw new Error(`Embed Sign URL: ${errorMessage} (Status: ${res.status})`);
                        }

                        setResponse(data);
                    } catch (err) {
                        setError((err as Error).message);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchSignUrl();
            }
        }
    }, []);

    // Initialize HelloSign client only on client side
    useEffect(() => {
        const initializeClient = async () => {
            try {
                // Dynamically import HelloSign only on the client side
                const { default: HelloSign } = await import('hellosign-embedded');
                const client = new HelloSign({
                    clientId: env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID
                });
                setHelloSignClient(client)
            } catch (error) {
                console.error("Intialization failed: ", error);
                setError(`Signing initialization failed: ${(error as Error).message}`);
            }
        };

        if (typeof window !== 'undefined') {
            initializeClient();
        }
    }, []);

    // Embed the signing iframe when response and client are ready
    useEffect(() => {
        if (response?.success && response.embedded && helloSignClient && embedContainerRef.current) {
            try {
                // Append client_id to sign_url if missing
                const urlObj = new URL(response.embedded.sign_url);
                if (!urlObj.searchParams.has('client_id') && env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID) {
                    urlObj.searchParams.append('client_id', env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID);
                }
                const signUrl = urlObj.toString();

                helloSignClient.open(signUrl, {
                    container: embedContainerRef.current,
                    skipDomainVerification: true,
                    height: 800,
                });
            } catch (err) {
                console.error("Error opening HelloSign:", err);
                setError(`Failed to initialize the signing experience. (${(err as Error).message})`);
            }
        }
    }, [response, helloSignClient]);

    // Handles both signatureId and email lookup
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            let sigId = signatureId;
            // If email is provided, fetch signatureId for that email
            if (email) {
                const res = await fetch(`/api/esignature?email=${encodeURIComponent(email)}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Could not find signature for this email");
                }
                // Find the first signature for this email
                const foundSig = (data.signatures || []).find((sig: any) => sig.signerEmailAddress === email);
                if (!foundSig) {
                    throw new Error("No signature found for this email");
                }
                sigId = foundSig.signatureId;
            }
            if (!sigId) throw new Error("Signature ID is required");
            // Now fetch the sign URL using the signatureId
            const res2 = await fetch(
                `/api/dropbox/signature_request/sign_url?signature_id=${sigId}&client_id=${env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID}`
            );
            const data2 = await res2.json();
            if (!res2.ok) {
                const errorMessage = data2.error?.errorMsg || data2.error || "Error retrieving embedded sign URL";
                throw new Error(`Embed Sign URL: ${errorMessage} (Status: ${res2.status})`);
            }
            setResponse(data2);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="size-full min-h-screen">
            <div className="mb-4">
                <p className="mt-4 mb-4 text-center text-sm">
                    Enter a signature ID or Email Address to retrieve the document.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-row items-end justify-center gap-2">
                    <div className="flex w-64 flex-col">
                        <label
                            htmlFor="signatureId"
                            className="mb-1 block text-sm font-medium "
                        >
                            Signature ID
                        </label>
                        <input
                            id="signatureId"
                            type="text"
                            value={signatureId}
                            onChange={(e) => setSignatureId(e.target.value)}
                            placeholder="e.g. 50e3542f738adfa7ddd4..."
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <p className="p-2 text-xs">-OR-</p>
                    <div className="flex w-64 flex-col">
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="participant@email.com"
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || (!signatureId && !email)}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 p-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loading />
                        ) : (
                            "Get Sign URL"
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div className="mt-6 rounded-md border border-red-500 bg-red-100 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            {response?.success && response.embedded && (
                <div className="mt-6 size-full space-y-4">
                    {/** In development, this will show but in production it won't show */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mx-6 space-y-4 rounded-xl border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-900">

                            <div>
                                <h4 className="mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">Sign URL</h4>
                                {/** Show only first 20 and last 5 characters */}
                                <a
                                    href={response.embedded.sign_url.slice(-5)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="break-words text-sm text-white transition-colors duration-200 hover:text-blue-200 hover:underline dark:text-blue-600"
                                >
                                    {response.embedded.sign_url}
                                </a>
                            </div>
                        </div>
                    )}
                    <div className="mx-6 mb-6">
                        <div className="mb-4 flex flex-row items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                Embedded Signing
                            </h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    Expires At:
                                </span>
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    {new Date(response.embedded.expires_at * 1000).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div
                            ref={embedContainerRef}
                            className="h-[800px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Force Next.js to render this page dynamically at runtime (not prerender)
export const dynamic = "force-dynamic";