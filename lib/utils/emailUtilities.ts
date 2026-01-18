import { EmailInformation } from "@/lib/types/emailInformation.types";
import { Moderator } from "@/lib/types/moderator";
import { TimeDetails } from "@/lib/types/timeDetails.types";

export function formatMeetingDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
const emailButtonStyle = [
  "display:flex",
  "align-items:center",
  "border-radius:0.375rem",
  "background:#6366f1",
  "padding:8px 12px",
  "font-size:0.875rem",
  "font-weight:500",
  "color:#fff",
  "box-shadow:0 1px 2px 0 rgba(16,24,40,0.05)",
  "transition:all 0.2s",
  "text-decoration:none",
  "margin:12px 0",
].join(";");

export function generateParticipantEmail(
  moderator: Moderator,
  timeDetails: TimeDetails,
  meetingUrl: string
): string {
  const name = `${moderator.firstName ?? "Maelewano"} ${moderator.lastName ?? "Platform"}`;
  const startDate = formatMeetingDate(timeDetails.meetingStartTime);
  return `
        <Html lang="en">
            <h1>Meeting Invitation</h1>
            <div>
                <p>Hi,</p>
                <p>You have been invited to a meeting on the <b>${name}</b>.</p>
            </div>
            <p><b>Details:</b></p>
            <div style="margin-left:1em;">You have been invited to a meeting on <b>${startDate}</b>.</div>
            <button style="margin: 16px 0;">
                            <a href="${meetingUrl}" style="${emailButtonStyle}">Join Meeting</a>
            </button>
            <p><strong>Note:</strong> You cannot join the meeting before the set date and time.</p>
        </Html>
    `;
}

export function generateModeratorEmail(
  moderator: Moderator,
  timeDetails: TimeDetails,
  meetingUrl: string
): string {
  const name = `${moderator.firstName ?? "Maelewano"} ${moderator.lastName ?? "Platform"}`;
  const startDate = formatMeetingDate(timeDetails.meetingStartTime);
  return `
        <Html lang="en">
            <h1>Meeting Scheduled</h1>
            <div>
                <p>Hi,</p>
                <p>You have scheduled a meeting using the <b>${name}</b>.</p>
            </div>
            <p><b>Details:</b></p>
            <div style="margin-left:1em;">You have created a meeting for <b>${startDate}</b>.</div>
            <button style="margin: 16px 0;">
                            <a href="${meetingUrl}" style="${emailButtonStyle}">Host Meeting</a>
            </button>
            <p><strong>Note:</strong> You can host the meeting before the set date and time.</p>
        </Html>
    `;
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
ORGANIZER;CN=${emailInformation.organizerName ?? "Organizer"}:mailto:${emailInformation.organizerEmail}
${emailInformation.participantEmail && emailInformation.participantName ? `ATTENDEE;CN=${emailInformation.participantName};RSVP=TRUE:mailto:${emailInformation.participantEmail}` : ""}
END:VEVENT
END:VCALENDAR`;
}
