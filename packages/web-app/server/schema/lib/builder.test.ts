import { describe, expect, it } from 'vitest'
import { resolveDateTime } from './builder'

describe('resolveDateTime', () => {
  it('converts Temporal.Instant epoch milliseconds to a Date', () => {
    const date = resolveDateTime({ epochMilliseconds: Date.UTC(2027, 0, 1) })

    expect(date).toBeInstanceOf(Date)
    expect(date.toISOString()).toBe('2027-01-01T00:00:00.000Z')
  })
})
