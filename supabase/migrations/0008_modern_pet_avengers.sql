CREATE TABLE IF NOT EXISTS "transaction_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text,
	"timestamp" integer DEFAULT extract(epoch from now()),
	"method" text,
	"endpoint" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_logs" ADD CONSTRAINT "transaction_logs_user_id_hospital_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hospital_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_hospital_name" ON "doctor" USING btree ("hospital_id","name");