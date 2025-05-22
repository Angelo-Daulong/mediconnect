import { db } from '~/server/db/db';
import { InsertHospital, hospital } from '~/utils/schema';
import { sql, eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body: InsertHospital = await readBody(event);
  const {
    name,
    services,
    address,
    description,
    contactNumber,
    latitude,
    longitude,
    // availableRooms,
  } = body;

  if (!body) return { message: `No Request Body` };

  if (id) {
    const res = await db
      .update(hospital)
      .set({
        name: name,
        services: services,
        address: address,
        description: description,
        contactNumber: contactNumber,
        latitude: latitude,
        longitude: longitude,
        // availableRooms: availableRooms,
      })
      .where(eq(hospital.id, Number(id)))
      .returning();

    return res[0];
  }
  return { message: `No Hospital with ID: ${id} Exist` };
});
