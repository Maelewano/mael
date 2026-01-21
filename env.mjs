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
        CI: z
            .enum(["true", "false"])
            .default("false")
            .optional()
            .transform((v) => v === "true"),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        DEBUG_LOGS: z
            .enum(["true", "false"])
            .default("false")
            .optional()
            .transform((v) => v === "true"),
        APP_SECRET_KEY: z.string(),
        RESEND_API_KEY: z.string(),
        NEXT_DROPBOX_SIGN_API_KEY: z.string(),
        INVITE_SECRET_KEY: z.string(),
        MONGODB_URI: z.string(),
        NGROK_AUTHTOKEN: z.string().optional(),
        SMTP_HOST: z.string().optional(),
        SMTP_PORT: z.string().optional(),
        SMTP_USER: z.string().optional(),
        SMTP_PASS: z.string().optional(),
        NEXT_PUBLIC_EMAIL_HOST: z.string().optional(),
        NEXT_PUBLIC_EMAIL_PORT: z.string().optional(),
        NEXT_PUBLIC_EMAIL_SECURE: z.string().optional(),
        NEXT_PUBLIC_EMAIL_USER: z.string().optional(),
        NEXT_PUBLIC_EMAIL_PASSWORD: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_WHEREBY_API_KEY: z.string(),
        NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: z.string(),
        NEXT_PUBLIC_JITSI_APP_ID: z.string(),
        NEXT_PUBLIC_JITSI_API_KEY: z.string(),
        NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID: z.string(),
        NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN: z.string(),
        NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL: z.string(),
    },
    runtimeEnv: {
        ANALYZE: process.env.ANALYZE,
        ENABLE_SOURCE_MAPS: process.env.ENABLE_SOURCE_MAPS,
        CI: process.env.CI,
        NODE_ENV: process.env.NODE_ENV,
        DEBUG_LOGS: process.env.DEBUG_LOGS,
        APP_SECRET_KEY: process.env.APP_SECRET_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        NEXT_DROPBOX_SIGN_API_KEY: process.env.NEXT_DROPBOX_SIGN_API_KEY,
        INVITE_SECRET_KEY: process.env.INVITE_SECRET_KEY,
        MONGODB_URI: process.env.MONGODB_URI,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_WHEREBY_API_KEY: process.env.NEXT_PUBLIC_WHEREBY_API_KEY,
        NEXT_PUBLIC_JITSI_API_KEY: process.env.NEXT_PUBLIC_JITSI_API_KEY,
        NGROK_AUTHTOKEN: process.env.NGROK_AUTHTOKEN,
        NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: process.env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL,
        NEXT_PUBLIC_JITSI_APP_ID: process.env.NEXT_PUBLIC_JITSI_APP_ID,
        NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID: process.env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID,
        NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN: process.env.NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN,
        NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL: process.env.NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        NEXT_PUBLIC_EMAIL_HOST: process.env.NEXT_PUBLIC_EMAIL_HOST,
        NEXT_PUBLIC_EMAIL_PORT: process.env.NEXT_PUBLIC_EMAIL_PORT,
        NEXT_PUBLIC_EMAIL_SECURE: process.env.NEXT_PUBLIC_EMAIL_SECURE,
        NEXT_PUBLIC_EMAIL_USER: process.env.NEXT_PUBLIC_EMAIL_USER,
        NEXT_PUBLIC_EMAIL_PASSWORD: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
});