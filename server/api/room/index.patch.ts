import { db } from '~/server/db/db';
import { room, InsertRoom } from '~/utils/schema';
import { eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  const body: InsertRoom = await readBody(event);
  if (body.id) {
    const res = await db
      .update(room)
      .set({
        roomName: body.roomName,
        availability: body.availability,
        category: body.category,
      })
      .where(eq(room.id, body.id))
      .returning();

    return res[0];
  }
});
