import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import {
  hospitalUser,
  SelectHospitalUser,
  hospital,
  SelectHospital,
} from '~/utils/schema';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const req: SelectHospitalUser = await readBody(event);

  const res = await db
    .select()
    .from(hospitalUser)
    .where(eq(hospitalUser.email, req.email));

  if (res.length === 0 || res[0].deleted) {
    return false;
  }
  const hashPassword = req.password;
  // const hashPassword = await $fetch('/api/hash', {
  //   method: 'POST',
  //   params: {
  //     inputPassword: req.password,
  //   },
  // });

  if (hashPassword === res[0].password) {
    const hospitalDetails = await db
      .select()
      .from(hospital)
      .where(eq(hospital.hospitalUserId, res[0].id));

    return hospitalDetails[0];
  }

  return false;
});
