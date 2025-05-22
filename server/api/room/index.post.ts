// import { InsertHospital, SelectHospital } from "~/utils/schema";

import { db } from '~/server/db/db';

import { InsertRoom, room } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const responsebody: InsertRoom = await readBody(event);
  try {
    const res = await db.insert(room).values(responsebody).returning();
    return res;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create room record',
    });
  }
});
