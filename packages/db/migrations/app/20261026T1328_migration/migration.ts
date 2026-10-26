#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/96fbccd216e706bc7b5e8c3f867f352c494f3ed666acb4cdbb258e95bceac79a/contract';
import startContract from '../../snapshots/96fbccd216e706bc7b5e8c3f867f352c494f3ed666acb4cdbb258e95bceac79a/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/eaa868448d8835a3d20840b645d15905594e382dff05fce814638c7fa94c72db/contract';
import endContract from '../../snapshots/eaa868448d8835a3d20840b645d15905594e382dff05fce814638c7fa94c72db/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Prospect',
        column: col('lastSentAt', 'timestamptz', {
          notNull: true,
          default: lit('2026-10-25T00:00:00Z'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
