import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './server/db/schema',
  out: './supabase/migrations',
  breakpoints: true,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    database: 'postgres',
    port: 5432,
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    user: 'postgres.cysiyognkqizymdgsfjx',
    password: '9aeFUbw8B4PriWOU',
  },
} satisfies Config;
