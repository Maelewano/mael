import jwt from 'jsonwebtoken';
import { logger } from '@/lib/utils/logger';

import { DecodedMeeting } from '@/lib/types/decodedMeeting.types';
import { Moderator } from '@/lib/types/moderator';
import { Participant } from '@/lib/types/participant';
import { TimeDetails } from '@/lib/types/timeDetails.types';
import { URLType } from '@/lib/types/urlType';

const INVITE_SECRET_KEY = process.env.INVITE_SECRET_KEY!;
export function generateInviteToken(data: {
    invitedBy: string;
    inviterRole: string;
    inviterId: string;
    inviteeRole: string;
    expiresAt: Date; // unix timestamp
}) {
    return jwt.sign(data, INVITE_SECRET_KEY!, { expiresIn: "24h" }); // OR use expiresAt manually
}

export function decodeInviteToken(token: string) {
    try {
        const decoded = jwt.verify(token, INVITE_SECRET_KEY!);
        return decoded as {
            invitedBy: string;
            inviterRole: string;
            inviterId: string;
            inviteeRole: string;
            expiresAt: Date
        };
    } catch (err) {
        return null; // invalid or expired
    }
}

export function generateModeratorToken(moderator: Moderator, timeDetails: TimeDetails, tokenExpiryDate: string, meetingId?: string) {
    const meetingData = {
        email: moderator.email,
        id: meetingId,
        phoneNumber: moderator.phoneNumber,
        meetingStartDate: timeDetails.meetingStartTime,
        meetingEndDate: timeDetails.meetingEndTime,
        urlType: URLType.MODERATOR,
        tokenExpiryDate
    }
    return jwt.sign(meetingData, INVITE_SECRET_KEY!, { expiresIn: "24h" }); // OR use expiresAt manually
}

export function generateParticipantToken(participant: Participant, timeDetails: TimeDetails, tokenExpiryDate: string, meetingId?: string) {
    const meetingData = {
        email: participant.email,
        id: meetingId,
        phoneNumber: participant.phoneNumber,
        meetingStartDate: timeDetails.meetingStartTime,
        meetingEndDate: timeDetails.meetingEndTime,
        urlType: URLType.PARTICIPANT,
        tokenExpiryDate
    }
    return jwt.sign(meetingData, INVITE_SECRET_KEY!, { expiresIn: "24h" }); // OR use expiresAt manually
}

export function decodeToken(token: string) {
    try {
        return jwt.verify(token, INVITE_SECRET_KEY!) as DecodedMeeting;
    } catch (err) {
        logger.error('Failed to decode token', err);
        return null;
    }
}