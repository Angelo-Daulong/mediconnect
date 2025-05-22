import { InsertTransactionLogs, transactionLogs } from '~/utils/schema';
import { db } from '~/server/db/db';
export default defineEventHandler(async (event) => {
  const body: InsertTransactionLogs = await readBody(event);
  if (body.user) {
    try {
      const response = await db
        .insert(transactionLogs)
        .values(body)
        .returning();
      return response[0];
    } catch (error) {
      console.log(error);
    }
  }
});
