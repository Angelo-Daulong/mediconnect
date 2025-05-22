import { db } from '~/server/db/db';
import { transactionLogs } from '~/utils/schema';

export default defineEventHandler(async (event) => {
  const res = await db
    .select()
    .from(transactionLogs)
    .orderBy(transactionLogs.timestamp);

  if (res.length === 0) return [];

  const sortedRes = res.sort((a, b) => {
    // Handle null timestamps by replacing them with 0
    const timestampA = a.timestamp ?? 0;
    const timestampB = b.timestamp ?? 0;

    return timestampB - timestampA;
  });

  return sortedRes;
});
