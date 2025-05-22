ALTER TABLE "doctor" ADD COLUMN "duty_status" boolean;--> statement-breakpoint
ALTER TABLE "doctor" DROP COLUMN IF EXISTS "doctor_number";