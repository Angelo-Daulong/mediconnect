import { eq, like, ilike } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { doctor } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { hospitalUserId } = query;

  if (!hospitalUserId) return await db.select().from(doctor);

  const res = await db
    .select()
    .from(doctor)
    .where(eq(doctor.hospitalId, Number(hospitalUserId)));

  if (res.length === 0) return [];

  return res;
});
