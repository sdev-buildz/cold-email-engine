import { initDb } from '@packages/db'
import type { Prospect } from '../../util/types'
import { writeEmail } from './editEmail'

/** DB client */
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

/**
 * Fast forwards the stimulation time by one day.
 */
export const fastForwardOneDay = async () => {
  const workflowStatus = await db.orm.public.WorkflowStatus.first()

  if (!workflowStatus) {
    throw new Error('Workflow status is not configured')
  }

  const { currentTime, waitIntervalDays: waitDays } = workflowStatus

  /** If sent after this date, wait more days */
  const waitFrom = new Date()
  waitFrom.setDate(waitFrom.getDate() - waitDays)

  const prospectsToSend = await db.orm.public.Prospect.where({
    isDeactivated: false,
    lastSentAt: {
      lt: waitFrom, // "lt" means less than (before 3 days ago)
    },
  }).all()

  // Send emails
  for (const prospect of prospectsToSend) {
    const { newEmail, nextStatus } = await writeEmail(prospect)
    sendEmail()
    await db.orm.public.Prospect.where({ id: prospect.id }).update({
      status: nextStatus,
      lastSentAt: currentTime,
    })
  }

  // Randomly provide replies.
}

/**
 * Fast forwards the stimulation time by N days
 */
export const ffNdays = async (days: number) => {
  for (let i = 0; i < days; i++) {
    await fastForwardOneDay()
  }
}

async function sendEmail() {
  // batches emails to send and sends at the end
}
