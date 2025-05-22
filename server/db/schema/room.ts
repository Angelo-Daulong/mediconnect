import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { hospital } from './hospital';
export const room = pgTable('room', {
  id: serial('id').primaryKey().notNull(),
  category: text('category').notNull(),
  roomName: text('room_name').notNull(),
  availability: boolean('availability').notNull(),
  hospitalId: integer('hospital_id').references(() => hospital.id),
});

export type InsertRoom = typeof room.$inferInsert;
export type SelectRoom = typeof room.$inferSelect;
