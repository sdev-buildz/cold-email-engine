import { initDb } from '@packages/db'
import type { Models } from '@packages/db/types'
import { typedObjectEntries, typedObjectFromEntries } from 'ts-strict-utils'
import { builder } from './lib/builder'

type ConversionMetrics = Models.public_ConversionMetrics

/** DB client */
const db = initDb()

const ConversionMetricsRef =
  builder.objectRef<ConversionMetrics>('ConversionMetrics')

ConversionMetricsRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    bounceRate: t.exposeFloat('bounceRate'),
    ignoreRate: t.exposeFloat('ignoreRate'),
    unsubscribeRate: t.exposeFloat('unsubscribeRate'),
    notInterested: t.exposeFloat('notInterested'),
    oooRate: t.exposeFloat('oooRate'),
    referralRate: t.exposeFloat('referralRate'),
    interested: t.exposeFloat('interested'),
    meetingRate: t.exposeFloat('meetingRate'),
  }),
})

builder.queryField('conversionMetrics', (t) =>
  t.field({
    description: 'Conversion metrics',
    type: ConversionMetricsRef,
    resolve: () => db.orm.public.ConversionMetrics.first(),
  })
)

const ConversionMetricsInput = builder.inputType('ConversionMetricsInput', {
  description: 'Conversion metrics input',
  fields: (t) =>
    ({
      bounceRate: t.int(),
      ignoreRate: t.int(),
      unsubscribeRate: t.int(),
      notInterested: t.int(),
      oooRate: t.int(),
      referralRate: t.int(),
      interested: t.int(),
      meetingRate: t.int(),
    }) satisfies Record<
      Extract<keyof Omit<ConversionMetrics, 'id'>, string>,
      unknown
    >,
})

builder.mutationField('configureConversionMetrics', (t) =>
  t.field({
    description: 'Configure conversion metrics',
    type: ConversionMetricsRef,
    args: {
      metrics: t.arg({
        type: ConversionMetricsInput,
        required: true,
      }),
    },
    resolve: async (_, { metrics }) => {
      const prev = await db.orm.public.ConversionMetrics.first()
      if (!prev) {
        throw new Error('Workflow status is not configured')
      }

      const updates = typedObjectFromEntries(
        typedObjectEntries(metrics).filter(
          (entry): entry is [keyof typeof metrics, number] =>
            typeof entry[1] === 'number'
        )
      )

      return db.orm.public.ConversionMetrics.where({ id: prev.id }).update(
        updates
      )
    },
  })
)
