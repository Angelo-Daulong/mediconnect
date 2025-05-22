import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const config = useRuntimeConfig();

const client = postgres(config.databaseUrl);
export const db = drizzle(client);
