import { db } from '~/server/db/db';
import { hospitalUser, InsertHospitalUser } from '~/utils/schema';
import { eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (id && typeof id === 'string') {
    const [currentRecord] = await db
      .select({ deleted: hospitalUser.deleted })
      .from(hospitalUser)
      .where(eq(hospitalUser.id, id));

    if (!currentRecord)
      throw createError({ statusCode: 404, message: 'Record not found' });

    const [updatedRecord] = await db
      .update(hospitalUser)
      .set({ deleted: !currentRecord.deleted })
      .where(eq(hospitalUser.id, id))
      .returning();

    return updatedRecord;
  }

  throw createError({ statusCode: 400, message: 'Invalid ID' });
});
