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
