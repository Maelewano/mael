import { sendEmail } from '@/app/api/resend/sendEmail';
import { env } from '@/env.mjs';
import { UserType } from '@/lib/enums/UserType.enum';
import {
    generateModeratorEmail,
    generateModeratorToken,
    generateParticipantEmail,
    generateParticipantToken
} from '@/lib/utils';
import { EmailInformation, MeetingData, Moderator, Participant, TimeDetails } from '@/types/meetingData';


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
    const moderatorMeetingUrl: string = generateMeetingUrl(moderatorToken, UserType.MODERATOR)
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
    await sendEmail(moderatorEmailInfo);
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
        const participantMeetingUrl: string = generateMeetingUrl(token, UserType.PARTICIPANT);

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
        await sendEmail(participantEmailInfo);
    }
}

export function generateMeetingUrl(token: string, userType: UserType) {
    const meetingRoom = userType === UserType.MODERATOR ? 'host' : 'join';
    return `${env.NEXT_PUBLIC_APP_URL}/public-meeting/${meetingRoom}?token=${token}`;
}