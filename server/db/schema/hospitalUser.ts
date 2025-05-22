import { pgTable, uuid, varchar, text, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { hospital } from './hospital';

export const hospitalUser = pgTable('hospital_user', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  type: text('type').notNull().default('hospital'),
  deleted: boolean('deleted').default(false),
});

export const usersRelations = relations(hospitalUser, ({ one }) => ({
  hospital: one(hospital),
}));

export type InsertHospitalUser = typeof hospitalUser.$inferInsert;
export type SelectHospitalUser = typeof hospitalUser.$inferSelect;
