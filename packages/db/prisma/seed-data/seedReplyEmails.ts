import { logger } from '@packages/logger'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../contract'

/**
 /// The user wants more information, demo, or a pricing sheet
  INTERESTED = "interested"

  /// The user explicitly declines the offer but is polite.
  NOT_INTERESTED = "not_interested"

  /// The user wants to be removed from the list.
  UNSUBSCRIBE = "unsubscribe"

  /// Automated replies.
  OUT_OF_OFFICE = "out_of_office"

  /// The user directly proposes a time or asks for a booking link.
  MEETING_SCHEDULED = "meeting_scheduled"

  /// The contact says they aren't the right decision-maker but sometimes provides the correct contact.
  REFERRAL = "referral"
  
  /// Coudn't classify as any of the obove classes.
  OTHERS = "others"
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
Developer
  `

  const newTemplates = await db.orm.public.ReplyEmails.createAll([
    {
      intent: 'interested',
      subject: `I am interested!`,
      body: `
        Hi MnemioAI team,
        
        I am interested!
        
        ${bodyFooter}
      `,
    },
    {
      intent: 'not_interested',
      subject: `Thanks for reaching out`,
      body: `
        Hi MnemioAI team,

        Thanks for reaching out. We are not interested at this time, but
        appreciate you thinking of us.

        ${bodyFooter}
      `,
    },
    {
      intent: 'unsubscribe',
      subject: `Please remove me from your list`,
      body: `
        Hi MnemioAI team,

        Please remove me from your mailing list. Thank you.

        ${bodyFooter}
      `,
    },
    {
      intent: 'out_of_office',
      subject: `Out of office`,
      body: `
        Hi,

        I am currently out of the office and will reply when I return.

        ${bodyFooter}
      `,
    },
    {
      intent: 'meeting_scheduled',
      subject: `Let's schedule a meeting`,
      body: `
        Hi MnemioAI team,

        I'd be happy to meet and learn more. Please send me a booking link
        or let me know what times work for you.

        ${bodyFooter}
      `,
    },
    {
      intent: 'referral',
      subject: `A better contact`,
      body: `
        Hi MnemioAI team,

        I am not the right person to discuss this. Please reach out to
        <name> at <company> instead.

        ${bodyFooter}
      `,
    },
    {
      intent: 'others',
      subject: `Re: your message`,
      body: `
        Hi MnemioAI team,

        Thanks for your message. Could you share a little more information
        about what you have in mind?

        ${bodyFooter}
      `,
    },
  ])

  logger.info('Created templates =', newTemplates.length)
}
