import { describe, it, expect } from 'vitest'
import { generateParticipantEmail, generateModeratorEmail, generateICSIndiana } from '@/lib/utils/emailUtilities'
import type { TimeDetails } from '@/lib/types/timeDetails.types'

describe('emailUtilities', () => {
  const timeDetails: TimeDetails = {
    meetingStartTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    meetingEndTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
  }

  it('generates participant email HTML containing the meeting URL and formatted date', () => {
    const html = generateParticipantEmail({ firstName: 'Test', lastName: 'Host' } as any, timeDetails, 'https://whereby.example/join/abc')
    expect(html).toContain('Join Meeting')
    expect(html).toContain('https://whereby.example/join/abc')
  })

  it('generates moderator email HTML containing the meeting URL and formatted date', () => {
    const html = generateModeratorEmail({ firstName: 'Mod', lastName: 'One' } as any, timeDetails, 'https://whereby.example/host/abc')
    expect(html).toContain('Host Meeting')
    expect(html).toContain('https://whereby.example/host/abc')
  })

  it('generates an ICS string with organizer and optionally attendee', () => {
    const emailInfo = {
      uid: 'uid-1',
      startDate: timeDetails.meetingStartTime,
      endDate: timeDetails.meetingEndTime,
      title: 'Test Meeting',
      description: 'desc',
      url: 'https://whereby.example/join/abc',
      organizerEmail: 'host@example.com',
      organizerName: 'Host Name',
    }

    const ics = generateICSIndiana(emailInfo as any)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('ORGANIZER;CN=Host Name')

    // with attendee
    const icsWithAttendee = generateICSIndiana({ ...emailInfo, participantEmail: 'p@example.com', participantName: 'Attendee' } as any)
    expect(icsWithAttendee).toContain('ATTENDEE;CN=Attendee')
  })
})
