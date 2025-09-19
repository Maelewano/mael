import { render } from '@react-email/render';
import { Resend } from 'resend';
import { errorResponse, successResponse } from '@/api/helpers/responseHelper';
import { EmailInformationTypes } from '@/lib/types/emailInformation.types';
import Email from '@/api/helpers/email';
import { generateICSIndiana } from '@/lib/utils/emailUtilities';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendService(emailInformation: EmailInformationTypes) {
    const html = await render(Email(emailInformation), {pretty: true});
    const icsContent = generateICSIndiana(emailInformation);
    const to = emailInformation.participantEmail ?? emailInformation.organizerEmail;

    if (!to || !icsContent || !html) {
        return errorResponse("Missing required email fields", 400);
    }

    try {
        await resend.emails.send({
            from: 'Aegis <info@eandncorp.com>',
            to,
            subject: 'Project Meeting Invite',
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
        // Narrow to a specific shape if possible
        if (error instanceof Error) {
            console.error("Resend Error:", error.message);
            return errorResponse(error.message, 500);
        } else if (typeof error === "object" && error !== null && "message" in error) {
            console.error("Resend Error object:", (error as any).message);
            return errorResponse((error as any).message, 500);
        } else {
            console.error("Unknown Resend error:", error);
            return errorResponse("Internal Server Error", 500);
        }
    }
}
