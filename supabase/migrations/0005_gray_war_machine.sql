ALTER TABLE "hospital" ADD COLUMN "status" boolean;--> statement-breakpoint
ALTER TABLE "hospital" DROP COLUMN IF EXISTS "available_rooms";