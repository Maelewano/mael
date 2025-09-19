import { NextRequest } from 'next/server';
import { generateEmailInformationAndSendEmail } from '@/api/helpers/generateEmailInformationAndSendEmail';
import { errorResponse, successResponse } from '@/api/helpers/responseHelper';
import { MeetingData } from '@/lib/types/meetingData.types';

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