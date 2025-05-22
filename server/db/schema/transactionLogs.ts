import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { hospitalUser } from './hospitalUser';

export const transactionLogs = pgTable('transaction_logs', {
  id: serial('id').primaryKey().notNull(),
  user: text('user'),
  timestamp: integer('timestamp').default(sql`extract(epoch from now())`),
  method: text('method'),
  endpoint: text('endpoint'),
  context: text('context'),
});

export type InsertTransactionLogs = typeof transactionLogs.$inferInsert;
export type SelectTransactionLogs = typeof transactionLogs.$inferSelect;
