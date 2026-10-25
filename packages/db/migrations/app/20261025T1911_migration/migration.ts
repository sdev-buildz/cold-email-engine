#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/70ff956f0c715e3b21d41ca1912472f7c04486be0dee6ed8d2d8f44f02a3315c/contract';
import startContract from '../../snapshots/70ff956f0c715e3b21d41ca1912472f7c04486be0dee6ed8d2d8f44f02a3315c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/bbe30e4ef4d65678083d2027e6baf0ee1029f390ae8026d0a8a61b0a72600b3a/contract';
import endContract from '../../snapshots/bbe30e4ef4d65678083d2027e6baf0ee1029f390ae8026d0a8a61b0a72600b3a/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'EmailStatus',
        members: ['sent', 'failed', 'pending'],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'ReplyIntent',
        members: [
          'interested',
          'not_interested',
          'unsubscribe',
          'out_of_office',
          'meeting_scheduled',
          'referral',
          'others',
        ],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'SequenceStatus',
        members: [
          'new',
          'first_sent',
          'follow_up_1_sent',
          'follow_up_2_sent',
          'follow_up_3_sent',
          'replied',
          'bounced',
          'unsubscribed',
          'deactivated',
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'EmailRecord',
        columns: [
          col('body', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('bounced', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('prospectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sentAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('status', '"EmailStatus"', {
            notNull: true,
            default: lit('pending'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'EmailStatus' } },
          }),
          col('subject', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Prospect',
        columns: [
          col('company', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isDeactivated', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nextEmailId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('replyEmailId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('replyIntent', '"ReplyIntent"', {
            default: lit(null),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'ReplyIntent' } },
          }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', '"SequenceStatus"', {
            notNull: true,
            default: lit('new'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'SequenceStatus' } },
          }),
          col('timezone', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('waitDays', 'int2', {
            notNull: true,
            default: lit(3),
            codecRef: { codecId: 'pg/int2@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'EmailRecord',
        index: 'EmailRecord_prospectId_idx_ac586e70',
        columns: ['prospectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Prospect',
        index: 'Prospect_nextEmailId_idx_753fd109',
        columns: ['nextEmailId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Prospect',
        index: 'Prospect_replyEmailId_idx_947d2a5c',
        columns: ['replyEmailId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'EmailRecord',
        foreignKey: {
          name: 'EmailRecord_prospectId_fkey',
          columns: ['prospectId'],
          references: { schema: 'public', table: 'Prospect', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Prospect',
        foreignKey: {
          name: 'Prospect_nextEmailId_fkey',
          columns: ['nextEmailId'],
          references: { schema: 'public', table: 'EmailRecord', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Prospect',
        foreignKey: {
          name: 'Prospect_replyEmailId_fkey',
          columns: ['replyEmailId'],
          references: { schema: 'public', table: 'EmailRecord', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
