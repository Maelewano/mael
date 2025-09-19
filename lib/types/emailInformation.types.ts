export interface EmailInformation {
    uid: string
    title: string
    body: string;
    to: string;
    startDate: string;
    endDate: string;
    description: string;
    url: string;
    organizerEmail: string;
    organizerName?: string
    participantName?: string;
    participantEmail?: string;
}