import { db } from '~/server/db/db';
import { hospitalUser } from '~/utils/schema';

export default defineEventHandler(async () => {
  return await db.select().from(hospitalUser);
});
