#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/9a0ffec2632aed71ea2f9ffb83abd75c0be3980c448421d533c4cd7f2cf42622/contract';
import startContract from '../../snapshots/9a0ffec2632aed71ea2f9ffb83abd75c0be3980c448421d533c4cd7f2cf42622/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f0e515c10fe5d113419f2d559239f87193cb60918e4514465fc896bada03a4fb/contract';
import endContract from '../../snapshots/f0e515c10fe5d113419f2d559239f87193cb60918e4514465fc896bada03a4fb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'blog' }),
      this.dropTable({ schema: 'public', table: 'product' }),
      this.dropTable({ schema: 'public', table: 'users' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
