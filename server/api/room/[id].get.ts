import { db } from '~/server/db/db';
import { room } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const res = await db
    .select()
    .from(room)
    .where(eq(room.id, Number(id)));

  if (res.length === 0) return { message: 'No Doctor Exist' };

  return res[0];
});
