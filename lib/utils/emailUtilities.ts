import { EmailInformation } from '@/lib/types/emailInformation.types';
import { TimeDetails } from '@/lib/types/timeDetails.types';
import { Moderator } from '@/lib/types/moderator';

export function generateParticipantEmail(
    moderator: Moderator,
    timeDetails: TimeDetails,
    meetingUrl: string
): string {
    const name = `${moderator.firstName ?? "John"} ${moderator.lastName ?? "Stamos"}`;
    const startDate = new Date(timeDetails.meetingStartTime).toDateString();
    return `<h1>You have been invited</h1>
    <p>You have been invited to join ${name} for a meeting on ${startDate}. Here is your join link
        <a href=${meetingUrl}>join</a>
    </p>
    <p>
        <strong>Note:</strong> You cannot join before the set date and time
    </p>`;
}

export function generateModeratorEmail(
    timeDetails: TimeDetails,
    meetingUrl: string
): string {
    const startDate = new Date(timeDetails.meetingStartTime).toDateString();
    return `<h1>You have been invited</h1>
    <p>You have created a meeting on ${startDate}. Here is your join link
        <a href=${meetingUrl}>join</a>
    </p>
    <p>
        <strong>Note:</strong> You cannot join before the set date and time
    </p>`;
}

export function checkMeetingData() {
    if (Date.now() > new Date().getTime()) {
        return false;
    }
}

/**
 * Generate a timezone-aware ICS string for calendar invites
 */
export function generateICSIndiana(emailInformation: EmailInformation) {
    const timeZone = "America/Indiana/Indianapolis";
    const startDate = new Date(emailInformation.startDate);
    const endDate = new Date(emailInformation.endDate);
    const formatDate = (date: Date) =>
        date.toISOString().replace(/[-:]/g, "").split(".")[0]; // e.g. 20250820T150000

    const dtStamp =
        new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";


    // ATTENDEE;CN=${emailInformation.participantName};RSVP=TRUE:mailto:${emailInformation.participantEmail}

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your App//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VTIMEZONE
TZID:${timeZone}
X-LIC-LOCATION:${timeZone}
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:${emailInformation.uid}
DTSTAMP:${dtStamp}
DTSTART;TZID=${timeZone}:${formatDate(startDate)}
DTEND;TZID=${timeZone}:${formatDate(endDate)}
SUMMARY:${emailInformation.title}
DESCRIPTION:${emailInformation.description}
LOCATION:${emailInformation.url}
STATUS:CONFIRMED
ORGANIZER;CN=John:mailto:${emailInformation.organizerEmail}
END:VEVENT
END:VCALENDAR`;
}