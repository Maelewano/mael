import { NextRequest } from 'next/server';
import { inspect } from 'util';
import { logger } from '@/lib/utils/logger';

import { generateEmailInformationAndSendEmail } from '@/app/api/helpers/generateEmailInformationAndSendEmail';
import { errorResponse, successResponse } from '@/app/api/helpers/responseHelper';
import { MeetingData } from '@/lib/types/meetingData.types';

export async function POST(request: NextRequest) {
    const meetingData = await (await request.json()) as MeetingData;
    logger.debug('[createMeetingLink] Received body:', meetingData);

    try {
        await generateEmailInformationAndSendEmail(meetingData);
        return successResponse('Email sent successfully.');
    } catch(error) {
        logger.error('[createMeetingLink] Error while generating/sending emails', error);
        return errorResponse('Something went wrong. Failed to send email');
    }
}