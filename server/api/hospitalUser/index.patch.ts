import { db } from '~/server/db/db';
import { hospitalUser, InsertHospitalUser } from '~/utils/schema';
import { eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const body: InsertHospitalUser = await readBody(event);
  if (body.id) {
    const res = await db
      .update(hospitalUser)
      .set({
        email: body.email,
        password: body.password,
      })
      .where(eq(hospitalUser.id, body.id))
      .returning();

    const user = res[0];

    return {
      id: user.id,
      email: user.email,
    };
  }
});
