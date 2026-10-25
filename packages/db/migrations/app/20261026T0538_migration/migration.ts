#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3d9b9584bf9aeafd1795335558811f7cdccb0c5b0125fd73c87e4e48cab4c9b0/contract';
import endContract from '../../snapshots/3d9b9584bf9aeafd1795335558811f7cdccb0c5b0125fd73c87e4e48cab4c9b0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/3e7f8f3384837c616ab9ae13773d74f2341d25d48d84262801ec0ae562fb3bb5/contract';
import startContract from '../../snapshots/3e7f8f3384837c616ab9ae13773d74f2341d25d48d84262801ec0ae562fb3bb5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'EmailTemplate',
        columns: [
          col('body', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sequence_state', '"SequenceStatus"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'SequenceStatus' } },
          }),
          col('subject', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
