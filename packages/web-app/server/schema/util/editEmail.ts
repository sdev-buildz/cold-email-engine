import { initDb } from '@packages/db'
import type { Models } from '@packages/db/types'
import type { Prospect } from '../../util/types'

const db = initDb()

const sequenceStatus = {
  new: 'new',
  first_sent: 'first_sent',
  follow_up_1_sent: 'follow_up_1_sent',
  follow_up_2_sent: 'follow_up_2_sent',
  follow_up_3_sent: 'follow_up_3_sent',
  replied: 'replied',
  bounced: 'bounced',
  unsubscribed: 'unsubscribed',
  deactivated: 'deactivated',
} satisfies Record<Prospect['status'], Prospect['status']>
function getNextEnumValue<T extends Record<string, string>>(
  enumObj: T,
  currentValue: T[keyof T]
): T[keyof T] | undefined {
  const values = Object.values(enumObj) as T[keyof T][]
  const currentIndex = values.indexOf(currentValue)

  if (currentIndex === -1) return undefined

  // Optional: Use % values.length to loop back to the beginning
  const nextIndex = (currentIndex + 1) % values.length
  return values[nextIndex]
}

/**
 * Replaces the placeholders in template emails
 */
export const editEmailXmls = (
  email: Pick<Models.public_EmailTemplate, 'body' | 'subject'>,
  prospect: Prospect
) => {
  const processString = (str: string) =>
    str
      .replaceAll('<name>', prospect.name)
      .replaceAll('<email>', prospect.email)
      .replaceAll('<company>', prospect.company)
      .replaceAll('<role>', prospect.role)

  return {
    ...email,
    body: processString(email.body),
    subject: processString(email.subject),
  }
}

/**
 *write email
 */
export const writeEmail = async (prospect: Prospect) => {
  const nextStatus = getNextEnumValue(sequenceStatus, prospect.status)

  if (nextStatus === undefined) {
    throw new Error(`Unknown prospect status: ${prospect.status}`)
  }

  const emailTemplate = await db.orm.public.EmailTemplate.where({
    sequence_state: nextStatus,
  }).first()
  if (!emailTemplate) {
    return
  }

  const newEmail = editEmailXmls(emailTemplate, prospect)

  return { newEmail, nextStatus }
}
