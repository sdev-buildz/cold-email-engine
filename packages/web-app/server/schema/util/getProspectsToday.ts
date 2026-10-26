import { initDb } from '@packages/db'

/** DB client */
const db = initDb()

/**
 * Returns prospects that are being emailed today
 */
export const getProspectsToday = async () => {
  const workflowStatus = await db.orm.public.WorkflowStatus.first()

  if (!workflowStatus) {
    throw new Error('Workflow status is not configured')
  }

  const { currentTime, waitIntervalDays: waitDays } = workflowStatus

  //    Deactivate prospects that have been emailed 3 follow ups
  await db.orm.public.Prospect.where({
    status: 'follow_up_3_sent',
  }).update({ isDeactivated: true, status: 'deactivated' })

  const waitFromDate = new Date(currentTime.epochMilliseconds)
  waitFromDate.setDate(waitFromDate.getDate() - waitDays)
  let prospectsToSend = await db.orm.public.Prospect.where({
    isDeactivated: false,
  }).all()

  prospectsToSend = prospectsToSend.filter((prospect) => {
    const lastSentAt = new Date(prospect.lastSentAt!.epochMilliseconds)
    return lastSentAt < waitFromDate
  })

  return prospectsToSend
}
