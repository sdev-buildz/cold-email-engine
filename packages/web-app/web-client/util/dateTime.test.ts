import { describe, expect, it } from 'vitest'
import { convertDateTimeValues } from './dateTime'

describe('convertDateTimeValues', () => {
  it('converts ISO datetime strings in nested objects and arrays to Dates', () => {
    const result = convertDateTimeValues({
      currentTime: '2027-01-01T00:00:00.000Z',
      emails: [{ sentAt: '2027-01-02T03:04:05+02:00' }],
    })

    expect(result).toEqual({
      currentTime: new Date('2027-01-01T00:00:00.000Z'),
      emails: [{ sentAt: new Date('2027-01-02T03:04:05+02:00') }],
    })
  })

  it('leaves non-datetime strings and invalid date strings unchanged', () => {
    expect(
      convertDateTimeValues({
        status: 'new',
        invalidDate: '2027-99-99T00:00:00Z',
        dateOnly: '2027-01-01',
      })
    ).toEqual({
      status: 'new',
      invalidDate: '2027-99-99T00:00:00Z',
      dateOnly: '2027-01-01',
    })
  })
})
