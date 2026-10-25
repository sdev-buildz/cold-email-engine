#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3e7f8f3384837c616ab9ae13773d74f2341d25d48d84262801ec0ae562fb3bb5/contract';
import endContract from '../../snapshots/3e7f8f3384837c616ab9ae13773d74f2341d25d48d84262801ec0ae562fb3bb5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/4b199899f8cee55370d170a4b825db0b4ccdc256dba322c6d2165d8d29385936/contract';
import startContract from '../../snapshots/4b199899f8cee55370d170a4b825db0b4ccdc256dba322c6d2165d8d29385936/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropNotNull({ schema: 'public', table: 'Prospect', column: 'nextEmailId' }),
      this.dropNotNull({ schema: 'public', table: 'Prospect', column: 'replyEmailId' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
