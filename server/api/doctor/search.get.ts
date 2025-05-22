import { eq, ne, ilike } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { doctor } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { id, name, services } = query;

  if (name && typeof name === 'string') {
    const service = await db
      .select()
      .from(doctor)
      .where(ilike(doctor.name, `%${name}%`));

    return service;
  }
  if (services && typeof services === 'string') {
    const service = await db
      .select()
      .from(doctor)
      .where(ilike(doctor.services, `%${services}%`));

    return service;
  }

  if (!id) return await db.select().from(doctor);

  const res = await db
    .select()
    .from(doctor)
    .where(ne(doctor.hospitalId, Number(id)));

  if (res.length === 0) return [];

  return res;
});
