// import { InsertHospital, SelectHospital } from "~/utils/schema";
import { db } from '~/server/db/db';

import { InsertHospital, hospital } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const responsebody: InsertHospital = await readBody(event);

  const res = await db.insert(hospital).values(responsebody).returning();
  return res[0];
});
