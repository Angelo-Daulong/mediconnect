import { eq, ne, and, ilike } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { room } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { hospitalUserId, categorySearch } = query;
  // console.log(query);

  // if (categorySearch && typeof categorySearch === 'string') {
  //   const res = await db
  //     .select({ category: room.category })
  //     .from(room)
  //     .where(
  //       and(
  //         eq(room.hospitalId, Number(hospitalUserId)),
  //         ne(room.availability, false),
  //         ilike(room.category, categorySearch)
  //       )
  //     );
  //   if (res.length === 0) return [];

  //   return res;
  // }
  if (!hospitalUserId && categorySearch && typeof categorySearch === 'string') {
    const res = await db
      .select()
      .from(room)
      .where(ilike(room.category, `%${categorySearch}%`));

    return res;
  }
  const res = await db
    .select()
    .from(room)
    .where(
      and(
        eq(room.hospitalId, Number(hospitalUserId)),
        eq(room.availability, true)
      )
    );

  return res;
});
