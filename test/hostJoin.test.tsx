import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Provide a mutable token value via global so our mocked `useSearchParams`
// can read it when the component calls it.
declare global {
  var __TEST_SEARCH_PARAMS_TOKEN: string | null
}

beforeEach(() => {
  // reset token between tests
  globalThis.__TEST_SEARCH_PARAMS_TOKEN = null
  vi.resetModules()
})

// Mock next/navigation to return a router and a dynamic searchParams getter
vi.mock('next/navigation', async () => {
  return {
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => ({ get: (k: string) => (k === 'token' ? (globalThis as any).__TEST_SEARCH_PARAMS_TOKEN : null) }),
  }
})

// Mock environment variables module to avoid runtime validation in tests
vi.mock('@/env.mjs', async () => ({
  env: {
    NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: 'https://whereby.example',
    NEXT_PUBLIC_APP_URL: 'https://app.example',
    NEXT_PUBLIC_WHEREBY_API_KEY: 'dummy',
    NEXT_PUBLIC_JITSI_APP_ID: 'dummy',
    NEXT_PUBLIC_JITSI_API_KEY: 'dummy',
    NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID: 'dummy',
    NEXT_PUBLIC_DROPBOX_SIGN_DOMAIN: 'dummy',
    NEXT_PUBLIC_DROPBOX_SIGN_CALLBACK_URL: 'https://callback.example',
  },
}))

// Mock the createMeetingRoom action so components don't call the real API
const mockCreateMeetingRoom = vi.fn(async (token: string) => {
  return { data: { hostRoomUrl: `https://whereby.example/host/mael-meeting-${token}`, roomUrl: `https://whereby.example/join/mael-meeting-${token}` } }
})

vi.mock('@/lib/actions/meetings.actions', async () => ({
  createMeetingRoom: mockCreateMeetingRoom,
}))

describe('Host and Join pages', () => {
  it('Host page calls createMeetingRoom and shows iframe', async () => {
    const token = 'host-token-123'
    globalThis.__TEST_SEARCH_PARAMS_TOKEN = token

    const { default: HostPage } = await import('../app/host/page')

    render(React.createElement(HostPage))

    await waitFor(() => {
      expect(mockCreateMeetingRoom).toHaveBeenCalledWith(token)
    })

    // After createMeetingRoom resolves, the iframe should be present
    await waitFor(() => {
      const iframe = screen.getByTitle(/Video Meeting \(Host\)|Video Meeting/i)
      expect(iframe).toBeInTheDocument()
    })
  })

  it('Join page calls createMeetingRoom and shows iframe', async () => {
    const token = 'participant-token-456'
    globalThis.__TEST_SEARCH_PARAMS_TOKEN = token

    const { default: JoinPage } = await import('../app/join/page')

    render(React.createElement(JoinPage))

    await waitFor(() => {
      expect(mockCreateMeetingRoom).toHaveBeenCalledWith(token)
    })

    await waitFor(() => {
      const iframe = screen.getByTitle(/Video Meeting/i)
      expect(iframe).toBeInTheDocument()
    })
  })
})
