import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { adminUser, SelectAdmin } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const req: SelectAdmin = await readBody(event);

  const res = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.email, req.email));
  // console.log(res);
  if (res.length === 0) return false;

  if (res[0].password === req.password) return true;

  return false;
});
