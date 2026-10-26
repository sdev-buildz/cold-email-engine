#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3d9b9584bf9aeafd1795335558811f7cdccb0c5b0125fd73c87e4e48cab4c9b0/contract';
import startContract from '../../snapshots/3d9b9584bf9aeafd1795335558811f7cdccb0c5b0125fd73c87e4e48cab4c9b0/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/52635a2a1e3ec088f75ea8e816bcf2d3174244fc0806e9f4bad574214657db86/contract';
import endContract from '../../snapshots/52635a2a1e3ec088f75ea8e816bcf2d3174244fc0806e9f4bad574214657db86/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'workflow-status',
        columns: [
          col('currentTime', 'timestamptz', {
            notNull: true,
            default: lit('2026-10-26T00:00:00Z'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('waitIntervalDays', 'int4', {
            notNull: true,
            default: lit(3),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
