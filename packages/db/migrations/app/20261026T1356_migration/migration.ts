#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9a0ffec2632aed71ea2f9ffb83abd75c0be3980c448421d533c4cd7f2cf42622/contract';
import endContract from '../../snapshots/9a0ffec2632aed71ea2f9ffb83abd75c0be3980c448421d533c4cd7f2cf42622/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/eaa868448d8835a3d20840b645d15905594e382dff05fce814638c7fa94c72db/contract';
import startContract from '../../snapshots/eaa868448d8835a3d20840b645d15905594e382dff05fce814638c7fa94c72db/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ReplyEmails',
        columns: [
          col('body', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('intent', '"ReplyIntent"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'ReplyIntent' } },
          }),
          col('subject', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
