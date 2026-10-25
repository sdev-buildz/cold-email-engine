#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4b199899f8cee55370d170a4b825db0b4ccdc256dba322c6d2165d8d29385936/contract';
import endContract from '../../snapshots/4b199899f8cee55370d170a4b825db0b4ccdc256dba322c6d2165d8d29385936/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/bbe30e4ef4d65678083d2027e6baf0ee1029f390ae8026d0a8a61b0a72600b3a/contract';
import startContract from '../../snapshots/bbe30e4ef4d65678083d2027e6baf0ee1029f390ae8026d0a8a61b0a72600b3a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropDefault({ schema: 'public', table: 'Prospect', column: 'replyIntent' })];
  }
}

MigrationCLI.run(import.meta.url, M);
