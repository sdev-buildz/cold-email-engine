import { logger } from '@packages/logger'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import 'temporal-polyfill/full/global'
import '../dotenv-configured'
import type { Contract } from './contract'
import { initDb } from './db'

async function seedProducts(db: PostgresClient<Contract>) {
  // Start from an empty table so you can run this file more than once.
  await db.orm.public.Product.where({}).deleteAll()

  // Write: insert one row.
  const newProducts = await db.orm.public.Product.createAll([
    {
      name: 'Wireless Headphones',
      summary: 'Noise-cancelling over-ear headphones.',
      description:
        'Experience premium sound quality with active noise cancellation and 30-hour battery life.',
      price: 199,
      stockCount: 45,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300',
    },
    {
      name: 'Smart Watch',
      summary: 'Fitness tracker and smartwatch.',
      description:
        'Track your workouts, heart rate, and sleep with this sleek waterproof smartwatch.',
      price: 249,
      stockCount: 12,
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300',
    },
    {
      name: 'Mechanical Keyboard',
      summary: 'RGB backlit mechanical keyboard.',
      description:
        'High-performance backlit switches for a smooth typing experience.',
      price: 89,
      stockCount: 0,
      imageUrl:
        'https://images.unsplash.com/photo-1636352709172-ca33daf4daec?w=400&h=300',
    },
    {
      name: 'Bluetooth Speaker',
      summary: 'Portable waterproof speaker.',
      description:
        'Deep bass and crystal clear sound with 20-hour playtime and IPX7 rating.',
      price: 59,
      stockCount: 25,
      imageUrl:
        'https://images.unsplash.com/photo-1643385958950-8f0b8852171a?w=400&h=300',
    },
    {
      name: 'Ergonomic Mouse',
      summary: 'Wireless mouse for comfort.',
      description:
        'Reduce wrist strain with this vertical ergonomic wireless mouse.',
      price: 49,
      stockCount: 18,
      imageUrl:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300',
    },
    {
      name: 'Laptop Stand',
      summary: 'Adjustable aluminum stand.',
      description:
        'Elevate your laptop to eye level for better posture and cooling.',
      price: 35,
      stockCount: 60,
      imageUrl:
        'https://images.unsplash.com/photo-1629317480826-910f729d1709?w=400&h=300',
    },
  ])
  logger.info('Created: ', newProducts)
}

async function emailTemplates(db: PostgresClient<Contract>) {
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

  logger.info('Created templates =', newTemplates)
}

async function seedProspects(db: PostgresClient<Contract>) {
  // Start from an empty table so you can run this file more than once.
  //  This enables idempotency.
  await db.orm.public.Prospect.where({}).deleteAll()

  const newProspects = await db.orm.public.Prospect.createAll([
    {
      name: 'indian_name_1',
      company: 'tech-comp-1',
      email: 'name123@tech.com',
      role: 'sde',
      timezone: 'Asia/Kolkata',
      status: 'new',
    },
    {
      name: 'indian_name_2',
      company: 'tech-comp-2',
      email: 'name222@tech.com',
      role: 'sde',
      timezone: 'Asia/Kolkata',
      status: 'first_sent',
    },
  ])

  logger.info('Created Prospects =', newProspects)
}

async function main() {
  const db = initDb()

  // Start from an empty table so you can run this file more than once.
  await db.orm.public.User.where({}).deleteAll()

  // Write: insert one row.
  const alice = await db.orm.public.User.create({
    email: 'alice@prisma.io',
    userName: 'Alice',
  })
  logger.info('Created: ', alice)

  // Update: change one row, picked by its primary key.
  const renamed = await db.orm.public.User.where({ id: alice.id }).update({
    userName: 'Alice Smith',
  })
  logger.info('Updated: ', renamed)

  // Read: fetch every row.
  const users = await db.orm.public.User.all()
  logger.info('All users: ', users)

  await seedProducts(db)

  await seedProspects(db)

  await db.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
