import { NextRequest } from 'next/server';

import {
    generateEmailInformationAndSendEmail
} from '@/app/api/workflow/components/getEmailInformationAndSendEmail';
import { errorResponse, successResponse } from '@/lib/helpers/apiHelpers';
import { MeetingData } from '@/types/meetingData';

export async function POST(request: NextRequest) {
    const meetingData = await (await request.json()) as MeetingData;

    try {
        await generateEmailInformationAndSendEmail(meetingData);
        return successResponse('Email sent successfully.');
    } catch(error) {
        console.error(error);
        return errorResponse('Something went wrong. Failed to send email');
    }
}