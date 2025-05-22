import { db } from '~/server/db/db';
import { SelectHospitalUser, hospitalUser } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) return { message: 'No Id' };

  const res = await db
    .select()
    .from(hospitalUser)
    .where(eq(hospitalUser.id, id));

  if (res.length === 0) return { message: 'No Hospital User Exist' };

  const user = res[0];
  return { id: user.id, email: user.email, password: user.password };
});
