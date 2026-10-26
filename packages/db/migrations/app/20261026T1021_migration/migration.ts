#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/e12c73d9749995d0b664afff74aa3bd9431599306e57d7d16cfd7db0deede6e4/contract';
import startContract from '../../snapshots/e12c73d9749995d0b664afff74aa3bd9431599306e57d7d16cfd7db0deede6e4/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/efbf6d854e55cc05f89fbc954c19891cc271d89a117f224155a77ac17db26b72/contract';
import endContract from '../../snapshots/efbf6d854e55cc05f89fbc954c19891cc271d89a117f224155a77ac17db26b72/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ConversionMetrics',
        columns: [
          col('OooRate', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('bounceRate', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ignoreRate', 'int4', {
            notNull: true,
            default: lit(20),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('interested', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('meetingRate', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('notInterested', 'int4', {
            notNull: true,
            default: lit(15),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('referralRate', 'int4', {
            notNull: true,
            default: lit(2),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('unsubscribeRate', 'int4', {
            notNull: true,
            default: lit(40),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
