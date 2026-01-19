'use server'
import { env } from '@/env.mjs';
import { MeetingData } from '@/lib/types/meetingData.types';

const apiKey = env.APP_SECRET_KEY;

export async function createMeetingLink(meetingData: MeetingData) {
    if (!apiKey) throw new Error("APP_SECRET_KEY is missing");

    const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/createMeetingLink`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify(meetingData),
        cache: 'no-store'
    })
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