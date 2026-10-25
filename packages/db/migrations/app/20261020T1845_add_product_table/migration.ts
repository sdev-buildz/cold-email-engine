#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/70ff956f0c715e3b21d41ca1912472f7c04486be0dee6ed8d2d8f44f02a3315c/contract'
import endContract from '../../snapshots/70ff956f0c715e3b21d41ca1912472f7c04486be0dee6ed8d2d8f44f02a3315c/contract.json' with { type: 'json' }
import type { Contract as Start } from '../../snapshots/7edffe642550a8e7d63c54485547013011671b26b68284252976540b83cb58b1/contract'
import startContract from '../../snapshots/7edffe642550a8e7d63c54485547013011671b26b68284252976540b83cb58b1/contract.json' with { type: 'json' }
import {
  Migration,
  MigrationCLI,
  col,
  primaryKey,
} from '@prisma/orm-postgres/migration'

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract
  override readonly endContractJson = endContract

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'product',
        columns: [
          col('description', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('imageUrl', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('name', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('price', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('stockCount', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('summary', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ]
  }
}

MigrationCLI.run(import.meta.url, M)
