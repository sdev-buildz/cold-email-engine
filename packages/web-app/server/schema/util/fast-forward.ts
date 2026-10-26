import { initDb } from '@packages/db'

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
}
