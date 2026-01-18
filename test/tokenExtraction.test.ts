import { describe, it, expect } from 'vitest'
import { getToken } from '@/lib/utils/tokenExtraction'

function mockSearchParams(value: string | null) {
  return { get: (k: string) => (k === 'token' ? value : null) }
}

describe('getToken utility', () => {
  it('returns token from searchParams when present', () => {
    expect(getToken(mockSearchParams('abc123'), undefined)).toBe('abc123')
  })

  it('falls back to locationSearch when searchParams absent', () => {
    expect(getToken(mockSearchParams(null), '?token=xyz789')).toBe('xyz789')
  })

  it('returns null when no token present', () => {
    expect(getToken(mockSearchParams(null), null)).toBeNull()
  })
})
