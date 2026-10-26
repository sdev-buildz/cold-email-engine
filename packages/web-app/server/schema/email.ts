import { initDb } from '@packages/db'
import { addDays } from '../util/resolveDateTime'
import type { EmailRecord, Prospect, WorkflowStatus } from '../util/types'
import { builder } from './lib/builder'

/** DB client */
const db = initDb()

const EmailRecordRef = builder.objectRef<EmailRecord>('EmailRecord')
const ProspectRef = builder.objectRef<Prospect>('Prospect')

ProspectRef.implement({
  description: 'A Prospect',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    company: t.exposeString('company'),
    role: t.exposeString('role'),
    timezone: t.exposeString('timezone'),
    status: t.exposeString('status'),
    waitDays: t.exposeInt('waitDays'),
    isDeactivated: t.exposeBoolean('isDeactivated'),
    sentEmails: t.field({
      type: [EmailRecordRef],
      resolve: async (parent) => {
        return await db.orm.public.EmailRecord.where({
          prospectId: parent.id,
        }).all()
      },
    }),
    nextEmail: t.field({
      type: EmailRecordRef,
      resolve: async (parent) => {
        if (typeof parent?.nextEmailId !== 'number') {
          return null
        }

        const [nextEmail] = await db.orm.public.EmailRecord.where({
          id: parent.nextEmailId,
        }).all()

        return nextEmail ?? null
      },
    }),
    replyEmail: t.field({
      type: EmailRecordRef,
      resolve: async (parent) => {
        if (typeof parent?.replyEmailId !== 'number') {
          return null
        }

        const [replyEmail] = await db.orm.public.EmailRecord.where({
          id: parent.replyEmailId,
        }).all()

        return replyEmail ?? null
      },
    }),
    replyIntent: t.expose('replyIntent', { type: 'ReplyIntent' }),
  }),
})

EmailRecordRef.implement({
  description: 'An Email Record',
  fields: (t) => ({
    id: t.exposeID('id'),
    subject: t.exposeString('subject'),
    body: t.exposeString('body'),
    sentAt: t.expose('sentAt', {
      type: 'DateTime',
    }),
    bounced: t.exposeBoolean('bounced'),
    prospect: t.field({
      type: ProspectRef,
      resolve: async (parent) => {
        if (typeof parent?.prospectId !== 'number') {
          return null
        }

        const [prospect] = await db.orm.public.Prospect.where({
          id: parent.prospectId,
        }).all()

        return prospect ?? null
      },
    }),
  }),
})

builder.queryField('prospects', (t) =>
  t.field({
    type: [ProspectRef],
    description:
      'List of prospects, their contact details, and their status in the workflow sequence.',
    resolve: () => db.orm.public.Prospect.all(),
  })
)

const WorkflowStatusRef = builder.objectRef<WorkflowStatus>('WorkflowStatus')
WorkflowStatusRef.implement({
  fields: (t) => ({
    currentTime: t.expose('currentTime', {
      type: 'DateTime',
    }),
    waitIntervalDays: t.exposeInt('waitIntervalDays'),
  }),
})

console.log('querying')
console.log(await db.orm.public.WorkflowStatus.first())
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

      return db.orm.public.WorkflowStatus.where({
        id: workflowStatus.id,
      }).update({
        currentTime: addDays(workflowStatus.currentTime, days),
      })
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
