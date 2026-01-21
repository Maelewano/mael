import { render } from '@react-email/render';
import { Resend } from 'resend';
import { inspect } from 'util';
import { logger } from '@/lib/utils/logger';

import Email from '@/app/api/helpers/email';
import { errorResponse, successResponse } from '@/app/api/helpers/responseHelper';
import { EmailInformation } from '@/lib/types/emailInformation.types';
import { generateICSIndiana } from '@/lib/utils/emailUtilities';
import { env } from '@/env.mjs';

const resend = new Resend(env.RESEND_API_KEY);

export async function resendService(emailInformation: EmailInformation) {
    const html = await render(Email(emailInformation), {pretty: true});
    const icsContent = generateICSIndiana(emailInformation);
    const to = emailInformation.participantEmail ?? emailInformation.organizerEmail;

    if (!to || !icsContent || !html) {
        return errorResponse("Missing required email fields", 400);
    }

    try {
        await resend.emails.send({
            from: 'Mael <info@mael-group.com>',
            to,
            subject: 'Scheduled Meeting Invite',
            html,
            attachments: [
                {
                    filename: 'invite.ics',
                    content: Buffer.from(icsContent).toString('base64'),
                    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
                },
            ],
        });

        return successResponse('Email Sent Successfully');
    }
    catch (error: unknown) {
        // Log full error object and stack for debugging in Vercel logs
        try {
                logger.error("Resend Error (inspect):", inspect(error, { showHidden: true, depth: 5 }));
        } catch (inspectErr) {
                logger.error("Resend Error (failed to inspect):", error);
        }

        if (error instanceof Error) {
                logger.error("Resend Error stack:", error.stack);
            return errorResponse(error.message, 500);
        }

        // Fallback for non-Error shapes
        return errorResponse("Internal Server Error", 500);
    }
}
