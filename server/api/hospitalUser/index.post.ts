// import { InsertHospital, SelectHospital } from "~/utils/schema";
import { db } from '~/server/db/db';

import { InsertHospitalUser, hospitalUser } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const responsebody: InsertHospitalUser = await readBody(event);

  const res = await db
    .insert(hospitalUser)
    .values(responsebody)
    .returning({ id: hospitalUser.id });

  return res[0];
});
