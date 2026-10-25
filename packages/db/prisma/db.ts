import postgres from '@prisma/orm-postgres/runtime'
import '../dotenv-configured'
import type { Contract } from './contract'
import contractJson from './contract.json' with { type: 'json' }

/** Get a new DB client instance */
export const initDb = () => {
  const db = postgres<Contract>({
    contractJson,
    url: process.env['DATABASE_URL']!,
  })

  return db
}
