import type { Temporal } from 'temporal-polyfill'
import 'temporal-polyfill/full/global'

/** Convert a Temporal.Instant value to the Date used by the GraphQL schema. */
export const resolveDateTime = (value: Temporal.Instant): Date => {
  console.log(
    'value =',
    value,
    '\n typeof value =',
    typeof value,
    '\n value.epochMilliseconds',
    value.epochMilliseconds
  )

  return new Date(value.epochMilliseconds)
}

/** Add calendar days to a Temporal.Instant in UTC. */
export function addDays(
  instant: Temporal.Instant,
  days: number
): Temporal.Instant {
  return instant.toZonedDateTimeISO('UTC').add({ days }).toInstant()
}
