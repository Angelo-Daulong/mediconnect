import { db } from '~/server/db/db';
import { SelectDoctor, doctor } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const res = await db
    .select()
    .from(doctor)
    .where(eq(doctor.id, Number(id)));

  if (res.length === 0) return { message: 'No Doctor Exist' };

  return res[0];
});
