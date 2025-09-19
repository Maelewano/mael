import { TimeDetails } from '@/lib/types/timeDetails';
import { Moderator } from '@/lib/types/moderator';
import { Participant } from '@/lib/types/participant';

export interface MeetingData {
    meetingId: string;
    participants: Participant[];
    moderator: Moderator
    timeDetails: TimeDetails;
    summary: string;
    isLocked: boolean;
    requireKnocking: boolean;
}