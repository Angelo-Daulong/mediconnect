import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  doublePrecision,
  numeric,
  integer,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { hospital } from './hospital';

export const doctor = pgTable(
  'doctor',
  {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    services: text('services'),
    // number: integer('doctor_number'),
    dutyStatus: boolean('duty_status'),
    dayAvailable: text('day_available'),
    hospitalId: integer('hospital_id').references(() => hospital.id),
  },
  (table) => ({
    uniqueHospitalName: uniqueIndex('unique_hospital_name').on(
      table.hospitalId,
      table.name
    ),
  })
);

export type InsertDoctor = typeof doctor.$inferInsert;
export type SelectDoctor = typeof doctor.$inferSelect;
