import { initDb } from '@packages/db'
import type { EmailRecord, Prospect } from '../util/types'
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
