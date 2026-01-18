import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, expect } from 'vitest'

// Mock createMeetingLink and env
const mockCreateMeetingLink = vi.fn(async (data) => ({ success: true }))
vi.mock('@/lib/actions/meetings.actions', async () => ({
  createMeetingLink: mockCreateMeetingLink,
}))

vi.mock('@/env.mjs', async () => ({
  env: {
    NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: 'https://whereby.example',
    NEXT_PUBLIC_APP_URL: 'https://app.example',
  },
}))

// Provide a simple crypto.randomUUID for tests
beforeEach(() => {
  vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' })
})

describe('MeetingForm component', () => {
  it('validates and submits a valid meeting', async () => {
    const { default: MeetingForm } = await import('@/app/Components/Scheduler/MeetingForm')
    const { container } = render(React.createElement(MeetingForm))

    // Fill moderator and participant emails (matching placeholders)
    const emailInputs = screen.getAllByPlaceholderText('email@example.com')
    const moderatorEmailInput = emailInputs[0]
    const participantEmailInput = emailInputs[1]
    fireEvent.change(moderatorEmailInput, { target: { value: 'host@example.com' } })
    fireEvent.change(participantEmailInput, { target: { value: 'participant@example.com' } })

    // Fill summary
    const summary = screen.getByPlaceholderText('Enter a brief summary of the meeting purpose')
    fireEvent.change(summary, { target: { value: 'Discussion' } })

    // Provide start and end times at least 10 minutes in future
    const start = new Date(Date.now() + 1000 * 60 * 10)
    const end = new Date(Date.now() + 1000 * 60 * 20)
    // Fill start and end datetime inputs by name attribute
    const startInput = container.querySelector('input[name="timeDetails.meetingStartTime"]') as HTMLInputElement
    const endInput = container.querySelector('input[name="timeDetails.meetingEndTime"]') as HTMLInputElement
    if (!startInput || !endInput) throw new Error('Start or end datetime input not found')
    fireEvent.change(startInput, { target: { value: start.toISOString().slice(0, 16) } })
    fireEvent.change(endInput, { target: { value: end.toISOString().slice(0, 16) } })

    // Submit the form
    const form = container.querySelector('form')
    if (!form) throw new Error('Form element not found')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockCreateMeetingLink).toHaveBeenCalled()
    })
  })
})
