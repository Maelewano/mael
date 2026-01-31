import { render } from '@react-email/render';
import { Resend } from 'resend';
import { inspect } from 'util';
import { logger } from '@/lib/utils/logger';

import SignatureEmail from '@/app/api/helpers/signatureEmail';
import { errorResponse, successResponse } from '@/app/api/helpers/responseHelper';
import { EmailInformation } from '@/lib/types/emailInformation.types';
import { env } from '@/env.mjs';

const resend = new Resend(env.RESEND_API_KEY);

export async function resendSignatureService(emailInformation: EmailInformation) {
    const html = await render(SignatureEmail(emailInformation), { pretty: true });
    const to = emailInformation.participantEmail ?? emailInformation.organizerEmail;

    if (!to || !html) {
        return errorResponse("Missing required email fields", 400);
    }

    try {
        await resend.emails.send({
            from: 'Mael <info@mael-group.com>',
            to,
            subject: emailInformation.title ?? 'Signature Request',
            html,
        });

        return successResponse('Signature Email Sent Successfully');
    }
    catch (error: unknown) {
        try {
            logger.error("Resend Signature Error (inspect):", inspect(error, { showHidden: true, depth: 5 }));
        } catch (inspectErr) {
            logger.error("Resend Signature Error (failed to inspect):", error);
        }

        if (error instanceof Error) {
            logger.error("Resend Signature Error stack:", error.stack);
            return errorResponse(error.message, 500);
        }

        return errorResponse("Internal Server Error", 500);
    }
}
