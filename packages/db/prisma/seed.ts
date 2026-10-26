import { logger } from '@packages/logger'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import { Temporal } from 'temporal-polyfill'
import 'temporal-polyfill/full/global'
import '../dotenv-configured'
import type { Contract } from './contract'
import { initDb } from './db'
import { seedEmailTemplates } from './seed-data/seedEnailTemplates'
import { seedProspects } from './seed-data/seedProspects'
import { seedReplyEmails } from './seed-data/seedReplyEmails'

async function seedWorkflowStatus(db: PostgresClient<Contract>) {
  // Start from an empty table so you can run this file more than once.
  //  This enables idempotency.
  await db.orm.public.WorkflowStatus.where({}).deleteAll()

  const newWorkflowStatus = await db.orm.public.WorkflowStatus.create({
    currentTime: Temporal.Instant.from('2026-10-26T00:00:00Z'),
    waitIntervalDays: 3,
  })

  logger.info('Created WorkflowStatus =', newWorkflowStatus ? 'true' : 'no')
}

async function seedConversionMetrics(db: PostgresClient<Contract>) {
  // Start from an empty table so you can run this file more than once.
  //  This enables idempotency.
  await db.orm.public.ConversionMetrics.where({}).deleteAll()

  await db.orm.public.ConversionMetrics.create({})

  logger.info('Created ConversionMetrics')
}

async function main() {
  const db = initDb()

  await seedProspects(db)
  await seedWorkflowStatus(db)
  await seedEmailTemplates(db)
  await seedConversionMetrics(db)
  await seedReplyEmails(db)

  await db.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
