// import { InsertHospital, SelectHospital } from "~/utils/schema";

import { db } from '~/server/db/db';

import { InsertDoctor, doctor } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const responsebody: InsertDoctor = await readBody(event);
  try {
    const res = await db.insert(doctor).values(responsebody).returning();
    return res;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create doctor record',
    });
  }
});
