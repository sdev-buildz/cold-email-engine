import { logger } from '@packages/logger'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import { Temporal } from 'temporal-polyfill'
import 'temporal-polyfill/full/global'
import '../dotenv-configured'
import type { Contract } from './contract'
import { initDb } from './db'
import { seedProspects } from './seed-data/seedProspects'

async function seedEmailTemplates(db: PostgresClient<Contract>) {
  // Start from an empty table so you can run this file more than once.
  //  This enables idempotency.
  await db.orm.public.EmailTemplate.where({}).deleteAll()

  const bodyFooter = `
Sincerely,
Developer at MnemioAI

To unsubscribe, click <a href="https://mnemio.ai.example.com/unsubscribe?email=<email>">unsubscribe</a>
  `

  const newTemplates = await db.orm.public.EmailTemplate.createAll([
    {
      sequence_state: 'first_sent',
      subject: `Introducing MnemioAI!`,
      body: `
        Hi <name>,
        
        Introducing MnemioAI! 

        An AI agent for everyone on your team.

        Connected to 1500+ apps.
        
        Week one: Dev shows his agent how he builds the ads report.
        Weak four: The report builds itself.

        Lena changes her outreach offer. Her agent sees it working.
        Then the rest of the sales team hears about it.

        Agents share what's useful with the company brain.

        Their agent's memory moves to the next person.

        ${bodyFooter}
      `,
    },
  ])

  logger.info('Created templates =', newTemplates.length)
}

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

  const newConversionMetrics = await db.orm.public.ConversionMetrics.create({})

  logger.info('Created ConversionMetrics =', newConversionMetrics.length)
}

async function main() {
  const db = initDb()

  await seedProspects(db)
  await seedWorkflowStatus(db)
  await seedEmailTemplates(db)
  await seedConversionMetrics(db)

  await db.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
