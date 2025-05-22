import { db } from '~/server/db/db';
import { SelectHospitalUser, hospitalUser } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (id) {
    const res = await db
      .delete(hospitalUser)
      .where(eq(hospitalUser.id, id))
      .returning({ deletedId: hospitalUser.id });

    return res[0];
  }
  return { message: 'No Hospital User Exist' };
});
