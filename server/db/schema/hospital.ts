import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  doublePrecision,
  numeric,
  bigint,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { hospitalUser } from './hospitalUser';

export const hospital = pgTable('hospital', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull().unique(),
  services: text('services'),
  description: text('description'),
  address: text('address'),
  contactNumber: bigint('contact_number', { mode: 'number' }).unique(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  status: boolean('status'),
  hospitalUserId: uuid('hospital_user_id')
    .references(() => hospitalUser.id)
    .notNull(),
});

export type InsertHospital = typeof hospital.$inferInsert;

export type SelectHospital = typeof hospital.$inferSelect;
