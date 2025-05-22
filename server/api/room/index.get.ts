import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { room } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { hospitalUserId } = query;

  if (!hospitalUserId) return await db.select().from(room);

  const res = await db
    .select()
    .from(room)
    .where(eq(room.hospitalId, Number(hospitalUserId)));

  if (res.length === 0) return [];

  return res;
});
