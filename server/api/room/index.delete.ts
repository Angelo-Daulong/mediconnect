import { db } from '~/server/db/db';
import { room } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const params: { hospitalId: number } = getQuery(event);

  if (params.hospitalId) {
    const res = await db
      .delete(room)
      .where(eq(room.hospitalId, Number(params.hospitalId)))
      .returning();

    return res[0];
  }
  return { message: 'No Hospital User Exist' };
});
