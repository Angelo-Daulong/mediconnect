import { db } from '~/server/db/db';
import { SelectHospitalUser, hospital } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (id) {
    const res = await db
      .delete(hospital)
      .where(eq(hospital.id, Number(id)))
      .returning({ deletedId: hospital.id });

    return res[0];
  }
  return { message: `No Hospital with ID: ${id} Exist` };
});
