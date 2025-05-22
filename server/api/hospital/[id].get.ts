import { db } from '~/server/db/db';
import { SelectHospital, hospital } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!isNaN(Number(id))) {
    const res = await db
      .select()
      .from(hospital)
      .where(eq(hospital.id, Number(id)));

    if (res.length === 0)
      return { message: `No Hospital with ID: ${id} Exist` };

    return res[0];
  }
  if (typeof id === 'string') {
    const res = await db
      .select()
      .from(hospital)
      .where(eq(hospital.hospitalUserId, id));

    if (res.length === 0)
      return { message: `No Hospital with ID: ${id} Exist` };

    return res[0];
  }
});
