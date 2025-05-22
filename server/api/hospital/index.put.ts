import { db } from '~/server/db/db';
import { InsertHospital, hospital } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const body: InsertHospital = await readBody(event);
  // console.log(body);
  const {
    id,
    name,
    services,
    address,
    description,
    contactNumber,
    latitude,
    longitude,
    status,
  } = body;

  if (!body) return { message: `No Request Body` };

  if (id) {
    const res = await db
      .update(hospital)
      .set(body)
      .where(eq(hospital.id, Number(id)))
      .returning();
    // console.log(res[0]);
    return res[0];
  }

  return { message: `No Hospital with ID: ${id} Exist` };
});
