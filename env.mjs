import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        ANALYZE: z
            .enum(["true", "false"])
            .default("false")
            .optional()
            .transform((v) => v === "true"),
        ENABLE_SOURCE_MAPS: z
            .enum(["true", "false"])
            .default("false")
            .transform((v) => v === "true"),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        NGROK_AUTHTOKEN: z.string(),
        NEXT_DROPBOX_SIGN_API_KEY: z.string(),
        NEXT_PUBLIC_EMAIL_HOST: z.string(),
        NEXT_PUBLIC_EMAIL_PORT: z.string(),
        NEXT_PUBLIC_EMAIL_SECURE: z.string(),
        NEXT_PUBLIC_EMAIL_USER: z.string(),
        NEXT_PUBLIC_EMAIL_PASSWORD: z.string(),
        APP_SECRET_KEY: z.string(),
        RESEND_API_KEY: z.string(),
    },
    client: {
        NEXT_PUBLIC_WHEREBY_API_KEY: z.string(),
        NEXT_PUBLIC_JITSI_APP_ID: z.string(),
        NEXT_PUBLIC_JITSI_API_KEY: z.string(),
        NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID: z.string(),
        NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN: z.string(),
        NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL: z.string(),
        NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: z.url(),
        NEXT_PUBLIC_APP_URL: z.url(),
    },
    runtimeEnv: {
        ANALYZE: process.env.ANALYZE,
        ENABLE_SOURCE_MAPS: process.env.ENABLE_SOURCE_MAPS,
        NODE_ENV: process.env.NODE_ENV,
        NGROK_AUTHTOKEN: process.env.NGROK_AUTHTOKEN,
        NEXT_PUBLIC_ADMIN_PASSKEY: process.env.NEXT_PUBLIC_ADMIN_PASSKEY,
        NEXT_PUBLIC_WHEREBY_API_KEY: process.env.NEXT_PUBLIC_WHEREBY_API_KEY,
        NEXT_PUBLIC_JITSI_APP_ID: process.env.NEXT_PUBLIC_JITSI_APP_ID,
        NEXT_PUBLIC_JITSI_API_KEY: process.env.NEXT_PUBLIC_JITSI_API_KEY,
        NEXT_DROPBOX_SIGN_API_KEY: process.env.NEXT_DROPBOX_SIGN_API_KEY,
        NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID: process.env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID,
        NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN: process.env.NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN,
        NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL: process.env.NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL,
        NEXT_PUBLIC_EMAIL_HOST: process.env.NEXT_PUBLIC_EMAIL_HOST,
        NEXT_PUBLIC_EMAIL_PORT: process.env.NEXT_PUBLIC_EMAIL_PORT,
        NEXT_PUBLIC_EMAIL_SECURE: process.env.NEXT_PUBLIC_EMAIL_SECURE,
        NEXT_PUBLIC_EMAIL_USER: process.env.NEXT_PUBLIC_EMAIL_USER,
        NEXT_PUBLIC_EMAIL_PASSWORD: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: process.env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        APP_SECRET_KEY: process.env.APP_SECRET_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
    },
});