CREATE TABLE IF NOT EXISTS "admin_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"type" text DEFAULT 'admin' NOT NULL,
	CONSTRAINT "admin_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"services" text,
	"doctor_number" integer,
	"hospital_id" integer,
	CONSTRAINT "doctor_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hospital" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"services" text,
	"description" text,
	"address" text,
	"latitude" double precision,
	"longitude" double precision,
	"available_rooms" integer,
	"hospital_user_id" uuid NOT NULL,
	CONSTRAINT "hospital_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hospital_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"type" text DEFAULT 'hospital' NOT NULL,
	CONSTRAINT "hospital_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor" ADD CONSTRAINT "doctor_hospital_id_hospital_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospital"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hospital" ADD CONSTRAINT "hospital_hospital_user_id_hospital_user_id_fk" FOREIGN KEY ("hospital_user_id") REFERENCES "public"."hospital_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "hospital_user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();ALTER TABLE "admin_user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "hospital" ADD COLUMN "contact_number" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "hospital" ADD CONSTRAINT "hospital_contact_number_unique" UNIQUE("contact_number");ALTER TABLE "hospital" ALTER COLUMN "contact_number" DROP NOT NULL;CREATE TABLE IF NOT EXISTS "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_name" text NOT NULL,
	"availability" boolean NOT NULL,
	"hospital_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room" ADD CONSTRAINT "room_hospital_id_hospital_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospital"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "hospital" ADD COLUMN "status" boolean;--> statement-breakpoint
ALTER TABLE "hospital" DROP COLUMN IF EXISTS "available_rooms";ALTER TABLE "doctor" ADD COLUMN "duty_status" boolean;--> statement-breakpoint
ALTER TABLE "doctor" DROP COLUMN IF EXISTS "doctor_number";ALTER TABLE "doctor" ADD COLUMN "doctor_number" integer;CREATE TABLE IF NOT EXISTS "transaction_logs" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "unique_hospital_name" ON "doctor" USING btree ("hospital_id","name");ALTER TABLE "doctor" DROP CONSTRAINT "doctor_name_unique";ALTER TABLE "transaction_logs" DROP CONSTRAINT "transaction_logs_user_id_hospital_user_id_fk";
--> statement-breakpoint
ALTER TABLE "doctor" DROP COLUMN IF EXISTS "doctor_number";--> statement-breakpoint
ALTER TABLE "transaction_logs" DROP COLUMN IF EXISTS "user_id";ALTER TABLE "transaction_logs" ADD COLUMN "context" text;ALTER TABLE "doctor" ADD COLUMN "day_available" text;ALTER TABLE "room" ADD COLUMN "category" text NOT NULL;ALTER TABLE "hospital_user" ADD COLUMN "deleted" boolean DEFAULT false;