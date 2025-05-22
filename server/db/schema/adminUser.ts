import { pgTable, uuid, text, varchar } from 'drizzle-orm/pg-core';

export const adminUser = pgTable('admin_user', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  type: text('type').notNull().default('admin'),
});

export type InsertAdmin = typeof adminUser.$inferInsert;
export type SelectAdmin = typeof adminUser.$inferSelect;
