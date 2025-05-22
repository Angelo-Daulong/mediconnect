import { db } from '~/server/db/db';
import { SelectHospitalUser, doctor } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (id) {
    const res = await db
      .delete(doctor)
      .where(eq(doctor.id, Number(id)))
      .returning();

    return res[0];
  }

  return { message: 'No Hospital User Exist' };
});
