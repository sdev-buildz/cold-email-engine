#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/96fbccd216e706bc7b5e8c3f867f352c494f3ed666acb4cdbb258e95bceac79a/contract';
import endContract from '../../snapshots/96fbccd216e706bc7b5e8c3f867f352c494f3ed666acb4cdbb258e95bceac79a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/efbf6d854e55cc05f89fbc954c19891cc271d89a117f224155a77ac17db26b72/contract';
import startContract from '../../snapshots/efbf6d854e55cc05f89fbc954c19891cc271d89a117f224155a77ac17db26b72/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'ConversionMetrics', column: 'OooRate' }),
      this.addColumn({
        schema: 'public',
        table: 'ConversionMetrics',
        column: col('oooRate', 'int4', {
          notNull: true,
          default: lit(5),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
