import { resendService } from '@/api/services/resend/resend.service';
import { env } from '@/env.mjs';
import { EmailInformation } from '@/lib/types/emailInformation.types';
import { MeetingData } from '@/lib/types/meetingData.types';
import { Moderator } from '@/lib/types/moderator';
import { Participant } from '@/lib/types/participant';
import { TimeDetails } from '@/lib/types/timeDetails.types';
import { URLType } from '@/lib/types/urlType';
import { generateModeratorEmail, generateParticipantEmail } from '@/lib/utils/emailUtilities';
import { generateModeratorToken, generateParticipantToken } from '@/lib/utils/tokenUtilities';

export async function generateEmailInformationAndSendEmail(meetingData: MeetingData) {
    const timeDetails: TimeDetails = meetingData.timeDetails;
    const tokenExpiryDate = new Date(timeDetails.meetingEndTime).toISOString();

    await generateModeratorEmailInformationAndSendEmail(meetingData, timeDetails, tokenExpiryDate);
    await generateParticipantEmailInformationAndSendEmail(meetingData, timeDetails, tokenExpiryDate);
}

export async function generateModeratorEmailInformationAndSendEmail(
    meetingData: MeetingData,
    timeDetails: TimeDetails,
    tokenExpiryDate: string) {
    const moderatorData: Moderator = meetingData.moderator;
    const meetingId = meetingData.meetingId;
    const moderatorToken = generateModeratorToken(moderatorData, timeDetails, tokenExpiryDate, meetingId);
    const moderatorMeetingUrl: string = generateMeetingUrl(moderatorToken, URLType.MODERATOR)
    const moderatorEmailInfo: EmailInformation = {
        description: meetingData.summary,
        endDate: timeDetails.meetingEndTime,
        organizerEmail: moderatorData.email,
        startDate: timeDetails.meetingStartTime,
        uid: '123',
        url: moderatorMeetingUrl,
        title: 'Your Meeting Link',
        body: generateModeratorEmail(timeDetails, moderatorMeetingUrl),
        to: moderatorData.email
    } as EmailInformation
    await resendService(moderatorEmailInfo);
}


export async function generateParticipantEmailInformationAndSendEmail(
    meetingData: MeetingData,
    timeDetails: TimeDetails,
    tokenExpiryDate: string) {
    const participantTokenDictionary = new Map<string, string>();
    const participantData: Participant[] = meetingData.participants;
    const meetingId = meetingData.meetingId;

    participantData.every(participant =>
        participantTokenDictionary.set(
            participant.email,
            generateParticipantToken(participant, timeDetails, tokenExpiryDate, meetingId)
        ));


    for (const [email, token] of Array.from(participantTokenDictionary)) {
        const participantMeetingUrl: string = generateMeetingUrl(token, URLType.PARTICIPANT);

        const participantEmailBody = generateParticipantEmail(meetingData.moderator, timeDetails, participantMeetingUrl);
        const participantEmailInfo: EmailInformation = {
            description: meetingData.summary,
            endDate: timeDetails.meetingEndTime,
            organizerEmail: meetingData.moderator.email,
            participantEmail: email,
            startDate: timeDetails.meetingStartTime,
            uid: '123',
            url: participantMeetingUrl,
            title: 'Your Meeting Link',
            body: participantEmailBody,
            to: email
        }
        await resendService(participantEmailInfo);
    }
}

export function generateMeetingUrl(token: string, urlType: URLType) {
    const meetingRoom = urlType === URLType.MODERATOR ? 'host' : 'join';
    return `${env.NEXT_PUBLIC_APP_URL}/public-meeting/${meetingRoom}?token=${token}`;
}