ALTER TABLE "transaction_logs" DROP CONSTRAINT "transaction_logs_user_id_hospital_user_id_fk";
--> statement-breakpoint
ALTER TABLE "doctor" DROP COLUMN IF EXISTS "doctor_number";--> statement-breakpoint
ALTER TABLE "transaction_logs" DROP COLUMN IF EXISTS "user_id";