import { Metadata } from "next";

export const generateMetadata = (path: string): Metadata => {
    const baseMetadata: Metadata = {
        title: "Mael",
        description:
            "Maelewano is a transformative technology showcasing secure remote conferencing and document signing solution.",
        openGraph: {
            url: "https://mael.tech/",
            title: "Mael",
            description:
                "Maelewano is a transformative technology showcasing secure remote conferencing and document signing solution.",
            images: [
                {
                    url: "https://mael.tech/",
                    width: 1200,
                    height: 630,
                    alt: "Mael | Secure Remote Conferencing and Document Signing Solution",
                },
            ],
        },
        icons: {
            icon: "/assets/icons/logo-icon.ico",
        },
    };

    const pageMetadata: Record<string, Metadata> = {
        notFound: {
            title: "404 - Page Not Found",
            description: "The page you are looking for does not exist.",
        },
        whereby: {
            title: "WhereBy | MAEL",
            description: "WhereBy video conferencing platform",
        },
        jitsi: {
            title: "Jitsi | MAEL",
            description: "Jitsi video conferencing platform",
        },
        methodNotAllowed: {
            title: "405 - Method Not Allowed",
            description: "The requested method is not supported for the requested resource.",
        }
    };

    return {
        ...baseMetadata,
        ...(pageMetadata[path] || {}),
    };
};

export const metadata = generateMetadata("base");
