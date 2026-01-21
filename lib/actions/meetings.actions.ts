'use server'
import { env } from '@/env.mjs';
import { logger } from '@/lib/utils/logger';
import { MeetingData } from '@/lib/types/meetingData.types';

const apiKey = env.APP_SECRET_KEY;

export async function createMeetingLink(meetingData: MeetingData) {
    if (!apiKey) throw new Error("APP_SECRET_KEY is missing");

    // Prefer explicit public app URL, fall back to Vercel-provided URL when available.
    const fallbackBase = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
    const baseUrl = env.NEXT_PUBLIC_APP_URL || fallbackBase || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/createMeetingLink`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify(meetingData),
        cache: 'no-store'
    })
    if (!response.ok) {
        const text = await response.text().catch(() => '<no body>');
        logger.error('[createMeetingLink] fetch failed', { status: response.status, body: text, url: `${baseUrl}/api/createMeetingLink` });
    }
    return await response.json();
}

export async function createMeetingRoom(token: string) {
    if (!apiKey) throw new Error("APP_SECRET_KEY is missing");

    const response =  await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/createMeetingRoom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify(token),
        cache: 'no-store'
    })
    return await response.json();
}