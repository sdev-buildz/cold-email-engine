#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/52635a2a1e3ec088f75ea8e816bcf2d3174244fc0806e9f4bad574214657db86/contract';
import startContract from '../../snapshots/52635a2a1e3ec088f75ea8e816bcf2d3174244fc0806e9f4bad574214657db86/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e12c73d9749995d0b664afff74aa3bd9431599306e57d7d16cfd7db0deede6e4/contract';
import endContract from '../../snapshots/e12c73d9749995d0b664afff74aa3bd9431599306e57d7d16cfd7db0deede6e4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'workflow-status',
        column: col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addPrimaryKey({
        schema: 'public',
        table: 'workflow-status',
        constraint: 'workflow-status_pkey',
        columns: ['id'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
