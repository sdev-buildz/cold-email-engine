import { initDb } from '@packages/db'
import type { WorkflowStatus } from '../util/types'
import { builder } from './lib/builder'
import { ffNdays } from './util/fast-forward'

/** DB client */
const db = initDb()

const WorkflowStatusRef = builder.objectRef<WorkflowStatus>('WorkflowStatus')
WorkflowStatusRef.implement({
  fields: (t) => ({
    currentTime: t.expose('currentTime', {
      type: 'DateTime',
    }),
    waitIntervalDays: t.exposeInt('waitIntervalDays'),
  }),
})

builder.queryField('workflowStatus', (t) =>
  t.field({
    type: WorkflowStatusRef,
    resolve: () => db.orm.public.WorkflowStatus.first(),
  })
)

builder.mutationField('fastForward', (t) =>
  t.field({
    description:
      'Fast forward the current time by the specified number of days',
    args: {
      days: t.arg.int({ required: true }),
    },
    type: WorkflowStatusRef,
    resolve: async (_, { days }) => {
      const workflowStatus = await db.orm.public.WorkflowStatus.first()
      if (!workflowStatus) {
        throw new Error('Workflow status is not configured')
      }

      await ffNdays(days)

      return db.orm.public.WorkflowStatus.where({
        id: workflowStatus.id,
      }).first()
    },
  })
)

builder.mutationField('configureWaitInterval', (t) =>
  t.field({
    description: 'Configure the number of days to wait between emails',
    args: {
      days: t.arg.int({ required: true }),
    },
    type: WorkflowStatusRef,
    resolve: async (_, { days }) => {
      const workflowStatus = await db.orm.public.WorkflowStatus.first()
      if (!workflowStatus) {
        throw new Error('Workflow status is not configured')
      }

      return db.orm.public.WorkflowStatus.where({
        id: workflowStatus.id,
      }).update({
        waitIntervalDays: days,
      })
    },
  })
)
