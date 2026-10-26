import { logger } from '@packages/logger'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../contract'

/**
 * Inserts Email templates into the database.
 */
export async function seedEmailTemplates(db: PostgresClient<Contract>) {
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
