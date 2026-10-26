import { logger } from '@packages/logger';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import type { Contract } from '../contract';

/**
  "new"
  "first_sent"
  "follow_up_1_sent"
  "follow_up_2_sent"
  "follow_up_3_sent"
  "replied"
  "bounced"
  "unsubscribed"
  "deactivated"
}
*/

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
    {
      sequence_state: 'follow_up_1_sent',
      subject: `Following up on MnemioAI`,
      body: `
        Hi <name>,

        I wanted to follow up on my note about MnemioAI.

        It helps teams share useful workflows and give their AI agents
        company-wide context. Would you be open to a quick conversation about
        how it could help <company>?

        ${bodyFooter}
      `,
    },
    {
      sequence_state: 'follow_up_2_sent',
      subject: `Re: Introducing MnemioAI`,
      body: `
        Hi <name>,

        Just checking whether improving how your team shares knowledge is a
        priority for <company>. MnemioAI helps agents learn from useful work
        across the team, so those insights can benefit everyone.

        Is this something you'd be interested in exploring?

        ${bodyFooter}
      `,
    },
    {
      sequence_state: 'follow_up_3_sent',
      subject: `Should I close the loop?`,
      body: `
        Hi <name>,

        I know things get busy, so I'll make this my last follow-up. If helping
        your team share workflows and context with AI agents is worth discussing,
        just reply and we can find a time.

        If not, no worries at all.

        ${bodyFooter}
      `,
    },
  ])

  logger.info('Created templates =', newTemplates.length)
}
