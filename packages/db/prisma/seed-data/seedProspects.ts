import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { logger } from '@packages/logger'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import { Temporal } from 'temporal-polyfill'
import type { Contract } from '../contract'

type SequenceStatus =
  | 'new'
  | 'first_sent'
  | 'follow_up_1_sent'
  | 'follow_up_2_sent'
  | 'follow_up_3_sent'
  | 'replied'
  | 'bounced'
  | 'unsubscribed'
  | 'deactivated'

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let currentValue = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        currentValue += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (character === ',' && !inQuotes) {
      values.push(currentValue)
      currentValue = ''
      continue
    }

    currentValue += character
  }

  values.push(currentValue)

  return values.map((value) => value.trim())
}

/**
 * Reads prospects from a CSV file.
 */
export async function readProspectsFromCsv() {
  const csvPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'test-data.csv'
  )
  const csvText = await readFile(csvPath, 'utf8')
  const [headerLine, ...dataLines] = csvText
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)

  if (!headerLine) {
    return []
  }

  const header = parseCsvLine(headerLine)

  return dataLines.map((line) => {
    const values = parseCsvLine(line)
    const row = Object.fromEntries(
      header.map((column, index) => [column, values[index] ?? ''])
    )

    const status = row.status as SequenceStatus
    return {
      name: row.name!,
      company: row.company!,
      role: row.role!,
      email: row.email!,
      timezone: row.timezone!,
      status,
      lastSentAt: Temporal.Instant.from(
        row['last-sent-at'] === ''
          ? '2026-10-25T00:17:07.151Z'
          : row['last-sent-at']!
      ),
      isDeactivated: Boolean(row.isDeactivated!),
    }
  })
}

/**
 * Inserts prospects into the database.
 */
export async function seedProspects(db: PostgresClient<Contract>) {
  // Start from an empty table so you can run this file more than once.
  //  This enables idempotency.
  await db.orm.public.Prospect.where({}).deleteAll()

  const prospects = await readProspectsFromCsv()

  for (let index = 0; index < prospects.length; index += 1000) {
    await db.orm.public.Prospect.createAll(prospects.slice(index, index + 1000))
  }

  logger.info('Created Prospects')
}
