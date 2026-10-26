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

type ProspectStatusStats = {
  status: string
  count: number
  percent: number
}

type ProspectStats = {
  totalProspects: number
  activeProspects: number
  activePercent: number
  sendingTodayCount: number
  sendingTomorrowCount: number
  deactivatedProspects: number
  deactivatedPercent: number
  statusBreakdown: ProspectStatusStats[]
}

const ProspectStatusStatsRef = builder.objectRef<ProspectStatusStats>(
  'ProspectStatusStats'
)

ProspectStatusStatsRef.implement({
  fields: (t) => ({
    status: t.exposeString('status'),
    count: t.exposeInt('count'),
    percent: t.exposeFloat('percent'),
  }),
})

const ProspectStatsRef = builder.objectRef<ProspectStats>('ProspectStats')

ProspectStatsRef.implement({
  fields: (t) => ({
    totalProspects: t.exposeInt('totalProspects'),
    activeProspects: t.exposeInt('activeProspects'),
    activePercent: t.exposeFloat('activePercent'),
    sendingTodayCount: t.exposeInt('sendingTodayCount'),
    sendingTomorrowCount: t.exposeInt('sendingTomorrowCount'),
    deactivatedProspects: t.exposeInt('deactivatedProspects'),
    deactivatedPercent: t.exposeFloat('deactivatedPercent'),
    statusBreakdown: t.field({
      type: [ProspectStatusStatsRef],
      resolve: (parent) => parent.statusBreakdown,
    }),
  }),
})

builder.queryField('prospectStats', (t) =>
  t.field({
    description: 'Prospect counts and percentages by activation and status.',
    type: ProspectStatsRef,
    resolve: async () => {
      const prospects = await db.orm.public.Prospect.all()
      const totalProspects = prospects.length
      const deactivatedProspects = prospects.filter(
        (prospect) => prospect.isDeactivated
      ).length
      const activeProspects = totalProspects - deactivatedProspects

      const activeProspectsList = prospects.filter((p) => !p.isDeactivated)

      // Getting count to sent today and tomorrow
      const workflowStatus = await db.orm.public.WorkflowStatus.first()
      if (!workflowStatus) throw new Error('Workflow status is not configured')
      const waitFromDate = new Date()
      waitFromDate.setDate(
        waitFromDate.getDate() - workflowStatus.waitIntervalDays
      )
      /** Count of prospects to be sent today */
      const sendingTodayCount = activeProspectsList.filter(
        (p) =>
          new Date(p.lastSentAt.epochMilliseconds) < waitFromDate &&
          p.status !== 'follow_up_3_sent'
      ).length

      /** Count of prospects to be sent tomorrow */
      // const sendingTomorrowCount =
      //   activeProspectsList.filter((p) => {
      //     waitFromDate.setDate(waitFromDate.getDate() + 1)
      //     const lastSentAtDate = new Date(p.lastSentAt.epochMilliseconds)
      //     const msInADay = 24 * 60 * 60 * 1000

      //     const waitEndsAt =
      //       lastSentAtDate.getTime() +
      //       workflowStatus.waitIntervalDays * msInADay

      //     const now = Date.now()
      //     const tomorrow = now + msInADay

      //     const isBetween = waitEndsAt >= now && waitEndsAt <= tomorrow

      //     if (!isBetween) return false

      //     if (workflowStatus.waitIntervalDays > 1) {
      //       if (p.status === 'follow_up_3_sent') {
      //         return false
      //       }
      //       return true
      //     }

      //     if (
      //       p.status === 'follow_up_3_sent' ||
      //       p.status === 'follow_up_2_sent'
      //     ) {
      //       return false
      //     }

      //     return true
      //   }).length - sendingTodayCount

      const statusCounts = new Map<string, number>()

      for (const prospect of prospects) {
        statusCounts.set(
          prospect.status,
          (statusCounts.get(prospect.status) ?? 0) + 1
        )
      }

      const percentage = (count: number) =>
        totalProspects === 0 ? 0 : (count / totalProspects) * 100

      return {
        totalProspects,
        activeProspects,
        activePercent: percentage(activeProspects),
        sendingTodayCount,
        sendingTomorrowCount: 0,
        deactivatedProspects,
        deactivatedPercent: percentage(deactivatedProspects),
        statusBreakdown: Array.from(statusCounts, ([status, count]) => ({
          status,
          count,
          percent: percentage(count),
        })),
      }
    },
  })
)
