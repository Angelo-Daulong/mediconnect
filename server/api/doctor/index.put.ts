import { db } from '~/server/db/db';
import { InsertDoctor, doctor } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const body: InsertDoctor = await readBody(event);

  if (!body) return { message: `No Request Body` };

  if (body.id) {
    const res = await db
      .update(doctor)
      .set(body)
      .where(eq(doctor.id, Number(body.id)))
      .returning();
    // console.log(res[0]);
    return res[0];
  }

  return { message: `No Doctor with ID: ${body.id} Exist` };
});
