import { defineConfig as ormConfig } from '@prisma/orm-postgres/config'
import 'dotenv/config'
import path from 'node:path'
import { definePrismaConfig } from 'prisma/config'

export default definePrismaConfig({
  orm: ormConfig({
    contract: path.join(import.meta.dirname, './prisma/contract.prisma'),
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
  skills: {
    check: false,
  },
} as Parameters<typeof definePrismaConfig>[0])
