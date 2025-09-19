import { NextResponse } from 'next/server';
import { env } from '@/env.mjs';
import { errorResponse, successResponse } from '@/api/helpers/responseHelper';
import { DecodedMeeting } from '@/lib/types/decodedMeeting.types';

export async function wherebyService(decodedMeeting: DecodedMeeting) {
    try {
        // Parse request body
        // const requestData: CreateMeetingRequest = await request.json().catch(() => ({}));

        // Get current date and set expiration to 24 hours from now if not provided
        let startDate: Date;
        let endDate: Date;

        if (decodedMeeting.meetingStartDate) {
            startDate = new Date(decodedMeeting.meetingStartDate);
        } else {
            startDate = new Date();
        }

        if (decodedMeeting.meetingEndDate) {
            endDate = new Date(decodedMeeting.meetingEndDate);
        } else {
            endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 24);
        }

        // Ensure dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
            );
        }

        // Ensure end date is after start date
        if (endDate <= startDate) {
            return NextResponse.json(
                { error: "End date must be after start date" },
                { status: 400 }
            );
        }

        // Format dates for the API
        const startDateISO = startDate.toISOString();
        const endDateISO = endDate.toISOString();

        // Get app origin for domain restriction
        const appOrigin = env.NEXT_PUBLIC_APP_URL;

        // Make the request to Whereby API from the server
        const response = await fetch("https://api.whereby.dev/v1/meetings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.NEXT_PUBLIC_WHEREBY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roomNamePrefix: "aegis-meeting-",
                roomMode: "normal",
                isLocked: true,
                startDate: startDateISO,
                endDate: endDateISO,
                fields: ["hostRoomUrl", "roomUrl"],
                requireKnocking: true,
                meetingPassword: decodedMeeting.meetingPassword || undefined,
                domainRestriction: {
                    enabled: true,
                    domains: [appOrigin]
                }
            })
        });

        const data = await response.json();
        return successResponse(data, 200, "Successfully created whereby meeting room")
    } catch (error) {
        console.error("Error creating Whereby room:", error);
        return errorResponse("Failed to create meeting room");
    }
}
