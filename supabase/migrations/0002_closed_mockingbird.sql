ALTER TABLE "admin_user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "hospital" ADD COLUMN "contact_number" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "hospital" ADD CONSTRAINT "hospital_contact_number_unique" UNIQUE("contact_number");