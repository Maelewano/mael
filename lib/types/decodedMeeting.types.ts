export interface DecodedMeeting {
    email: string;
    id: string;
    phoneNumber: string;
    meetingStartDate: string;
    meetingEndDate: string;
    urlType: string;
    tokenExpiryDate: string;
    meetingPassword?: string;
    error?: string;
}