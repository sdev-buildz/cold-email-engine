import { initDb } from '@packages/db'
import { Temporal } from 'temporal-polyfill'
import 'temporal-polyfill/full/global'
import { writeEmail } from './editEmail'
import { getProspectsToday } from './getProspectsToday'
import { provideReplies } from './provideReplies'

/** DB client */
const db = initDb()

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
  const waitFromDate = new Date(currentTime.epochMilliseconds)
  waitFromDate.setDate(waitFromDate.getDate() - waitDays)
  const waitFromTemporal = Temporal.Instant.from(waitFromDate.toISOString())

  const prospectsToSend = await getProspectsToday()

  console.log('sending emails for', prospectsToSend.length, 'prospects')

  // Send emails
  for (const prospect of prospectsToSend) {
    const newEmailData = await writeEmail(prospect)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nextStatus: any
    if (newEmailData) {
      nextStatus = newEmailData.nextStatus
      const { newEmail } = newEmailData
      sendEmail()
    }
    await db.orm.public.Prospect.where({ id: prospect.id }).update({
      status: nextStatus,
      lastSentAt: currentTime,
    })
  }

  // Randomly provide replies.\
  await provideReplies()

  // forward the current time pointer
  await db.orm.public.WorkflowStatus.where({ id: workflowStatus.id }).update({
    currentTime: currentTime
      .toZonedDateTimeISO('UTC')
      .add({ days: 1 })
      .toInstant(),
  })
}

/**
 * Fast forwards the stimulation time by N days
 */
export const ffNdays = async (days: number) => {
  console.log('ff ', days, ' days')
  for (let i = 0; i < days; i++) {
    console.log('ff day ', i + 1)
    await fastForwardOneDay()
  }
}

async function sendEmail() {
  // batches emails to send and sends at the end
}
