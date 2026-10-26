import { Temporal } from 'temporal-polyfill'
import { describe, expect, it } from 'vitest'
import { addDays } from './resolveDateTime'

describe('addDays', () => {
  it('adds calendar days to a Temporal.Instant in UTC', () => {
    const instant = Temporal.Instant.from('2027-01-01T12:30:00Z')

    expect(addDays(instant, 3).toString()).toBe('2027-01-04T12:30:00Z')
  })
})
